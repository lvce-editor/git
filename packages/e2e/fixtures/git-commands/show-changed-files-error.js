// Git command fixtures for "show changed files in sidebar error" test
export const gitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0
  },
  'rev-parse': {
    stdout: '',
    stderr: '',
    exitCode: 0
  },
  'status': {
    error: 'oops'
  }
}
