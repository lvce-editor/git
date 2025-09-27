import * as Exec from '../Exec/Exec.ts'
import { ExecError } from '../ExecError/ExecError.ts'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as GetGitEnv from '../GetGitEnv/GetGitEnv.ts'
import * as SchemeDetector from '../SchemeDetector/SchemeDetector.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const exec = async ({ gitPath, cwd, name, args }) => {
  if (typeof gitPath !== 'string') {
    throw new Error(`gitPath must be of type string, was ${gitPath}`)
  }
  if (typeof cwd !== 'string') {
    throw new Error(`cwd must be of type string, was ${cwd}`)
  }

  // Detect the scheme of the current working directory
  const scheme = SchemeDetector.detectScheme(cwd)

  // Route to appropriate implementation based on scheme
  if (scheme === 'file' && SchemeDetector.supportsNativeGit()) {
    // Use native git for file:// schemes
    return execNativeGit({ gitPath, cwd, name, args })
  } else {
    // Use git-web for web schemes or when native git is not available
    return execGitWeb({ gitPath, cwd, name, args })
  }
}

/**
 * Execute git using native git binary
 */
const execNativeGit = async ({ gitPath, cwd, name, args }) => {
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

/**
 * Execute git using git-web emulation
 */
const execGitWeb = async ({ gitPath, cwd, name, args }) => {
  try {
    const result = await Rpc.invoke('GitWeb.exec', gitPath, args, {
      cwd,
      reject: false
    })

    if (result.exitCode !== ExitCode.Success) {
      throw new ExecError(result.stdout, result.stderr, result.exitCode)
    }

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      name,
    }
  } catch (error) {
    if (error instanceof ExecError) {
      throw error
    }
    throw new ExecError('', error instanceof Error ? error.message : String(error), 1)
  }
}
