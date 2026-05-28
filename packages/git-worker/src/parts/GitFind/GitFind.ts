import * as EmptyGit from '../EmptyGit/EmptyGit.ts'
import * as Exec from '../Exec/Exec.ts'
import * as ParseGitVersion from '../ParseGitVersion/ParseGitVersion.ts'
import * as Rpc from '../Rpc/Rpc.ts'

type GitInfo = {
  path: string
  version: string
}

const findGitAtPath = async (path: string, cwd: string): Promise<GitInfo | undefined> => {
  let result: { stdout: string }
  try {
    result = await Exec.exec('git', ['--version'], {
      cwd,
    })
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

const getGitPaths = (): Promise<readonly string[]> => {
  return Rpc.invoke('Config.getGitPaths')
}

export const findGit = async (cwd: string): Promise<GitInfo> => {
  const paths = await getGitPaths()
  for (const path of paths) {
    const git = await findGitAtPath(path, cwd)
    if (git) {
      return git
    }
  }
  return EmptyGit.emptyGit
}
