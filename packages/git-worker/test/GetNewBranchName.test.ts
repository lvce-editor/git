/* eslint-disable jest/no-restricted-jest-methods */
import { beforeEach, expect, jest, test } from '@jest/globals'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const mockInvoke = jest.fn<typeof Rpc.invoke>()
const mockGetRefs = jest.fn<() => Promise<readonly { readonly name: string; readonly type: number }[]>>()

jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({ invoke: mockInvoke }))
jest.unstable_mockModule('../src/parts/WrappedGitRequests/WrappedGitRequests.ts', () => ({
  wrappedGitRequests: { getRefs: mockGetRefs },
}))

const { getNewBranchName } = await import('../src/parts/GetNewBranchName/GetNewBranchName.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test.each([undefined, ''])('cancels without reading refs for %s', async (input) => {
  mockInvoke.mockResolvedValueOnce(input)
  await expect(getNewBranchName()).resolves.toBeUndefined()
  expect(mockGetRefs).not.toHaveBeenCalled()
})

test('allows a name matching a tag or remote branch', async () => {
  mockInvoke.mockResolvedValueOnce('feature')
  mockGetRefs.mockResolvedValue([
    { name: 'feature', type: 2 },
    { name: 'feature', type: 3 },
  ])
  await expect(getNewBranchName()).resolves.toBe('feature')
  expect(mockInvoke).toHaveBeenCalledTimes(1)
})

test('shows a clear error and accepts a corrected name', async () => {
  mockInvoke.mockResolvedValueOnce('main').mockResolvedValueOnce(true).mockResolvedValueOnce('feature/new')
  mockGetRefs.mockResolvedValue([{ name: 'main', type: 1 }])
  await expect(getNewBranchName()).resolves.toBe('feature/new')
  expect(mockInvoke).toHaveBeenNthCalledWith(2, 'Confirm.prompt', "A branch named 'main' already exists. Please choose a different name.")
  expect(mockGetRefs).toHaveBeenCalledTimes(2)
})

test('allows canceling after the duplicate-name error', async () => {
  mockInvoke.mockResolvedValueOnce('feature/existing').mockResolvedValueOnce(false)
  mockGetRefs.mockResolvedValue([{ name: 'feature/existing', type: 1 }])
  await expect(getNewBranchName()).resolves.toBeUndefined()
  expect(mockInvoke).toHaveBeenCalledTimes(2)
})

test('refreshes refs before accepting each submitted name', async () => {
  mockInvoke.mockResolvedValueOnce('main').mockResolvedValueOnce(true).mockResolvedValueOnce('new').mockResolvedValueOnce(false)
  mockGetRefs.mockResolvedValueOnce([{ name: 'main', type: 1 }]).mockResolvedValueOnce([{ name: 'new', type: 1 }])
  await expect(getNewBranchName()).resolves.toBeUndefined()
  expect(mockInvoke).toHaveBeenNthCalledWith(4, 'Confirm.prompt', "A branch named 'new' already exists. Please choose a different name.")
})
