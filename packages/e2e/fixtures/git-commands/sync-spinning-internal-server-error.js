// Git command fixtures for "sync spinning internal server error" test
<<<<<<< HEAD
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0
  },
  'pull': {
=======

export const gitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0,
  },
  pull: {
>>>>>>> origin/main
    stdout: `Enumerating objects: 23, done.
Counting objects: 100% (23/23), done.
Delta compression using up to 8 threads
Compressing objects: 100% (13/13), done.
Writing objects: 100% (13/13), 5.33 KiB | 780.00 KiB/s, done.
Total 13 (delta 8), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (8/8), completed with 8 local objects.`,
    stderr: `remote: Internal Server Error
To github.com:user/repo.git
 ! [remote rejected]           main -> main (Internal Server Error)
error: failed to push some refs to 'github.com:user/repo.git`,
<<<<<<< HEAD
    exitCode: 128
  }
=======
    exitCode: 128,
  },
>>>>>>> origin/main
}
