import * as Exec from '../Exec/Exec.ts'
import { ExecError } from '../ExecError/ExecError.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as GetGitEnv from '../GetGitEnv/GetGitEnv.ts'

export const exec = async ({ args, cwd, gitPath, input, name, throwError = true }) => {
  if (typeof gitPath !== 'string') {
    throw new TypeError(`gitPath must be of type string, was ${gitPath}`)
  }
  if (typeof cwd !== 'string') {
    throw new TypeError(`cwd must be of type string, was ${cwd}`)
  }
  const env = GetGitEnv.getGitEnv()
  const options = {
    cwd,
    env,
    input,
    reject: false,
  }
  const { exitCode, stderr, stdout } = await Exec.exec(gitPath, args, options)
  if (exitCode !== ExitCode.Success && throwError) {
    throw new ExecError(stdout, stderr, exitCode)
  }
  return {
    exitCode,
    name,
    stderr,
    stdout,
  }
}
