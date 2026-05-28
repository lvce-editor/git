/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as GitRepositories from '../src/parts/GitRepositories/GitRepositories.ts'
import type * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts'

const mockGetCurrent = jest.fn<typeof GitRepositories.getCurrent>()
const mockExecute = jest.fn<typeof GitRepositoriesRequests.execute>()

jest.unstable_mockModule('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts', () => ({
  execute: mockExecute,
}))

jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => ({
  getCurrent: mockGetCurrent,
}))

const CommandStash = await import('../src/parts/CommandStash/CommandStash.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')
const Git = await import('../src/parts/Git/Git.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('commandStash', async (): Promise<void> => {
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    path: '/test/folder',
  })
  mockExecute.mockResolvedValue(undefined)

  await CommandStash.commandStash()
  expect(mockExecute).toHaveBeenCalledTimes(1)
  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
    },
    fn: GitRequests.stash,
    id: 'stash',
  })
})
