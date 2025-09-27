import { test, expect } from '@jest/globals'
import { handleVersion } from '../src/commands/VersionCommand/VersionCommand.ts'

test('handleVersion returns correct version', async () => {
  const result = await handleVersion()

  expect(result).toEqual({
    stdout: 'git version 2.34.1 (web-emulated)',
    stderr: '',
    exitCode: 0,
  })
})

test('handleVersion has no dependencies', async () => {
  // Version command should work without any parameters
  const result = await handleVersion()

  expect(result.stdout).toContain('git version')
  expect(result.exitCode).toBe(0)
})
