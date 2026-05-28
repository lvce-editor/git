import { GitError } from '../GitError/GitError.ts'
import type { GitExec, GitRequestContext } from '../Types/Types.ts'

type PushOptions = GitRequestContext & {
  readonly setUpstream?: readonly string[]
}

export const push = async ({ cwd, gitPath, exec, setUpstream = undefined }: PushOptions): Promise<void> => {
  const args: string[] = ['push', '--porcelain']
  try {
    if (setUpstream && setUpstream.length > 0) {
      args.push('--set-upstream', ...setUpstream)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'push',
    })
    console.log('finished')
  } catch (error) {
    throw new GitError(error, 'push')
  }
}
