import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'

export const commandGetPullRequestDefaults = async (): Promise<{ baseBranch: string; headBranch: string; remoteUrl: string; title: string }> => {
  const repository = await Repositories.getCurrent()
  const run = async (args: readonly string[], required = true): Promise<string> => {
    const result = await Git.exec({ args, cwd: repository.path, gitPath: repository.gitPath, throwError: required })
    return result.exitCode === 0 ? result.stdout.trim() : ''
  }
  const headBranch = await run(['symbolic-ref', '--quiet', '--short', 'HEAD'], false)
  if (!headBranch) {
    throw new Error('Check out a branch before creating a pull request.')
  }
  const title = await run(['log', '-1', '--format=%s'])
  const configuredRemote = await run(['config', '--get', `branch.${headBranch}.remote`], false)
  const remote = configuredRemote && configuredRemote !== '.' ? configuredRemote : 'origin'
  const remoteUrl = await run(['remote', 'get-url', '--push', remote])
  const baseRef = await run(['symbolic-ref', '--quiet', '--short', `refs/remotes/${remote}/HEAD`], false)
  const baseBranch = baseRef.startsWith(`${remote}/`) ? baseRef.slice(remote.length + 1) : ''
  return { baseBranch, headBranch, remoteUrl, title }
}
