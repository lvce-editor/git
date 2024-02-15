import * as Exec from '../Exec/Exec.js'
import * as Rpc from '../Rpc/Rpc.js'

const parseVersion = (raw) => {
  return raw.replace(/^git version /, '')
}

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
    version: parseVersion(result.stdout),
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
