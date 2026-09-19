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

const CommandAddAll = await import('../src/parts/CommandAddAll/CommandAddAll.ts')
const Git = await import('../src/parts/Git/Git.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('commandAddAll refreshes the workspace after staging', async (): Promise<void> => {
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
    remoteWorkspaceUri: '/test/folder',
    workspaceUri: '/test/folder',
  })
  mockExecute.mockResolvedValue(undefined)
  mockInvoke.mockResolvedValue(undefined)

  await CommandAddAll.commandAddAll()

  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
    },
    fn: GitRequests.addAll,
    id: 'addAll',
  })
  expect(mockInvoke).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh')
})

test('commandAddAll does not refresh the workspace when staging fails', async (): Promise<void> => {
  const error = new Error('staging failed')
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
    remoteWorkspaceUri: '/test/folder',
    workspaceUri: '/test/folder',
  })
  mockExecute.mockRejectedValue(error)

  await expect(CommandAddAll.commandAddAll()).rejects.toBe(error)
  expect(mockInvoke).not.toHaveBeenCalled()
})
