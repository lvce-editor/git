// Git command fixtures for "pull error repository not found" test

export const gitFixtures = {
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
