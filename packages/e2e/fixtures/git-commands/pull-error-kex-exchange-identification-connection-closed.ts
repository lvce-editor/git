// Git command fixtures for "pull error kex exchange identification connection closed" test
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0
  },
  'pull': {
    stdout: '',
    stderr: `kex_exchange_identification: Connection closed by remote host
Connection closed by 0000:0000:0000::0000:0000 port 22
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
`,
    exitCode: 128
  }
}
