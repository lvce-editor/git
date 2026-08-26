import { getRelativePath } from '../GetRelativePath/GetRelativePath.ts'

interface TextDocument {
  readonly uri: string
}

interface ExecResult {
  readonly exitCode: number
  readonly stdout: string
}

export interface InlineBlameDependencies {
  readonly execute: (command: string, args: readonly string[], options: Readonly<Record<string, unknown>>) => Promise<ExecResult>
  readonly getInlineBlameEnabled: () => Promise<unknown>
  readonly getWorkspaceFolder: () => Promise<string> | string
}

interface BlameInfo {
  readonly author: string
  readonly authorTime: number
  readonly summary: string
}

const parseBlameInfo = (output: string): BlameInfo | undefined => {
  let author = ''
  let authorTime = 0
  let summary = ''
  for (const line of output.split('\n')) {
    if (line.startsWith('author ')) {
      author = line.slice('author '.length)
    } else if (line.startsWith('author-time ')) {
      authorTime = Number(line.slice('author-time '.length))
    } else if (line.startsWith('summary ')) {
      summary = line.slice('summary '.length)
    }
  }
  if (!author || !summary) {
    return undefined
  }
  return { author, authorTime, summary }
}

const formatBlameInfo = ({ author, authorTime, summary }: BlameInfo): string => {
  const date = Number.isFinite(authorTime) && authorTime > 0 ? new Date(authorTime * 1000).toISOString().slice(0, 10) : ''
  return date ? `${author}, ${date} • ${summary}` : `${author} • ${summary}`
}

export const createProvideInlineBlame = (dependencies: InlineBlameDependencies) => {
  return async (textDocument: TextDocument, rowIndex: number): Promise<{ readonly text: string } | undefined> => {
    if ((await dependencies.getInlineBlameEnabled()) !== true) {
      return undefined
    }
    const workspaceFolder = await dependencies.getWorkspaceFolder()
    if (!workspaceFolder) {
      return undefined
    }
    const relativePath = getRelativePath(workspaceFolder, textDocument.uri)
    if (!relativePath) {
      return undefined
    }
    const lineNumber = rowIndex + 1
    const { exitCode, stdout } = await dependencies.execute(
      'git',
      ['blame', '--line-porcelain', '-L', `${lineNumber},${lineNumber}`, '--', relativePath],
      {
        cwd: workspaceFolder,
        reject: false,
      },
    )
    if (exitCode !== 0) {
      return undefined
    }
    const blameInfo = parseBlameInfo(stdout)
    return blameInfo ? { text: formatBlameInfo(blameInfo) } : undefined
  }
}
