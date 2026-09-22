/* eslint-disable jest/no-restricted-jest-methods */
import { expect, jest, test } from '@jest/globals'
import * as GitWorkerCommandType from '../src/parts/GitWorkerCommandType/GitWorkerCommandType.ts'

const invoke = jest.fn(async (..._args: readonly unknown[]) => "Merge branch 'feature'")

jest.unstable_mockModule('../src/parts/GitWorker/GitWorker.ts', () => ({
  invoke,
}))

const GetDefaultCommitMessage = await import('../src/parts/GetDefaultCommitMessage/GetDefaultCommitMessage.ts')

test('getDefaultCommitMessage invokes the Git worker for the active repository path', async () => {
  await expect(GetDefaultCommitMessage.getDefaultCommitMessage('/test/workspace')).resolves.toBe("Merge branch 'feature'")
  expect(invoke).toHaveBeenCalledWith(GitWorkerCommandType.GitGetDefaultCommitMessage, { cwd: '/test/workspace' })
})
