import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'

export interface GitUpstreamChanges {
  readonly incoming: number
  readonly outgoing: number
  readonly upstream: string
}

export const getUpstreamChanges = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<GitUpstreamChanges> => {
  try {
    const changesResult = await exec({
      args: ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}'],
      cwd,
      gitPath,
      name: 'getUpstreamChanges',
    })
    const upstreamResult = await exec({
      args: ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'],
      cwd,
      gitPath,
      name: 'getUpstreamChanges',
    })
    const [outgoing = 0, incoming = 0] = changesResult.stdout.trim().split(/\s+/).map(Number)
    return {
      incoming,
      outgoing,
      upstream: upstreamResult.stdout.trim(),
    }
  } catch (error) {
    throw new GitError(error, 'getUpstreamChanges')
  }
}
