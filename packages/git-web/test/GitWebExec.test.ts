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

  // --version command doesn't make any RPC calls
  expect(mockRpc.invocations).toEqual([])
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

test('exec with unknown command throws error', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  await expect(exec('git', ['unknown-command'], { cwd: 'web://test' }))
    .rejects.toThrow('git: \'unknown-command\' is not a git command. See \'git --help\'.')

  // Unknown commands don't make any RPC calls
  expect(mockRpc.invocations).toEqual([])
})

test('exec with empty args throws error', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  await expect(exec('git', [], { cwd: 'web://test' }))
    .rejects.toThrow('usage: git')

  // Empty args don't make any RPC calls
  expect(mockRpc.invocations).toEqual([])
})
