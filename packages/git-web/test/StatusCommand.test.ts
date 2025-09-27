import { test, expect } from '@jest/globals'
import { handleStatus } from '../src/StatusCommand/StatusCommand.ts'

test('handleStatus returns status for new repository', async () => {
  const result = await handleStatus([], { cwd: 'web://test-status' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
})

test('handleStatus works with different cwd', async () => {
  const result = await handleStatus([], { cwd: 'web://different-repo' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
})

test('handleStatus works with args', async () => {
  const result = await handleStatus(['--porcelain'], { cwd: 'web://test-status-args' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
})
