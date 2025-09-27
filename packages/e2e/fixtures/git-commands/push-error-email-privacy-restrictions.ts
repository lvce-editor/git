// Git command fixtures for "push error email privacy restrictions" test
import type { GitFixtures } from '../../src/test-helpers/gitMockHelper.js'

export const gitFixtures: GitFixtures = {
  '--version': {
    stdout: 'git version 2.34.1',
    stderr: '',
    exitCode: 0
  },
  'push': {
    stdout: `Enumerating objects: 23, done.
Counting objects: 100% (23/23), done.
Delta compression using up to 8 threads
Compressing objects: 100% (13/13), done.
Writing objects: 100% (13/13), 5.33 KiB | 780.00 KiB/s, done.
Total 13 (delta 8), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (8/8), completed with 8 local objects.`,
    stderr: `remote: error: GH007: Your push would publish a private email address.
To github.com:user/repo.git
  ! [remote rejected] master -> master (push declined due to email privacy restrictions)
error: failed to push some refs to 'github.com:user/repo.git`,
    exitCode: 128
  }
}
