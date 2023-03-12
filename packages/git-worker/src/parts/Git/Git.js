// import { inspect } from 'util'
import * as Exec from '../Exec/Exec.js'

// TODO don't like all this code here, the stateless function before was much nicer
export const exec = async ({ gitPath, cwd, name, args }) => {
  if (typeof gitPath !== 'string') {
    throw new Error(`gitPath must be of type string, was ${gitPath}`)
  }
  if (typeof cwd !== 'string') {
    throw new Error(`cwd must be of type string, was ${cwd}`)
  }
  const options = {
    env: {
      // ...vscode.env,
      GIT_OPTIONAL_LOCKS: '0',
      LC_ALL: 'en_US',
      LANG: 'en_US.UTF-8',
    },
    cwd: cwd,
  }
  const { stdout, stderr, exitCode } = await Exec.exec(gitPath, args, options)
  return {
    stdout,
    stderr,
    exitCode,
    name,
  }
}
