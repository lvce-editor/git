import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

type PushOptions = GitRequestContext & {
  readonly followTags?: boolean
  readonly setUpstream?: readonly string[]
}

export const push = async ({ cwd, exec, followTags = false, gitPath, setUpstream = undefined }: PushOptions): Promise<void> => {
  const args: string[] = ['push', '--porcelain']
  try {
    if (followTags) {
      args.push('--follow-tags')
    }
    if (setUpstream && setUpstream.length > 0) {
      args.push('--set-upstream', ...setUpstream)
    }
    await exec({
      args,
      cwd,
      gitPath,
      name: 'push',
    })
  } catch (error) {
    throw new GitError(error, 'push')
  }
}
