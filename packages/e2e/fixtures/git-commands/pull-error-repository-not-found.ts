// Git command fixtures for "pull error repository not found" test
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
  pull: {
    stdout: '',
    stderr: `Repository not found.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.`,
    exitCode: 128,
  },
}
