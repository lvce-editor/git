import * as Exec from '../Exec/Exec.ts'
import { ExecError } from '../ExecError/ExecError.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as GetGitEnv from '../GetGitEnv/GetGitEnv.ts'

export const exec = async ({ gitPath, cwd, name, args }) => {
  if (typeof gitPath !== 'string') {
    throw new Error(`gitPath must be of type string, was ${gitPath}`)
  }
  if (typeof cwd !== 'string') {
    throw new Error(`cwd must be of type string, was ${cwd}`)
  }
  const env = GetGitEnv.getGitEnv()
  const options = {
    env,
    cwd: cwd,
    reject: false,
  }
  const { stdout, stderr, exitCode } = await Exec.exec(gitPath, args, options)
  if (exitCode !== ExitCode.Success) {
    throw new ExecError(stdout, stderr, exitCode)
  }
  return {
    stdout,
    stderr,
    exitCode,
    name,
  }
}
