// Git command fixtures for "push error no configured push destination" test
<<<<<<< HEAD
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
=======

export const gitFixtures = {
>>>>>>> origin/main
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0,
  },
  push: {
    stdout: '',
    stderr: `fatal: No configured push destination.
Either specify the URL from the command-line or configure a remote repository using

    git remote add <name> <url>

and then push using the remote name

    git push <name>

`,
    exitCode: 128,
  },
}
