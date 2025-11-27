import { GitError } from '../GitError/GitError.js'

/**
 *
 * @param {{cwd:string, message:string, gitPath:string, exec:any  }} options
 */
export const addAllAndCommit = async ({ cwd, gitPath, message, exec }) => {
  try {
    await exec({
      args: ['add', '.'],
      cwd,
      gitPath,
      name: 'addAllAndCommit/add',
    })
    await exec({
      args: ['commit', '-m', message],
      cwd,
      gitPath,
      name: 'addAllAndCommit/commit',
    })
    const { stdout: remoteUrl } = await exec({
      args: ['config', '--get', 'remote.origin.url'],
      cwd,
      gitPath,
      name: 'addAllAndCommit/getRemoteUrl',
      throwError: false,
    })
    if (!remoteUrl) {
      return
    }

    try {
      await exec({
        args: ['push'],
        cwd,
        gitPath,
        name: 'addAllAndCommit/push',
      })
    } catch (error) {
      if (error && error instanceof Error && error.message.includes('No configured push destination')) {
        // ignore
      } else {
        throw error
      }
    }
  } catch (error) {
    throw new GitError(error, 'addAllAndCommit')
  }
}
