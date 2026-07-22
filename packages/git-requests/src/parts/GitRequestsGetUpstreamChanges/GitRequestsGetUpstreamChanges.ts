import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export interface GitUpstreamChanges {
  readonly incoming: number
  readonly outgoing: number
}

export const getUpstreamChanges = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<GitUpstreamChanges> => {
  try {
    const gitResult = await exec({
      args: ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}'],
      cwd,
      gitPath,
      name: 'getUpstreamChanges',
    })
    const [outgoing = 0, incoming = 0] = gitResult.stdout.trim().split(/\s+/).map(Number)
    return {
      incoming,
      outgoing,
    }
  } catch (error) {
    throw new GitError(error, 'getUpstreamChanges')
  }
}
