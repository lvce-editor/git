/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as GitRepositories from '../src/parts/GitRepositories/GitRepositories.ts'
import type * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts'

const mockGetCurrent = jest.fn<typeof GitRepositories.getCurrent>()
const mockExecute = jest.fn<typeof GitRepositoriesRequests.execute>()

jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => ({
  getCurrent: mockGetCurrent,
}))

jest.unstable_mockModule('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts', () => ({
  execute: mockExecute,
}))

const CommandPull = await import('../src/parts/CommandPull/CommandPull.ts')
const CommandPullRebase = await import('../src/parts/CommandPullRebase/CommandPullRebase.ts')
const CommandSync = await import('../src/parts/CommandSync/CommandSync.ts')
const Git = await import('../src/parts/Git/Git.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')

beforeEach(() => {
  jest.resetAllMocks()
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
    remoteWorkspaceUri: '/test/folder',
    workspaceUri: '/test/folder',
  })
  mockExecute.mockResolvedValue(undefined)
})

test('commandPull executes the pull request', async (): Promise<void> => {
  await CommandPull.commandPull()

  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      from: undefined,
      gitPath: '/test/git',
    },
    fn: GitRequests.pull,
    id: 'pull',
  })
})

test('commandPullRebase executes the pull and rebase request', async (): Promise<void> => {
  await CommandPullRebase.commandPullRebase()

  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
    },
    fn: GitRequests.pullAndRebase,
    id: 'pullAndRebase',
  })
})

test('commandSync executes the sync request', async (): Promise<void> => {
  await CommandSync.commandSync()

  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
    },
    fn: GitRequests.sync,
    id: 'sync',
  })
})
