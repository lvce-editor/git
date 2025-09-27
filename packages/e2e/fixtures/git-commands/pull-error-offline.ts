// Git command fixtures for "pull error offline" test
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0,
  },
  pull: {
    stdout: '',
    stderr: `ssh: Could not resolve hostname github.com: Temporary failure in name resolution
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
`,
    exitCode: 128,
  },
}
