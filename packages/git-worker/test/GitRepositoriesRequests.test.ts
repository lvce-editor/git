/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as RefreshAfterGitCommand from '../src/parts/RefreshAfterGitCommand/RefreshAfterGitCommand.ts'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const mockRefreshAfterGitCommand = jest.fn<typeof RefreshAfterGitCommand.refreshAfterGitCommand>()
const mockInvoke = jest.fn<typeof Rpc.invoke>()

jest.unstable_mockModule('../src/parts/RefreshAfterGitCommand/RefreshAfterGitCommand.ts', () => ({
  refreshAfterGitCommand: mockRefreshAfterGitCommand,
}))

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({
  invoke: mockInvoke,
}))

const GitRepositoriesRequests = await import('../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.ts')

type TestArgs = Readonly<{ value: number }>
type TestRequest = (args: TestArgs) => Promise<unknown>

beforeEach(() => {
  jest.resetAllMocks()
  mockInvoke.mockResolvedValue(false)
  mockRefreshAfterGitCommand.mockResolvedValue(undefined)
})

test('execute refreshes after a successful pull', async (): Promise<void> => {
  const fn = jest.fn<TestRequest>().mockResolvedValue('result')

  await expect(
    GitRepositoriesRequests.execute({
      args: { value: 1 },
      fn,
      id: 'pull',
    }),
  ).resolves.toBe('result')

  expect(mockRefreshAfterGitCommand).toHaveBeenCalledWith('pull')
})

test('execute refreshes after sync reports an error', async (): Promise<void> => {
  const error = new Error('push failed')
  const fn = jest.fn<TestRequest>().mockRejectedValue(error)

  await expect(
    GitRepositoriesRequests.execute({
      args: { value: 1 },
      fn,
      id: 'sync',
    }),
  ).rejects.toBe(error)

  expect(mockRefreshAfterGitCommand).toHaveBeenCalledWith('sync')
})

test('execute does not refresh after a failed pull', async (): Promise<void> => {
  const error = new Error('pull failed')
  const fn = jest.fn<TestRequest>().mockRejectedValue(error)

  await expect(
    GitRepositoriesRequests.execute({
      args: { value: 1 },
      fn,
      id: 'pull',
    }),
  ).rejects.toBe(error)

  expect(mockRefreshAfterGitCommand).not.toHaveBeenCalled()
})

test('execute shows requested Git errors when the preference is disabled', async (): Promise<void> => {
  const error = new Error('branch is already checked out in another worktree')
  const fn = jest.fn<TestRequest>().mockRejectedValue(error)

  await expect(
    GitRepositoriesRequests.execute({
      args: { value: 1 },
      fn,
      id: 'checkout',
      showError: true,
    }),
  ).rejects.toBe(error)

  expect(mockInvoke).toHaveBeenCalledTimes(1)
  expect(mockInvoke).toHaveBeenCalledWith('Confirm.prompt', String(error))
})

test('execute does not show requested Git errors twice when the preference is enabled', async (): Promise<void> => {
  const error = new Error('checkout failed')
  const fn = jest.fn<TestRequest>().mockRejectedValue(error)
  mockInvoke.mockResolvedValue(true)

  await expect(
    GitRepositoriesRequests.execute({
      args: { value: 1 },
      fn,
      id: 'checkout',
      showError: true,
    }),
  ).rejects.toBe(error)

  expect(mockInvoke).toHaveBeenCalledTimes(1)
  expect(mockInvoke).toHaveBeenCalledWith('Confirm.prompt', String(error))
})
