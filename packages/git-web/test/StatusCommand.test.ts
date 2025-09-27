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
  })

  const result = await handleStatus([], { cwd: 'web://test-status' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test-status/.git/config'],
    ['FileSystem.read', 'web:/test-status/.git/HEAD'],
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
  })

  const result = await handleStatus([], { cwd: 'web://different-repo' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/different-repo/.git/config'],
    ['FileSystem.read', 'web:/different-repo/.git/HEAD'],
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
  })

  const result = await handleStatus(['--porcelain'], { cwd: 'web://test-status-args' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test-status-args/.git/config'],
    ['FileSystem.read', 'web:/test-status-args/.git/HEAD'],
  ])
})
