import { beforeEach, expect, jest, test } from '@jest/globals'
import {
  createProvideGutterDecorations,
  getGutterDecorations,
  type GutterDecorationDependencies,
} from '../src/parts/GutterDecorations/GutterDecorations.ts'

const execute = jest.fn<GutterDecorationDependencies['execute']>()
const getGutterDecorationsEnabled = jest.fn<GutterDecorationDependencies['getGutterDecorationsEnabled']>()
const getWorkspaceFolder = jest.fn<GutterDecorationDependencies['getWorkspaceFolder']>()

beforeEach(() => {
  jest.clearAllMocks()
  getGutterDecorationsEnabled.mockResolvedValue(true)
  getWorkspaceFolder.mockReturnValue('file:///workspace')
})

test('returns no decorations for identical text', () => {
  expect(getGutterDecorations('first\nsecond', 'first\nsecond')).toEqual([])
})

test('marks inserted lines as added', () => {
  expect(getGutterDecorations('first\nthird', 'first\nsecond\nthird')).toEqual([{ rowIndex: 1, type: 'added' }])
})

test('marks replaced lines as modified', () => {
  expect(getGutterDecorations('first\nold\nthird', 'first\nnew\nthird')).toEqual([{ rowIndex: 1, type: 'modified' }])
})

test('marks removed lines as deleted on the following row', () => {
  expect(getGutterDecorations('first\nremoved\nthird', 'first\nthird')).toEqual([{ rowIndex: 1, type: 'deleted' }])
})

test('marks a removed final line as deleted on the preceding row', () => {
  expect(getGutterDecorations('first\nremoved', 'first')).toEqual([{ rowIndex: 0, type: 'deleted' }])
})

test('classifies replacement overflow as added lines', () => {
  expect(getGutterDecorations('first\nold\nlast', 'first\nnew one\nnew two\nlast')).toEqual([
    { rowIndex: 1, type: 'modified' },
    { rowIndex: 2, type: 'added' },
  ])
})

test('handles multiple separated changes', () => {
  expect(
    getGutterDecorations(
      'unchanged\nold modified\nanchor one\nwill delete\nanchor two\nlast',
      'unchanged\nnew modified\nanchor one\nanchor two\nadded\nlast',
    ),
  ).toEqual([
    { rowIndex: 1, type: 'modified' },
    { rowIndex: 3, type: 'deleted' },
    { rowIndex: 4, type: 'added' },
  ])
})

test('ignores a trailing newline difference', () => {
  expect(getGutterDecorations('first\n', 'first')).toEqual([])
})

test('provides decorations against the HEAD version', async () => {
  execute.mockResolvedValue({ exitCode: 0, stdout: 'first\nold\nlast' })
  const provideGutterDecorations = createProvideGutterDecorations({ execute, getGutterDecorationsEnabled, getWorkspaceFolder })

  await expect(
    provideGutterDecorations({
      text: 'first\nnew\nlast',
      uri: 'file:///workspace/src/file.txt',
    }),
  ).resolves.toEqual([{ rowIndex: 1, type: 'modified' }])
  expect(execute).toHaveBeenCalledWith('git', ['show', 'HEAD:./src/file.txt'], {
    cwd: 'file:///workspace',
    reject: false,
  })
})

test('marks every line in an untracked file as added', async () => {
  execute.mockResolvedValueOnce({ exitCode: 128, stdout: '' }).mockResolvedValueOnce({ exitCode: 0, stdout: 'true\n' })
  const provideGutterDecorations = createProvideGutterDecorations({ execute, getGutterDecorationsEnabled, getWorkspaceFolder })

  await expect(provideGutterDecorations({ text: 'first\nsecond', uri: 'file:///workspace/new.txt' })).resolves.toEqual([
    { rowIndex: 0, type: 'added' },
    { rowIndex: 1, type: 'added' },
  ])
})

test('returns no decorations outside a git repository', async () => {
  execute.mockResolvedValue({ exitCode: 128, stdout: '' })
  const provideGutterDecorations = createProvideGutterDecorations({ execute, getGutterDecorationsEnabled, getWorkspaceFolder })

  await expect(provideGutterDecorations({ text: 'first\nsecond', uri: 'file:///workspace/file.txt' })).resolves.toEqual([])
  expect(execute).toHaveBeenLastCalledWith('git', ['rev-parse', '--is-inside-work-tree'], {
    cwd: 'file:///workspace',
    reject: false,
  })
})

test('does not run git when gutter decorations are disabled', async () => {
  getGutterDecorationsEnabled.mockResolvedValue(false)
  const provideGutterDecorations = createProvideGutterDecorations({ execute, getGutterDecorationsEnabled, getWorkspaceFolder })

  await expect(provideGutterDecorations({ text: 'line', uri: 'file:///workspace/file.txt' })).resolves.toEqual([])
  expect(execute).not.toHaveBeenCalled()
})

test('returns no decorations for files outside the workspace', async () => {
  const provideGutterDecorations = createProvideGutterDecorations({ execute, getGutterDecorationsEnabled, getWorkspaceFolder })

  await expect(provideGutterDecorations({ text: 'line', uri: 'file:///other/file.txt' })).resolves.toEqual([])
  expect(execute).not.toHaveBeenCalled()
})

test('returns no decorations when git cannot be executed', async () => {
  execute.mockRejectedValue(new Error('git not found'))
  const provideGutterDecorations = createProvideGutterDecorations({ execute, getGutterDecorationsEnabled, getWorkspaceFolder })

  await expect(provideGutterDecorations({ text: 'line', uri: 'file:///workspace/file.txt' })).resolves.toEqual([])
})
