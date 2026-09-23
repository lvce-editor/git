import { expect, test } from '@jest/globals'
import type { GitExec } from '../src/parts/Types/Types.ts'
import * as GitRequestsGetDefaultCommitMessage from '../src/parts/GitRequestsGetDefaultCommitMessage/GitRequestsGetDefaultCommitMessage.ts'

const context = {
  cwd: '/test/workspace',
  gitPath: '/test/git',
}

test('getDefaultCommitMessage returns the first non-comment line from MERGE_MSG', async () => {
  const calls: unknown[] = []
  const results = [
    { exitCode: 0, stderr: '', stdout: 'abc123\n' },
    { exitCode: 0, stderr: '', stdout: '.git/worktrees/feature/MERGE_MSG\n' },
    {
      exitCode: 1,
      stderr: '',
      stdout:
        "diff --git a/.git/worktrees/feature/MERGE_MSG b/.git/worktrees/feature/MERGE_MSG\n+++ b/.git/worktrees/feature/MERGE_MSG\n@@ -0,0 +1,4 @@\n+Merge remote-tracking branch 'origin/main' into feature\n+\n+# Conflicts:\n+#\tfile.txt\n",
    },
  ]
  const exec: GitExec = async (options) => {
    calls.push(options)
    return results.shift()!
  }

  await expect(GitRequestsGetDefaultCommitMessage.getDefaultCommitMessage({ ...context, exec })).resolves.toBe(
    "Merge remote-tracking branch 'origin/main' into feature",
  )
  expect(calls[2]).toEqual({
    args: ['diff', '--no-index', '--no-ext-diff', '--no-color', '--unified=0', '--', '/dev/null', '.git/worktrees/feature/MERGE_MSG'],
    ...context,
    name: 'getDefaultCommitMessage',
    throwError: false,
  })
})

test('getDefaultCommitMessage returns empty when no merge is active', async () => {
  const exec: GitExec = async () => ({ exitCode: 128, stderr: 'fatal: Needed a single revision', stdout: '' })

  await expect(GitRequestsGetDefaultCommitMessage.getDefaultCommitMessage({ ...context, exec })).resolves.toBe('')
})

test('getDefaultCommitMessage returns empty when MERGE_MSG is unavailable', async () => {
  const results = [
    { exitCode: 0, stderr: '', stdout: 'abc123\n' },
    { exitCode: 0, stderr: '', stdout: '.git/MERGE_MSG\n' },
    { exitCode: 128, stderr: 'fatal: not found', stdout: '' },
  ]
  const exec: GitExec = async () => results.shift()!

  await expect(GitRequestsGetDefaultCommitMessage.getDefaultCommitMessage({ ...context, exec })).resolves.toBe('')
})
