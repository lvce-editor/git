// Git command fixtures for "pull error not possible fast forward aborting" test

export const gitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0,
  },
  pull: {
    stdout: `From github.com:user/repo
* branch                      main       -> FETCH_HEAD`,
    stderr: `fatal: Not possible to fast-forward, aborting.
`,
    exitCode: 128,
  },
}
