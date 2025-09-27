import { test, expect } from '@jest/globals'
import { handleCommit } from '../../src/CommitCommand/CommitCommand.js'

test('handleCommit with message', async () => {
  const result = await handleCommit(['-m', 'Test commit'], { cwd: 'web://test-commit' })

  expect(result.stdout).toContain('[main')
  expect(result.stdout).toContain('Test commit')
  expect(result.exitCode).toBe(0)
})

test('handleCommit without message uses default', async () => {
  const result = await handleCommit([], { cwd: 'web://test-commit-default' })

  expect(result.stdout).toContain('[main')
  expect(result.stdout).toContain('Web commit')
  expect(result.exitCode).toBe(0)
})

test('handleCommit with multiple args', async () => {
  const result = await handleCommit(['-m', 'Complex commit', '--verbose'], { cwd: 'web://test-commit-complex' })

  expect(result.stdout).toContain('[main')
  expect(result.stdout).toContain('Complex commit')
  expect(result.exitCode).toBe(0)
})
