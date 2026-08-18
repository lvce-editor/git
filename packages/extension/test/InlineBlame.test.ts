import { beforeEach, expect, jest, test } from '@jest/globals'
import { createProvideInlineBlame, type InlineBlameDependencies } from '../src/parts/InlineBlame/InlineBlame.ts'

const execute = jest.fn<InlineBlameDependencies['execute']>()
const getInlineBlameEnabled = jest.fn<InlineBlameDependencies['getInlineBlameEnabled']>()
const getWorkspaceFolder = jest.fn<InlineBlameDependencies['getWorkspaceFolder']>()

beforeEach(() => {
  jest.clearAllMocks()
  getInlineBlameEnabled.mockResolvedValue(true)
  getWorkspaceFolder.mockReturnValue('file:///workspace')
})

test('returns blame information for the requested line', async () => {
  execute.mockResolvedValue({
    exitCode: 0,
    stdout: `0123456789abcdef 2 2 1
author Test User
author-mail <test@example.com>
author-time 1787011200
author-tz +0000
summary Initial commit
filename file.txt
\tsecond`,
  })
  const provideInlineBlame = createProvideInlineBlame({ execute, getInlineBlameEnabled, getWorkspaceFolder })

  await expect(provideInlineBlame({ uri: 'file:///workspace/file.txt' }, 1)).resolves.toEqual({
    text: 'Test User, 2026-08-18 • Initial commit',
  })
  expect(execute).toHaveBeenCalledWith('git', ['blame', '--line-porcelain', '-L', '2,2', '--', 'file.txt'], {
    cwd: 'file:///workspace',
    reject: false,
  })
})

test('does not run git when inline blame is disabled', async () => {
  getInlineBlameEnabled.mockResolvedValue(false)
  const provideInlineBlame = createProvideInlineBlame({ execute, getInlineBlameEnabled, getWorkspaceFolder })

  await expect(provideInlineBlame({ uri: 'file:///workspace/file.txt' }, 0)).resolves.toBeUndefined()
  expect(execute).not.toHaveBeenCalled()
})

test('returns no decoration when the file is outside the workspace', async () => {
  const provideInlineBlame = createProvideInlineBlame({ execute, getInlineBlameEnabled, getWorkspaceFolder })

  await expect(provideInlineBlame({ uri: 'file:///other/file.txt' }, 0)).resolves.toBeUndefined()
  expect(execute).not.toHaveBeenCalled()
})

test('returns no decoration when git blame fails', async () => {
  execute.mockResolvedValue({ exitCode: 128, stdout: '' })
  const provideInlineBlame = createProvideInlineBlame({ execute, getInlineBlameEnabled, getWorkspaceFolder })

  await expect(provideInlineBlame({ uri: 'file:///workspace/untracked.txt' }, 0)).resolves.toBeUndefined()
})
