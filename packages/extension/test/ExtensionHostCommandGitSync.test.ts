import { expect, jest, test } from '@jest/globals'
import * as ExtensionHostCommandGitSync from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitSync.ts'
import * as GitWorker from '../src/parts/GitWorker/GitWorker.ts'
import * as StatusBarSync from '../src/parts/StatusBarSync/StatusBarSync.ts'

test('execute marks the status bar item as spinning while sync is in progress', async () => {
  const { promise: syncPromise, resolve: resolveSync } = Promise.withResolvers()
  const invoke = jest.spyOn(GitWorker, 'invoke').mockImplementation(async () => syncPromise)
  const refresh = jest.spyOn(StatusBarSync, 'refresh').mockImplementation(async () => {})
  const setSpinning = jest.spyOn(StatusBarSync, 'setSpinning').mockImplementation(async () => {})

  const result = ExtensionHostCommandGitSync.execute()
  await Promise.resolve()

  expect(setSpinning).toHaveBeenCalledTimes(1)
  expect(setSpinning).toHaveBeenCalledWith(true)
  expect(invoke).toHaveBeenCalledWith('Command.gitSync')

  resolveSync(undefined)
  await result

  expect(refresh).toHaveBeenCalledTimes(1)
  expect(setSpinning).toHaveBeenNthCalledWith(2, false)
})

test('execute stops spinning when sync fails', async () => {
  jest.spyOn(GitWorker, 'invoke').mockRejectedValue(new Error('sync failed'))
  const refresh = jest.spyOn(StatusBarSync, 'refresh').mockImplementation(async () => {})
  const setSpinning = jest.spyOn(StatusBarSync, 'setSpinning').mockImplementation(async () => {})

  await expect(ExtensionHostCommandGitSync.execute()).rejects.toThrow('sync failed')

  expect(refresh).toHaveBeenCalledTimes(1)
  expect(setSpinning).toHaveBeenNthCalledWith(1, true)
  expect(setSpinning).toHaveBeenNthCalledWith(2, false)
})
