import { test, expect } from '@jest/globals'
import { handleAdd } from '../src/AddCommand/AddCommand.ts'

test('handleAdd with specific files', async () => {
  const result = await handleAdd(['file1.txt', 'file2.txt'], { cwd: 'web://test-add' })

  expect(result).toEqual({
    stdout: '',
    stderr: '',
    exitCode: 0,
  })
})

test('handleAdd with dot adds all files', async () => {
  const result = await handleAdd(['.'], { cwd: 'web://test-add-all' })

  expect(result.stdout).toBe('')
  expect(result.stderr).toBe('')
  expect(result.exitCode).toBe(0)
})

test('handleAdd with empty args', async () => {
  const result = await handleAdd([], { cwd: 'web://test-add-empty' })

  expect(result.exitCode).toBe(0)
})
