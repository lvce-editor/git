import { jest } from '@jest/globals'
import * as StatusBarSync from '../src/parts/UiStatusBar/StatusBarSync.js'

beforeEach(() => {
  // GitRepositoriesRequests.state.changeListeners = []
  // GitRepositoriesRequests.state.running = Object.create(null)
})

test.skip('createSyncStatusBarItem - change events when running git sync', async () => {
  Repositories.state.currentRepository = {}
  const listener = jest.fn()
  const state = StatusBarSync.create()
  StatusBarSync.initialize(state)
  state.emitter.addListener('change', listener)
  const promise = GitRepositoriesRequests.execute({
    id: 'sync',
    async fn() {},
    args: {},
  })
  expect(listener).toHaveBeenCalledTimes(1)
  expect(StatusBarSync.getItem()).toEqual({
    icon: '$(sync-spin)',
    id: 'sync head',
  })
  await promise
  expect(listener).toHaveBeenCalledTimes(2)
  expect(StatusBarSync.getItem()).toEqual({
    icon: '$(sync)',
    id: 'sync head',
  })
})

test.skip('createSyncStatusBarItem - change events when git sync throws error', async () => {
  Repositories.state.currentRepository = {}
  const listener = jest.fn()
  const state = StatusBarSync.create()
  StatusBarSync.initialize(state)
  state.emitter.addListener('change', listener)
  const promise = GitRepositoriesRequests.execute({
    id: 'sync',
    async fn() {
      throw new Error('oops')
    },
    args: {},
  })
  expect(listener).toHaveBeenCalledTimes(1)
  expect(StatusBarSync.getItem()).toEqual({
    icon: '$(sync-spin)',
    id: 'sync head',
  })
  await expect(promise).rejects.toThrowError(new Error('oops'))
  expect(listener).toHaveBeenCalledTimes(2)
  expect(StatusBarSync.getItem()).toEqual({
    icon: '$(sync)',
    id: 'sync head',
  })
})
