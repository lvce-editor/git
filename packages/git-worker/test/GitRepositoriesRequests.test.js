import { jest } from '@jest/globals'
import * as GitRepositoriesRequests from '../src/parts/GitRepositoriesRequests/GitRepositoriesRequests.js'

beforeEach(() => {
  GitRepositoriesRequests.state.running = Object.create(null)
  GitRepositoriesRequests.state.changeListeners = []
})

test('execute', async () => {
  expect(GitRepositoriesRequests.isRunning('test')).toBe(false)
  const promise = GitRepositoriesRequests.execute({
    id: 'test',
    async fn() {},
    args: {},
  })
  expect(GitRepositoriesRequests.isRunning('test')).toBe(true)
  await promise
  expect(GitRepositoriesRequests.isRunning('test')).toBe(false)
})

test('execute - error', async () => {
  expect(GitRepositoriesRequests.isRunning('test')).toBe(false)
  const promise = GitRepositoriesRequests.execute({
    id: 'test',
    async fn() {
      throw new Error('oops')
    },
    args: {},
  })
  expect(GitRepositoriesRequests.isRunning('test')).toBe(true)
  await expect(promise).rejects.toThrowError(new Error('oops'))
  expect(GitRepositoriesRequests.isRunning('test')).toBe(false)
})

test('onChange', async () => {
  const listener = jest.fn()
  GitRepositoriesRequests.onChange(listener)
  const promise = GitRepositoriesRequests.execute({
    id: 'test',
    async fn() {},
    args: {},
  })
  expect(listener).toHaveBeenCalledTimes(1)
  await promise
  expect(listener).toHaveBeenCalledTimes(2)
})

test('onChange - error', async () => {
  const listener = jest.fn()
  GitRepositoriesRequests.onChange(listener)
  const promise = GitRepositoriesRequests.execute({
    id: 'test',
    async fn() {
      throw new Error('oops')
    },
    args: {},
  })
  expect(listener).toHaveBeenCalledTimes(1)
  await expect(promise).rejects.toThrowError(new Error('oops'))
  expect(listener).toHaveBeenCalledTimes(2)
})
