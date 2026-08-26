import { beforeEach, expect, jest, test } from '@jest/globals'
import { createGetGroupsWithRefresh, type GetGroupsWithRefreshDependencies } from '../src/parts/GetGroupsWithRefresh/GetGroupsWithRefresh.ts'

const getGroups = jest.fn<GetGroupsWithRefreshDependencies['getGroups']>()
const refreshEditorGutterDecorations = jest.fn<GetGroupsWithRefreshDependencies['refreshEditorGutterDecorations']>()

beforeEach(() => {
  jest.clearAllMocks()
})

test('refreshes editor gutter decorations after reading source control groups', async () => {
  const groups = [{ id: 'changes' }]
  getGroups.mockResolvedValue(groups)
  const getGroupsWithRefresh = createGetGroupsWithRefresh({ getGroups, refreshEditorGutterDecorations })

  await expect(getGroupsWithRefresh('/tmp/repository')).resolves.toBe(groups)
  expect(getGroups).toHaveBeenCalledWith('/tmp/repository')
  expect(refreshEditorGutterDecorations).toHaveBeenCalledTimes(1)
})

test('does not refresh editor gutter decorations when reading source control groups fails', async () => {
  getGroups.mockRejectedValue(new Error('git status failed'))
  const getGroupsWithRefresh = createGetGroupsWithRefresh({ getGroups, refreshEditorGutterDecorations })

  await expect(getGroupsWithRefresh('/tmp/repository')).rejects.toThrow('git status failed')
  expect(refreshEditorGutterDecorations).not.toHaveBeenCalled()
})

test('returns source control groups when an older editor cannot refresh gutter decorations', async () => {
  const groups = [{ id: 'changes' }]
  getGroups.mockResolvedValue(groups)
  refreshEditorGutterDecorations.mockRejectedValue(new Error('command not found'))
  const getGroupsWithRefresh = createGetGroupsWithRefresh({ getGroups, refreshEditorGutterDecorations })

  await expect(getGroupsWithRefresh('/tmp/repository')).resolves.toBe(groups)
})
