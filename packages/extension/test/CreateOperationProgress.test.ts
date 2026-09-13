import { expect, jest, test } from '@jest/globals'
import { createOperationProgress } from '../src/parts/CreateOperationProgress/CreateOperationProgress.ts'

const deferred = (): PromiseWithResolvers<void> => Promise.withResolvers<void>()

test('notifies start and completion while exposing current progress', async () => {
  const states: boolean[] = []
  const progress = createOperationProgress(async () => {
    states.push(progress.getProgress())
  })
  const operation = deferred()
  const result = progress.run(() => operation.promise)
  await Promise.resolve()
  expect(progress.getProgress()).toBe(true)
  expect(states).toEqual([true])
  operation.resolve()
  await result
  await Promise.resolve()
  expect(progress.getProgress()).toBe(false)
  expect(states).toEqual([true, false])
})

test('overlapping operations stay busy until the last one completes', async () => {
  const notify = jest.fn(async () => {})
  const progress = createOperationProgress(notify)
  const first = deferred()
  const second = deferred()
  const firstResult = progress.run(() => first.promise)
  const secondResult = progress.run(() => second.promise)
  first.resolve()
  await firstResult
  expect(progress.getProgress()).toBe(true)
  expect(notify).toHaveBeenCalledTimes(1)
  second.resolve()
  await secondResult
  await Promise.resolve()
  expect(progress.getProgress()).toBe(false)
  expect(notify).toHaveBeenCalledTimes(2)
})

test('failure cleans up progress and preserves the operation error', async () => {
  const states: boolean[] = []
  const progress = createOperationProgress(async () => {
    states.push(progress.getProgress())
  })
  const error = new Error('push rejected')
  await expect(
    progress.run(async () => {
      throw error
    }),
  ).rejects.toBe(error)
  await Promise.resolve()
  expect(progress.getProgress()).toBe(false)
  expect(states).toEqual([true, false])
})

test('failed or pending notifications do not block operations', async () => {
  const progress = createOperationProgress(async () => {
    throw new Error('old runtime')
  })
  await expect(progress.run(async () => 42)).resolves.toBe(42)
  expect(progress.getProgress()).toBe(false)
  const pending = createOperationProgress(() => new Promise(() => {}))
  await expect(pending.run(async () => 43)).resolves.toBe(43)
  expect(pending.getProgress()).toBe(false)
})

test('nested operations do not clear their parent progress', async () => {
  const notify = jest.fn(async () => {})
  const progress = createOperationProgress(notify)
  await progress.run(async () => {
    await progress.run(async () => {})
    expect(progress.getProgress()).toBe(true)
  })
  expect(progress.getProgress()).toBe(false)
  expect(notify).toHaveBeenCalledTimes(2)
})
