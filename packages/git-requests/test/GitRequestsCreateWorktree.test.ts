import { jest } from '@jest/globals'
import type { GitExec } from '../src/parts/Types/Types.ts'
import * as GitRequestsCreateWorktree from '../src/parts/GitRequestsCreateWorktree/GitRequestsCreateWorktree.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('createWorktree - passes worktree path argument', async () => {
  const exec: GitExec = jest.fn(async () => ({
    exitCode: 0,
    stderr: '',
    stdout: '',
  }))
  await GitRequestsCreateWorktree.createWorktree({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    worktreePath: '/test/feature-worktree',
  })
  expect(exec).toHaveBeenCalledTimes(1)
  expect(exec).toHaveBeenCalledWith({
    args: ['worktree', 'add', '/test/feature-worktree'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'createWorktree',
  })
})

test('createWorktree - passes optional ref argument', async () => {
  const exec: GitExec = jest.fn(async () => ({
    exitCode: 0,
    stderr: '',
    stdout: '',
  }))
  await GitRequestsCreateWorktree.createWorktree({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    ref: 'feature',
    worktreePath: '/test/feature-worktree',
  })
  expect(exec).toHaveBeenCalledWith({
    args: ['worktree', 'add', '/test/feature-worktree', 'feature'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'createWorktree',
  })
})

test('createWorktree - normalizes file uri path', async () => {
  const exec: GitExec = jest.fn(async () => ({
    exitCode: 0,
    stderr: '',
    stdout: '',
  }))
  await GitRequestsCreateWorktree.createWorktree({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    worktreePath: 'file:///test/feature-worktree',
  })
  expect(exec).toHaveBeenCalledWith({
    args: ['worktree', 'add', '/test/feature-worktree'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'createWorktree',
  })
})

test('createWorktree - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsCreateWorktree.createWorktree({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
      worktreePath: '/test/feature-worktree',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
