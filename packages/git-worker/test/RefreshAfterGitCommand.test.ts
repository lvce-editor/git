/* eslint-disable jest/no-restricted-jest-methods */
import { jest } from '@jest/globals'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const mockInvoke = jest.fn<typeof Rpc.invoke>()

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({
  invoke: mockInvoke,
}))

const RefreshAfterGitCommand = await import('../src/parts/RefreshAfterGitCommand/RefreshAfterGitCommand.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('refreshAfterGitCommand refreshes after a successful mutation', async (): Promise<void> => {
  mockInvoke.mockResolvedValue(undefined)

  await RefreshAfterGitCommand.refreshAfterGitCommand('commit')

  expect(mockInvoke).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh')
})

test('refreshAfterGitCommand does not refresh after a read request', async (): Promise<void> => {
  await RefreshAfterGitCommand.refreshAfterGitCommand('getGroups')

  expect(mockInvoke).not.toHaveBeenCalled()
})

test('refreshAfterGitCommand ignores refresh failures', async (): Promise<void> => {
  mockInvoke.mockRejectedValue(new Error('layout unavailable'))

  await expect(RefreshAfterGitCommand.refreshAfterGitCommand('stageAll')).resolves.toBeUndefined()
})
