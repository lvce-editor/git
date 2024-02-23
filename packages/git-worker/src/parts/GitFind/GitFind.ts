import * as Exec from '../Exec/Exec.js'
import * as ParseGitVersion from '../ParseGitVersion/ParseGitVersion.js'
import * as Rpc from '../Rpc/Rpc.js'

const findGitAtPath = async (path) => {
  let result
  try {
    result = await Exec.exec('git', ['--version'], {})
  } catch (error) {
    if (!Exec.isExecError(error)) {
      throw error
    }
    return undefined
  }
  return {
    path,
    version: ParseGitVersion.parseGitVersion(result.stdout),
  }
}

const getGitPaths = () => {
  return Rpc.invoke('Config.getGitPaths')
}

export const findGit = async () => {
  const paths = await getGitPaths()
  for (const path of paths) {
    const git = await findGitAtPath(path)
    if (git) {
      return git
    }
  }
  return undefined
}
