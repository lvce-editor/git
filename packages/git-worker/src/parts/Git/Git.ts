import * as Exec from '../Exec/Exec.ts'
import { ExecError } from '../ExecError/ExecError.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as GetGitEnv from '../GetGitEnv/GetGitEnv.ts'

export const exec = async ({ gitPath, cwd, name, args, input }) => {
  if (typeof gitPath !== 'string') {
    throw new TypeError(`gitPath must be of type string, was ${gitPath}`)
  }
  if (typeof cwd !== 'string') {
    throw new TypeError(`cwd must be of type string, was ${cwd}`)
  }
  const env = GetGitEnv.getGitEnv()
  const options = {
    env,
    cwd,
    reject: false,
    input,
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
