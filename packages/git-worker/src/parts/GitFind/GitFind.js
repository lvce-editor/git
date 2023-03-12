import * as Exec from '../Exec/Exec.js'
import * as Trace from '../Trace/Trace.js'

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
  // TODO don't couple vscode api with business logic too much
  // const configuredGitPath = vscode.getConfiguration('git.path')
  // if (configuredGitPath) {
  //   return [configuredGitPath]
  // }
  const paths = ['git']
  // if (vscode.env.GIT_PATH) {
  //   paths.unshift(vscode.env.GIT_PATH)
  // }
  return paths
}

export const findGit = async () => {
  const paths = getGitPaths()
  for (const path of paths) {
    const git = await findGitAtPath(path)
    if (git) {
      return git
    }
  }
  Trace.trace('git binary not found')
  return undefined
}
