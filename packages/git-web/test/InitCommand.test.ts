import { test, expect } from '@jest/globals'
import { handleInit } from '../src/InitCommand/InitCommand.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'

test('handleInit returns success message', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return false // Config doesn't exist
      }

      return false
    },
    'FileSystem.mkdir'(path: string) {
      // Mock mkdir calls
    },
    'FileSystem.write'(path: string, content: string) {
      // Mock write calls
    },
  })

  const result = await handleInit([], { cwd: 'web://test' })

  expect(result).toEqual({
    stdout: 'Initialized empty Git repository in web://test/.git/',
    stderr: '',
    exitCode: 0,
  })

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web://test/.git/config'],
    ['FileSystem.mkdir', 'web://test/.git/hooks'],
    ['FileSystem.mkdir', 'web://test/.git/info'],
    ['FileSystem.mkdir', 'web://test/.git/objects/info'],
    ['FileSystem.mkdir', 'web://test/.git/objects/pack'],
    ['FileSystem.mkdir', 'web://test/.git/refs/heads'],
    ['FileSystem.mkdir', 'web://test/.git/refs/tags'],
    ['FileSystem.write', 'web://test/.git/config', expect.stringContaining('[core]')],
    ['FileSystem.write', 'web://test/.git/HEAD', 'ref: refs/heads/main\n'],
  ])
})

test('handleInit with --bare flag', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return false // Config doesn't exist
      }

      return false
    },
    'FileSystem.mkdir'(path: string) {
      // Mock mkdir calls
    },
    'FileSystem.write'(path: string, content: string) {
      // Mock write calls
    },
  })

  const result = await handleInit(['--bare'], { cwd: 'web://test' })

  expect(result.stdout).toContain('Initialized empty Git repository in web://test/')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web://test/config'],
    ['FileSystem.mkdir', 'web://test/hooks'],
    ['FileSystem.mkdir', 'web://test/info'],
    ['FileSystem.mkdir', 'web://test/objects/info'],
    ['FileSystem.mkdir', 'web://test/objects/pack'],
    ['FileSystem.mkdir', 'web://test/refs/heads'],
    ['FileSystem.mkdir', 'web://test/refs/tags'],
    ['FileSystem.write', 'web://test/config', expect.stringContaining('[core]')],
    ['FileSystem.write', 'web://test/HEAD', 'ref: refs/heads/main\n'],
  ])
})

test('handleInit skips if config already exists', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true // Config exists
      }

      return false
    },
  })

  const result = await handleInit([], { cwd: 'web://test' })

  expect(result.stdout).toContain('Initialized empty Git repository')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', 'web://test/.git/config']])
})

test('handleInit handles filesystem errors', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // Config doesn't exist, so we proceed
    },
    'FileSystem.mkdir'(path: string) {
      throw new Error('Filesystem error')
    },
    'FileSystem.write'(path: string, content: string) {
      // Mock write calls
    },
  })

  const result = await handleInit([], { cwd: 'web://test' })

  expect(result.stderr).toContain('Filesystem error')
  expect(result.exitCode).toBe(1)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web://test/.git/config'],
    ['FileSystem.mkdir', 'web://test/.git/hooks'],
  ])
})
