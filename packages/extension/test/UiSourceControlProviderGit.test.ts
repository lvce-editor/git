import { beforeEach, expect, jest, test } from '@jest/globals'
import { createIsActive, type IsActiveDependencies } from '../src/parts/IsActive/IsActive.ts'

const execute = jest.fn<IsActiveDependencies['execute']>()
const clearCheckout = jest.fn<IsActiveDependencies['clearCheckout']>()
const refreshCheckout = jest.fn<IsActiveDependencies['refreshCheckout']>()
const clearSync = jest.fn<IsActiveDependencies['clearSync']>()
const refreshSync = jest.fn<IsActiveDependencies['refreshSync']>()

beforeEach(() => {
  jest.clearAllMocks()
})

test('a stale repository check does not clear the current repository status items', async () => {
  const { promise: staleResult, resolve: resolveStaleResult } = Promise.withResolvers<{ exitCode: number }>()
  const { promise: currentResult, resolve: resolveCurrentResult } = Promise.withResolvers<{ exitCode: number }>()
  execute.mockReturnValueOnce(staleResult).mockReturnValueOnce(currentResult)
  const isActive = createIsActive({
    clearCheckout,
    clearSync,
    execute,
    refreshCheckout,
    refreshSync,
  })

  const staleCheck = isActive('file', '/tmp')
  const currentCheck = isActive('file', '/tmp/workspace')

  resolveCurrentResult({ exitCode: 0 })
  await currentCheck
  resolveStaleResult({ exitCode: 128 })
  await staleCheck

  expect(refreshCheckout).toHaveBeenCalledWith('/tmp/workspace')
  expect(refreshSync).toHaveBeenCalledWith('/tmp/workspace')
  expect(clearCheckout).not.toHaveBeenCalled()
  expect(clearSync).not.toHaveBeenCalled()
})

test('a current status bar refresh finishes after an older refresh', async () => {
  const calls: string[] = []
  const { promise: staleRefresh, resolve: resolveStaleRefresh } = Promise.withResolvers<void>()
  const { promise: staleRefreshStarted, resolve: resolveStaleRefreshStarted } = Promise.withResolvers<void>()
  execute.mockResolvedValue({ exitCode: 0 })
  refreshCheckout.mockImplementation(async (root) => {
    calls.push(`checkout:${root}`)
    if (root === '/tmp/old') {
      resolveStaleRefreshStarted()
      await staleRefresh
    }
  })
  refreshSync.mockImplementation(async (root) => {
    calls.push(`sync:${root}`)
  })
  const isActive = createIsActive({
    clearCheckout,
    clearSync,
    execute,
    refreshCheckout,
    refreshSync,
  })

  const staleCheck = isActive('file', '/tmp/old')
  await staleRefreshStarted
  const currentCheck = isActive('file', '/tmp/current')
  resolveStaleRefresh()
  await Promise.all([staleCheck, currentCheck])

  expect(calls).toEqual(['checkout:/tmp/old', 'checkout:/tmp/current', 'sync:/tmp/current'])
})
