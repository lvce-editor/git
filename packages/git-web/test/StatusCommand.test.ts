import { test, expect } from '@jest/globals'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'
import { handleStatus } from '../src/StatusCommand/StatusCommand.ts'

test('handleStatus returns status for new repository', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
    'FileSystem.read'(path: string) {
      if (path.endsWith('.git/HEAD')) {
        return 'ref: refs/heads/main\n'
      }
      return ''
    },
    'FileSystem.readdir'(path: string) {
      if (path === 'web://test-status') {
        return ['file1.txt', 'file2.txt']
      }
      return []
    },
    'FileSystem.stat'(path: string) {
      return { isFile: true, isDirectory: false, size: 100 }
    },
  })

  const result = await handleStatus([], { cwd: 'web://test-status' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web://test-status/.git/config'],
    ['FileSystem.read', 'web://test-status/.git/HEAD'],
    ['FileSystem.readdir', 'web://test-status'],
    ['FileSystem.stat', 'web://test-status/file1.txt'],
  ])
})

test('handleStatus works with different cwd', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
    'FileSystem.read'(path: string) {
      if (path.endsWith('.git/HEAD')) {
        return 'ref: refs/heads/main\n'
      }
      return ''
    },
    'FileSystem.readdir'(path: string) {
      if (path === 'web://different-repo') {
        return ['file1.txt']
      }
      return []
    },
    'FileSystem.stat'(path: string) {
      return { isFile: true, isDirectory: false, size: 100 }
    },
  })

  const result = await handleStatus([], { cwd: 'web://different-repo' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web://different-repo/.git/config'],
    ['FileSystem.read', 'web://different-repo/.git/HEAD'],
    ['FileSystem.readdir', 'web://different-repo'],
    ['FileSystem.stat', 'web://different-repo/file1.txt'],
  ])
})

test('handleStatus works with args', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
    'FileSystem.read'(path: string) {
      if (path.endsWith('.git/HEAD')) {
        return 'ref: refs/heads/main\n'
      }
      return ''
    },
    'FileSystem.readdir'(path: string) {
      return []
    },
  })

  const result = await handleStatus(['--porcelain'], { cwd: 'web://test-status-args' })

  expect(result.stdout).toBe('')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web://test-status-args/.git/config'],
    ['FileSystem.read', 'web://test-status-args/.git/HEAD'],
    ['FileSystem.readdir', 'web://test-status-args'],
  ])
})

test('handleStatus with --porcelain returns porcelain format', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
    'FileSystem.read'(path: string) {
      if (path.endsWith('.git/HEAD')) {
        return 'ref: refs/heads/main\n'
      }
      return ''
    },
    'FileSystem.readdir'(path: string) {
      if (path === 'web://test-porcelain') {
        return ['file1.txt', 'file2.txt']
      }
      return []
    },
    'FileSystem.stat'(path: string) {
      return { isFile: true, isDirectory: false, size: 100 }
    },
  })

  const result = await handleStatus(['--porcelain'], { cwd: 'web://test-porcelain' })

  expect(result.exitCode).toBe(0)
  // The output should contain porcelain format lines (status + filename)
  // Format: "XY filename" where X is index status, Y is working tree status
  expect(result.stdout).toMatch(/^[ AMDRC?][AMDRC?] .+$/m)
})

test('handleStatus with --porcelain and -uall returns porcelain format with untracked files', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
    'FileSystem.read'(path: string) {
      if (path.endsWith('.git/HEAD')) {
        return 'ref: refs/heads/main\n'
      }
      return ''
    },
    'FileSystem.readdir'(path: string) {
      if (path === 'web://test-porcelain-uall') {
        return ['file1.txt', 'file2.txt']
      }
      return []
    },
    'FileSystem.stat'(path: string) {
      return { isFile: true, isDirectory: false, size: 100 }
    },
  })

  const result = await handleStatus(['--porcelain', '-uall'], { cwd: 'web://test-porcelain-uall' })

  expect(result.exitCode).toBe(0)
  // Should include porcelain format lines (status + filename)
  // Format: "XY filename" where X is index status, Y is working tree status
  expect(result.stdout).toMatch(/^[ AMDRC?][AMDRC?] .+$/m)
})
