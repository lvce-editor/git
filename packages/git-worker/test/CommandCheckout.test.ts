/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as GetCheckoutPicks from '../src/parts/GetCheckoutPicks/GetCheckoutPicks.ts'
import type * as GitRepositories from '../src/parts/GitRepositories/GitRepositories.ts'
import type * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const mockGetCheckoutPicks = jest.fn<typeof GetCheckoutPicks.getCheckoutPicks>()
const mockGetCurrent = jest.fn<typeof GitRepositories.getCurrent>()
const mockExecute = jest.fn<typeof GitRepositoriesRequests.execute>()
const mockInvoke = jest.fn<typeof Rpc.invoke>()

jest.unstable_mockModule('../src/parts/GetCheckoutPicks/GetCheckoutPicks.ts', () => ({
  getCheckoutPicks: mockGetCheckoutPicks,
}))

jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => ({
  getCurrent: mockGetCurrent,
}))

jest.unstable_mockModule('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts', () => ({
  execute: mockExecute,
}))

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({
  invoke: mockInvoke,
}))

const CommandCheckout = await import('../src/parts/CommandCheckout/CommandCheckout.ts')
const Git = await import('../src/parts/Git/Git.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('checks out selected branch', async (): Promise<void> => {
  const picks = [
    {
      description: '1234567',
      icon: 1,
      label: 'feature',
    },
  ]
  mockGetCheckoutPicks.mockResolvedValue(picks)
  mockInvoke.mockResolvedValue(picks[0])
  mockGetCurrent.mockResolvedValue({
    gitPath: '/test/git',
    gitVersion: '2.39.2',
    path: '/test/folder',
  })
  mockExecute.mockResolvedValue(undefined)

  await expect(CommandCheckout.commandCheckout()).resolves.toBe('feature')
  expect(mockInvoke).toHaveBeenCalledWith('QuickPick.show', picks)
  expect(mockExecute).toHaveBeenCalledWith({
    args: {
      cwd: '/test/folder',
      exec: Git.exec,
      gitPath: '/test/git',
      ref: 'feature',
    },
    fn: GitRequests.checkout,
    id: 'checkout',
  })
})

test('does not checkout when quick pick is canceled', async (): Promise<void> => {
  mockGetCheckoutPicks.mockResolvedValue([])
  mockInvoke.mockResolvedValue(undefined)

  await expect(CommandCheckout.commandCheckout()).resolves.toBeUndefined()
  expect(mockExecute).not.toHaveBeenCalled()
})
