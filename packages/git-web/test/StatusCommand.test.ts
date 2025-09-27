import { test, expect } from '@jest/globals'
import { handleStatus } from '../src/StatusCommand/StatusCommand.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'

test('handleStatus returns status for new repository', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
  })

  const result = await handleStatus([], { cwd: 'web://test-status' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', 'web:/test-status/.git/config']])
})

test('handleStatus works with different cwd', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
  })

  const result = await handleStatus([], { cwd: 'web://different-repo' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', 'web:/different-repo/.git/config']])
})

test('handleStatus works with args', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
  })

  const result = await handleStatus(['--porcelain'], { cwd: 'web://test-status-args' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', 'web:/test-status-args/.git/config']])
})
