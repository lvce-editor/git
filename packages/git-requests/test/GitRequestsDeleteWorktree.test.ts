import { jest } from '@jest/globals'
import type { GitExec } from '../src/parts/Types/Types.ts'
import * as GitRequestsDeleteWorktree from '../src/parts/GitRequestsDeleteWorktree/GitRequestsDeleteWorktree.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('deleteWorktree - passes worktree path argument', async () => {
  const exec: GitExec = jest.fn(async () => ({
    exitCode: 0,
    stderr: '',
    stdout: '',
  }))
  await GitRequestsDeleteWorktree.deleteWorktree({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    worktreePath: '/test/feature-worktree',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['worktree', 'remove', '/test/feature-worktree'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'deleteWorktree',
  })
})

test('deleteWorktree - normalizes file uri path', async () => {
  const exec: GitExec = jest.fn(async () => ({
    exitCode: 0,
    stderr: '',
    stdout: '',
  }))
  await GitRequestsDeleteWorktree.deleteWorktree({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    worktreePath: 'file:///test/feature-worktree',
  })
  expect(exec).toHaveBeenCalledWith({
    args: ['worktree', 'remove', '/test/feature-worktree'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'deleteWorktree',
  })
})

test('deleteWorktree - normalizes windows file uri path', async () => {
  const exec: GitExec = jest.fn(async () => ({
    exitCode: 0,
    stderr: '',
    stdout: '',
  }))
  await GitRequestsDeleteWorktree.deleteWorktree({
    cwd: 'C:/test/test-folder',
    exec,
    gitPath: 'git',
    worktreePath: 'file:///C:/test/feature-worktree',
  })
  expect(exec).toHaveBeenCalledWith({
    args: ['worktree', 'remove', 'C:/test/feature-worktree'],
    cwd: 'C:/test/test-folder',
    gitPath: 'git',
    name: 'deleteWorktree',
  })
})

test('deleteWorktree - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsDeleteWorktree.deleteWorktree({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
      worktreePath: '/test/feature-worktree',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
