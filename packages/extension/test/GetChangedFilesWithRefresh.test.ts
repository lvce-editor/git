import { beforeEach, expect, jest, test } from '@jest/globals'
import {
  createGetChangedFilesWithRefresh,
  type GetChangedFilesWithRefreshDependencies,
} from '../src/parts/GetChangedFilesWithRefresh/GetChangedFilesWithRefresh.ts'

const getChangedFiles = jest.fn<GetChangedFilesWithRefreshDependencies['getChangedFiles']>()
const refreshEditorGutterDecorations = jest.fn<GetChangedFilesWithRefreshDependencies['refreshEditorGutterDecorations']>()

beforeEach(() => {
  jest.clearAllMocks()
})

test('refreshes editor gutter decorations after reading changed files', async () => {
  const files = [{ file: 'src/file.ts', status: 1 }]
  getChangedFiles.mockResolvedValue(files)
  const getChangedFilesWithRefresh = createGetChangedFilesWithRefresh({ getChangedFiles, refreshEditorGutterDecorations })

  await expect(getChangedFilesWithRefresh()).resolves.toBe(files)
  expect(refreshEditorGutterDecorations).toHaveBeenCalledTimes(1)
})

test('does not refresh editor gutter decorations when reading changed files fails', async () => {
  getChangedFiles.mockRejectedValue(new Error('git status failed'))
  const getChangedFilesWithRefresh = createGetChangedFilesWithRefresh({ getChangedFiles, refreshEditorGutterDecorations })

  await expect(getChangedFilesWithRefresh()).rejects.toThrow('git status failed')
  expect(refreshEditorGutterDecorations).not.toHaveBeenCalled()
})

test('returns changed files when an older editor cannot refresh gutter decorations', async () => {
  const files = [{ file: 'src/file.ts', status: 1 }]
  getChangedFiles.mockResolvedValue(files)
  refreshEditorGutterDecorations.mockRejectedValue(new Error('command not found'))
  const getChangedFilesWithRefresh = createGetChangedFilesWithRefresh({ getChangedFiles, refreshEditorGutterDecorations })

  await expect(getChangedFilesWithRefresh()).resolves.toBe(files)
})
