import { test, expect } from '@jest/globals'
import { handleAdd } from '../src/AddCommand/AddCommand.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'

test.only('handleAdd with specific files', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'() {
      return true
    },
  })
  const result = await handleAdd(['file1.txt', 'file2.txt'], { cwd: 'web://test-add' })

  expect(result).toEqual({
    stdout: '',
    stderr: '',
    exitCode: 0,
  })
  expect(mockRpc.invocations).toEqual([1, 'FileSystem.exists', 'web:/test-add/.git/config'])
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
