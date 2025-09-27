import { test, expect } from '@jest/globals'
import { exec } from '../src/GitWebExec/GitWebExec.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'
import { registerCommand } from '../src/GitCommands/GitCommands.ts'
import { handleVersion } from '../src/VersionCommand/VersionCommand.ts'

// Register commands for testing
registerCommand('--version', handleVersion)

test('exec with valid git command', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const result = await exec('git', ['--version'], { cwd: 'web://test' })
  
  expect(result).toEqual({
    stdout: 'git version 2.34.1 (web-emulated)',
    stderr: '',
    exitCode: 0
  })

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('exec with invalid gitPath throws error', async () => {
  await expect(
    exec(null as any, ['--version'], { cwd: 'web://test' })
  ).rejects.toThrow('gitPath must be of type string, was null')
})

test('exec with invalid args throws error', async () => {
  await expect(
    exec('git', null as any, { cwd: 'web://test' })
  ).rejects.toThrow('args must be an array, was null')
})

test('exec with invalid options throws error', async () => {
  await expect(
    exec('git', ['--version'], null as any)
  ).rejects.toThrow('options must be an object, was null')
})

test('exec with invalid cwd throws error', async () => {
  await expect(
    exec('git', ['--version'], { cwd: null as any })
  ).rejects.toThrow('cwd must be of type string, was null')
})

test('exec with unknown command returns error', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const result = await exec('git', ['unknown-command'], { cwd: 'web://test' })
  
  expect(result.stderr).toContain('is not a git command')
  expect(result.exitCode).toBe(127)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('exec with empty args shows usage', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const result = await exec('git', [], { cwd: 'web://test' })
  
  expect(result.stderr).toContain('usage: git')
  expect(result.exitCode).toBe(1)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})
