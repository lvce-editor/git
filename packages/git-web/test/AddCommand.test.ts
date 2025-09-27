import { test, expect } from '@jest/globals'
import { handleAdd } from '../src/AddCommand/AddCommand.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'

test('handleAdd with specific files', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      // Return true for .git/config to enable filesystem mode
      if (path.endsWith('.git/config')) {
        return true
      }
      // Return true for .git/index to simulate existing index
      if (path.endsWith('.git/index')) {
        return true
      }
      // Return true for files we want to add
      if (path.includes('file1.txt') || path.includes('file2.txt')) {
        return true
      }
      return false
    },
    'FileSystem.read'(path: string) {
      if (path.endsWith('.git/index')) {
        return 'file:existing.txt\n'
      }
      return ''
    },
    'FileSystem.write'(path: string, content: string) {
      // Mock implementation - no assertions here
    },
    'FileSystem.readdir'(path: string) {
      if (path === 'web://test-add') {
        return ['file1.txt', 'file2.txt', 'other.txt']
      }
      return []
    },
    'FileSystem.stat'(path: string) {
      if (path.includes('file1.txt') || path.includes('file2.txt') || path.includes('other.txt')) {
        return { isFile: true, isDirectory: false, size: 100 }
      }
      return { isFile: false, isDirectory: true, size: 0 }
    },
  })
  const result = await handleAdd(['file1.txt', 'file2.txt'], { cwd: 'web://test-add' })

  expect(result).toEqual({
    stdout: '',
    stderr: '',
    exitCode: 0,
  })

  expect(mockRpc.invocations).toEqual([])
})

test('handleAdd with dot adds all files', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      if (path.endsWith('.git/index')) {
        return true
      }
      return true // All files exist
    },
    'FileSystem.read'(path: string) {
      if (path.endsWith('.git/index')) {
        return 'file:already-staged.txt\n'
      }
      return ''
    },
    'FileSystem.write'(path: string, content: string) {
      // Mock implementation - no assertions here
    },
    'FileSystem.readdir'(path: string) {
      if (path === 'web://test-add-all') {
        return ['file1.txt', 'file2.txt', 'other.txt']
      }
      return []
    },
    'FileSystem.stat'(path: string) {
      if (path.includes('file1.txt') || path.includes('file2.txt') || path.includes('other.txt')) {
        return { isFile: true, isDirectory: false, size: 100 }
      }
      return { isFile: false, isDirectory: true, size: 0 }
    },
  })

  const result = await handleAdd(['.'], { cwd: 'web://test-add-all' })

  expect(result.stdout).toBe('')
  expect(result.stderr).toBe('')
  expect(result.exitCode).toBe(0)

  // Verify filesystem operations
  expect(mockRpc.invocations).toContainEqual(['FileSystem.exists', 'web:/test-add-all/.git/config'])
  expect(mockRpc.invocations).toContainEqual(['FileSystem.readdir', 'web://test-add-all'])

  // Find the write call and verify its content
  const writeCall = mockRpc.invocations.find((call) => call[0] === 'FileSystem.write' && call[1].endsWith('.git/index'))
  expect(writeCall).toBeDefined()
  expect(writeCall![2]).toContain('file:already-staged.txt')
  expect(writeCall![2]).toContain('file:file1.txt')
  expect(writeCall![2]).toContain('file:file2.txt')
  expect(writeCall![2]).toContain('file:other.txt')
})

test('handleAdd with empty args', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
  })

  const result = await handleAdd([], { cwd: 'web://test-add-empty' })

  expect(result.exitCode).toBe(0)

  // Should only check for git config, no other filesystem operations
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', 'web:/test-add-empty/.git/config']])
})
