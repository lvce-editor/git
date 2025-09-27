import { test, expect } from '@jest/globals'
import { handleCommit } from '../src/CommitCommand/CommitCommand.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'

test('handleCommit with message', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
  })

  const result = await handleCommit(['-m', 'Test commit'], { cwd: 'web://test-commit' })

  expect(result.stdout).toContain('[main')
  expect(result.stdout).toContain('Test commit')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', 'web:/test-commit/.git/config']])
})

test('handleCommit without message uses default', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
  })

  const result = await handleCommit([], { cwd: 'web://test-commit-default' })

  expect(result.stdout).toContain('[main')
  expect(result.stdout).toContain('Web commit')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', 'web:/test-commit-default/.git/config']])
})

test('handleCommit with multiple args', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }
      return false
    },
  })

  const result = await handleCommit(['-m', 'Complex commit', '--verbose'], { cwd: 'web://test-commit-complex' })

  expect(result.stdout).toContain('[main')
  expect(result.stdout).toContain('Complex commit')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', 'web:/test-commit-complex/.git/config']])
})
