/* eslint-disable jest/no-restricted-jest-methods */
import { expect, jest, test } from '@jest/globals'
import * as GitWorkerCommandType from '../src/parts/GitWorkerCommandType/GitWorkerCommandType.ts'

const invoke = jest.fn(async (..._args: readonly unknown[]) => 'main')

jest.unstable_mockModule('../src/parts/GitWorker/GitWorker.ts', () => ({
  invoke,
}))

const GetCurrentBranch = await import('../src/parts/GetCurrentBranch/GetCurrentBranch.ts')

test('getCurrentBranch invokes the Git worker for the active repository path', async () => {
  await expect(GetCurrentBranch.getCurrentBranch('/test/workspace')).resolves.toBe('main')
  expect(invoke).toHaveBeenCalledWith(GitWorkerCommandType.GitGetCurrentBranch, { cwd: '/test/workspace' })
})
