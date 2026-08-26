import { beforeEach, expect, jest, test } from '@jest/globals'
import { runFetchOnWorkspaceOpen, type RunFetchOnWorkspaceOpenDependencies } from '../src/parts/RunFetchOnWorkspaceOpen/RunFetchOnWorkspaceOpen.ts'

const fetch = jest.fn<RunFetchOnWorkspaceOpenDependencies['fetch']>()
const getRunFetchOnWorkspaceOpen = jest.fn<RunFetchOnWorkspaceOpenDependencies['getRunFetchOnWorkspaceOpen']>()

beforeEach(() => {
  jest.clearAllMocks()
})

test('fetches when fetch on workspace open is enabled', async () => {
  getRunFetchOnWorkspaceOpen.mockResolvedValue(true)

  await runFetchOnWorkspaceOpen({ fetch, getRunFetchOnWorkspaceOpen })

  expect(fetch).toHaveBeenCalledTimes(1)
})

test('does not fetch when fetch on workspace open is disabled', async () => {
  getRunFetchOnWorkspaceOpen.mockResolvedValue(false)

  await runFetchOnWorkspaceOpen({ fetch, getRunFetchOnWorkspaceOpen })

  expect(fetch).not.toHaveBeenCalled()
})

test('does not fail activation when fetching fails', async () => {
  getRunFetchOnWorkspaceOpen.mockResolvedValue(true)
  fetch.mockRejectedValue(new Error('not a Git repository'))

  await expect(runFetchOnWorkspaceOpen({ fetch, getRunFetchOnWorkspaceOpen })).resolves.toBeUndefined()
})
