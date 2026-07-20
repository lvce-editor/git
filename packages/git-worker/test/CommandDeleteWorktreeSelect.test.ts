/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as GitRepositories from '../src/parts/GitRepositories/GitRepositories.ts'
import type * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const mockGetCurrent = jest.fn<typeof GitRepositories.getCurrent>()
const mockExecute = jest.fn<typeof GitRepositoriesRequests.execute>()
const mockInvoke = jest.fn<typeof Rpc.invoke>()

jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => ({
  getCurrent: mockGetCurrent,
}))

jest.unstable_mockModule('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts', () => ({
  execute: mockExecute,
}))

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({
  invoke: mockInvoke,
}))

const CommandDeleteWorktreeSelect = await import('../src/parts/CommandDeleteWorktreeSelect/CommandDeleteWorktreeSelect.ts')
const Git = await import('../src/parts/Git/Git.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')

beforeEach(() => {
  jest.resetAllMocks()
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/workspace',
  })
})

test('deletes selected worktree', async (): Promise<void> => {
  const worktrees = ['/test/workspace', '/test/feature worktree']
  const pick = {
    description: '/test/feature worktree',
    label: 'feature worktree',
    worktreePath: '/test/feature worktree',
  }
  mockExecute.mockResolvedValueOnce(worktrees).mockResolvedValueOnce(undefined)
  mockInvoke.mockResolvedValue(pick)

  await expect(CommandDeleteWorktreeSelect.commandDeleteWorktreeSelect()).resolves.toBe('/test/feature worktree')
  expect(mockInvoke).toHaveBeenCalledWith('QuickPick.show', [pick])
  expect(mockExecute).toHaveBeenNthCalledWith(1, {
    args: {
      cwd: '/test/workspace',
      exec: Git.exec,
      gitPath: '/test/git',
    },
    fn: GitRequests.getWorktrees,
    id: 'getWorktrees',
  })
  expect(mockExecute).toHaveBeenNthCalledWith(2, {
    args: {
      cwd: '/test/workspace',
      exec: Git.exec,
      gitPath: '/test/git',
      worktreePath: '/test/feature worktree',
    },
    fn: GitRequests.deleteWorktree,
    id: 'deleteWorktree',
  })
})

test('does not delete the current worktree', async (): Promise<void> => {
  mockExecute.mockResolvedValue(['/test/workspace'])
  mockInvoke.mockResolvedValue(undefined)

  await expect(CommandDeleteWorktreeSelect.commandDeleteWorktreeSelect()).resolves.toBeUndefined()
  expect(mockInvoke).toHaveBeenCalledWith('QuickPick.show', [])
  expect(mockExecute).toHaveBeenCalledTimes(1)
})

test('does not delete when quick pick is canceled', async (): Promise<void> => {
  mockExecute.mockResolvedValue(['/test/workspace', '/test/feature'])
  mockInvoke.mockResolvedValue(undefined)

  await expect(CommandDeleteWorktreeSelect.commandDeleteWorktreeSelect()).resolves.toBeUndefined()
  expect(mockExecute).toHaveBeenCalledTimes(1)
})
