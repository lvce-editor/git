import { GitError } from '../GitError/GitError.ts'
import type { GitExec, GitExecResult } from '../Types/Types.ts'

const joinByNull = (strings: readonly string[]): string => {
  return strings.join('\0')
}

export const getDecorations = async ({
  cwd,
  gitPath,
  uris,
  exec,
}: {
  readonly cwd: string
  readonly gitPath: string
  readonly uris: readonly string[]
  readonly exec: GitExec
}): Promise<GitExecResult> => {
  try {
    const paths = uris.map((uri) => uri.slice('file://'.length))
    const input = joinByNull(paths)
    const gitResult = await exec({
      args: ['check-ignore', '-v', '-z', '--stdin'],
      name: 'decorations',
      cwd,
      gitPath,
      input,
      throwError: false,
    })
    return gitResult
  } catch (error) {
    throw new GitError(error, 'decorations')
  }
}
