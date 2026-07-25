import { test, expect, jest } from '@jest/globals'
import * as ExtensionHostCommandGitCommitAndSync from '../src/parts/ExtensionHostCommand/ExtensionHostCommandGitCommitAndSync.ts'
import * as GitWorker from '../src/parts/GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../src/parts/GitWorkerCommandType/GitWorkerCommandType.ts'
import * as StatusBarSync from '../src/parts/StatusBarSync/StatusBarSync.ts'

test('execute', async () => {
  const invoke = jest.spyOn(GitWorker, 'invoke').mockImplementation(async () => {})
  const refresh = jest.spyOn(StatusBarSync, 'refresh').mockImplementation(async () => {})

  await ExtensionHostCommandGitCommitAndSync.execute('test message')

  expect(invoke).toHaveBeenCalledTimes(2)
  expect(invoke).toHaveBeenNthCalledWith(1, GitWorkerCommandType.GitCommit, { message: 'test message' })
  expect(invoke).toHaveBeenNthCalledWith(2, 'Command.gitSync')
  expect(refresh).toHaveBeenCalledTimes(1)
})
