import { test, expect } from '@jest/globals'
import { handleVersion } from '../src/VersionCommand/VersionCommand.ts'

test('handleVersion returns correct version', async (): Promise<void> => {
  const result = await handleVersion()

  expect(result).toEqual({
    exitCode: 0,
    stderr: '',
    stdout: 'git version 2.34.1 (web-emulated)',
  })
})

test('handleVersion has no dependencies', async (): Promise<void> => {
  // Version command should work without any parameters
  const result = await handleVersion()

  expect(result.stdout).toContain('git version')
  expect(result.exitCode).toBe(0)
})
