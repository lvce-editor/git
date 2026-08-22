import { getRelativePath } from '../GetRelativePath/GetRelativePath.ts'
import { getAlignmentMaps } from '../LineDiff/LineDiff.ts'

interface TextDocument {
  readonly text: string
  readonly uri: string
}

interface ExecResult {
  readonly exitCode: number
  readonly stdout: string
}

export interface GutterDecorationDependencies {
  readonly execute: (command: string, args: readonly string[], options: Readonly<Record<string, unknown>>) => Promise<ExecResult>
  readonly getGutterDecorationsEnabled: () => Promise<unknown>
  readonly getWorkspaceFolder: () => Promise<string> | string
}

export interface GutterDecoration {
  readonly rowIndex: number
  readonly type: 'added' | 'deleted' | 'modified'
}

const splitLines = (text: string): readonly string[] => {
  const normalized = text.replaceAll('\r\n', '\n')
  if (!normalized) {
    return []
  }
  const content = normalized.endsWith('\n') ? normalized.slice(0, -1) : normalized
  return content.split('\n')
}

export const getGutterDecorations = (oldText: string, newText: string): readonly GutterDecoration[] => {
  if (oldText === newText) {
    return []
  }
  const oldLines = splitLines(oldText)
  const newLines = splitLines(newText)
  const { newMap } = getAlignmentMaps(oldLines, newLines)
  const matches = newMap.flatMap((oldIndex, newIndex) => (typeof oldIndex === 'number' ? [{ newIndex, oldIndex }] : []))
  const decorations: GutterDecoration[] = []
  let oldStart = 0
  let newStart = 0
  for (const match of [...matches, { newIndex: newLines.length, oldIndex: oldLines.length }]) {
    const oldCount = match.oldIndex - oldStart
    const newCount = match.newIndex - newStart
    const modifiedCount = Math.min(oldCount, newCount)
    for (let index = 0; index < modifiedCount; index++) {
      decorations.push({ rowIndex: newStart + index, type: 'modified' })
    }
    for (let index = modifiedCount; index < newCount; index++) {
      decorations.push({ rowIndex: newStart + index, type: 'added' })
    }
    if (oldCount > 0 && newCount === 0) {
      const rowIndex = Math.max(0, Math.min(newStart, newLines.length - 1))
      decorations.push({ rowIndex, type: 'deleted' })
    }
    oldStart = match.oldIndex + 1
    newStart = match.newIndex + 1
  }
  return decorations
}

export const createProvideGutterDecorations = (dependencies: GutterDecorationDependencies) => {
  return async (textDocument: TextDocument): Promise<readonly GutterDecoration[]> => {
    if ((await dependencies.getGutterDecorationsEnabled()) !== true) {
      return []
    }
    const workspaceFolder = await dependencies.getWorkspaceFolder()
    if (!workspaceFolder) {
      return []
    }
    const relativePath = getRelativePath(workspaceFolder, textDocument.uri)
    if (!relativePath) {
      return []
    }
    try {
      const { exitCode, stdout } = await dependencies.execute('git', ['show', `HEAD:./${relativePath}`], {
        cwd: workspaceFolder,
        reject: false,
      })
      let oldText = stdout
      if (exitCode !== 0) {
        const repositoryResult = await dependencies.execute('git', ['rev-parse', '--is-inside-work-tree'], {
          cwd: workspaceFolder,
          reject: false,
        })
        if (repositoryResult.exitCode !== 0 || repositoryResult.stdout.trim() !== 'true') {
          return []
        }
        oldText = ''
      }
      return getGutterDecorations(oldText, textDocument.text)
    } catch {
      return []
    }
  }
}
