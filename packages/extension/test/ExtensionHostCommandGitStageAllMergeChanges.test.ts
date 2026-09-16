/* eslint-disable jest/no-restricted-jest-methods */
import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn()

jest.unstable_mockModule('../src/parts/GitWorker/GitWorker.ts', () => ({
  invoke,
}))

const ExtensionHostCommandGitStageAllMergeChanges = await import('../src/parts/ExtensionHostCommand/ExtensionHostCommandGitStageAllMergeChanges.ts')

test('id', () => {
  expect(ExtensionHostCommandGitStageAllMergeChanges.id).toBe('git.stageAllMergeChanges')
})

test('execute', async () => {
  await ExtensionHostCommandGitStageAllMergeChanges.execute()
  expect(invoke).toHaveBeenCalledWith('Command.gitStageAllMergeChanges')
})
