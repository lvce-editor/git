import { test, expect } from '@jest/globals'
import { handleInit } from '../../src/commands/InitCommand/InitCommand.js'

test('handleInit returns success message', async () => {
  const result = await handleInit([], { cwd: 'web://test' })

  expect(result).toEqual({
    stdout: 'Initialized empty Git repository in .git/',
    stderr: '',
    exitCode: 0
  })
})

test('handleInit works with any args', async () => {
  const result = await handleInit(['--bare'], { cwd: 'web://test' })

  expect(result.stdout).toContain('Initialized empty Git repository')
  expect(result.exitCode).toBe(0)
})

test('handleInit works with any cwd', async () => {
  const result = await handleInit([], { cwd: 'web://different-path' })

  expect(result.stdout).toContain('Initialized empty Git repository')
  expect(result.exitCode).toBe(0)
})
