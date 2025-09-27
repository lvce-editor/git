// Git command fixtures for "sync spinning" test
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0
  },
  'pull': {
    stdout: '',
    stderr: '',
    exitCode: 0,
    delay: 500
  },
  'push': {
    stdout: '',
    stderr: '',
    exitCode: 0,
    delay: 500
  }
}
