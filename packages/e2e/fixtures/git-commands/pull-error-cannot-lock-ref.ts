// Git command fixtures for "pull error cannot lock ref" test
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0,
  },
  pull: {
    stdout: '',
    stderr: `error: cannot lock ref 'refs/remotes/origin/master': is at 2e4bfdb24fd137a1d2e87bd480f283cf7001f19a but expected 70ea06a46fd4b38bdba9ab1d64f3fee0f63806a5
! 70ea06a46f..2e4bfdb24f  master     -> origin/master  (unable to update local ref)`,
    exitCode: 128,
  },
}
