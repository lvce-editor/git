import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

type PullOptions = GitRequestContext & {
  readonly from?: readonly string[]
}

export const pull = async ({ cwd, exec, gitPath, from = undefined }: PullOptions): Promise<void> => {
  const args: string[] = ['pull']
  try {
    await exec({
      args: from && from.length > 0 ? [...args, ...from] : args,
      cwd,
      gitPath,
      name: 'pull',
    })
  } catch (error) {
    throw new GitError(error, 'pull')
  }
}
