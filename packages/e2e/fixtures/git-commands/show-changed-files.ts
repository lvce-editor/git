// Git command fixtures for "show changed files in sidebar" test
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
  'rev-parse': {
    stdout: '',
    stderr: '',
    exitCode: 0,
  },
  status: {
    stdout: ` M test/file-1.txt
 M test/file-2.txt
`,
    stderr: '',
    exitCode: 0,
  },
}
