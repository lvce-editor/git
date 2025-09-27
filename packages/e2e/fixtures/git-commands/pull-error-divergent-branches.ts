// Git command fixtures for "pull error divergent branches" test
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0
  },
  'pull': {
    stdout: `> git pull --tags origin main
From https://github.com/user/repo
  * branch              main       -> FETCH_HEAD`,
    stderr: `hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.
`,
    exitCode: 128
  }
}
