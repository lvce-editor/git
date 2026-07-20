import { expect, jest, test } from '@jest/globals'
import type { GitExec } from '../src/parts/Types/Types.ts'
import * as GitRequestsGetWorktrees from '../src/parts/GitRequestsGetWorktrees/GitRequestsGetWorktrees.ts'

test('getWorktrees - returns worktree paths', async (): Promise<void> => {
  const exec = jest.fn<GitExec>(async () => ({
    stderr: '',
    stdout: 'worktree /test/workspace\0HEAD 123\0branch refs/heads/main\0\0worktree /test/feature worktree\0HEAD 456\0branch refs/heads/feature\0\0',
  }))

  await expect(
    GitRequestsGetWorktrees.getWorktrees({
      cwd: '/test/workspace',
      exec,
      gitPath: '/test/git',
    }),
  ).resolves.toEqual(['/test/workspace', '/test/feature worktree'])
  expect(exec).toHaveBeenCalledWith({
    args: ['worktree', 'list', '--porcelain', '-z'],
    cwd: '/test/workspace',
    gitPath: '/test/git',
    name: 'getWorktrees',
  })
})

test('getWorktrees - error - unknown git error', async (): Promise<void> => {
  const exec = jest.fn<GitExec>(async () => {
    throw new Error('Failed')
  })

  await expect(
    GitRequestsGetWorktrees.getWorktrees({
      cwd: '/test/workspace',
      exec,
      gitPath: '/test/git',
    }),
  ).rejects.toThrow('Failed')
})
