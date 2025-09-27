// Git command fixtures for "pull error cannot fast forward multiple branches" test
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0,
  },
  pull: {
    stdout: '',
    stderr: 'fatal: Cannot fast-forward to multiple branches.',
    exitCode: 128,
  },
}
