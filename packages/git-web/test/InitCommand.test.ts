import { test, expect } from '@jest/globals'
import { handleInit } from '../src/InitCommand/InitCommand.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'

test('handleInit returns success message', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return false // config doesn't exist
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
    ['FileSystem.exists', 'web:/test/.git/config'],
    ['FileSystem.mkdir', 'web:/test/.git/hooks'],
    ['FileSystem.mkdir', 'web:/test/.git/info'],
    ['FileSystem.mkdir', 'web:/test/.git/objects/info'],
    ['FileSystem.mkdir', 'web:/test/.git/objects/pack'],
    ['FileSystem.mkdir', 'web:/test/.git/refs/heads'],
    ['FileSystem.mkdir', 'web:/test/.git/refs/tags'],
    ['FileSystem.write', 'web:/test/.git/config', expect.stringContaining('[core]')],
    ['FileSystem.write', 'web:/test/.git/HEAD', 'ref: refs/heads/main\n'],
  ])
})

test('handleInit with --bare flag', async () => {
  // Mock filesystem calls
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockResolvedValue(false) // config doesn't exist
  mockRpc.commandMap['FileSystem.mkdir'] = jest.fn().mockResolvedValue(undefined) // mkdir calls
  mockRpc.commandMap['FileSystem.write'] = jest.fn().mockResolvedValue(undefined) // write calls

  const result = await handleInit(['--bare'], { cwd: 'web://test' })

  expect(result.stdout).toContain('Initialized empty Git repository in web://test/')
  expect(result.exitCode).toBe(0)
})

test('handleInit skips if config already exists', async () => {
  // Mock config exists
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockResolvedValue(true)

  const result = await handleInit([], { cwd: 'web://test' })

  expect(result.stdout).toContain('Initialized empty Git repository')
  expect(result.exitCode).toBe(0)
  // Should only call exists, not mkdir or write since config exists
  expect(mockRpc.invocations).toEqual([{ rpcId: 1, method: 'FileSystem.exists', params: ['web://test/.git/config'] }])
})

test('handleInit handles filesystem errors', async () => {
  // Mock filesystem error
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockRejectedValue(new Error('Filesystem error'))

  const result = await handleInit([], { cwd: 'web://test' })

  expect(result.stderr).toContain('Filesystem error')
  expect(result.exitCode).toBe(1)
})

test('handleInit creates all necessary directories', async () => {
  // Mock filesystem calls
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockResolvedValue(false) // config doesn't exist
  mockRpc.commandMap['FileSystem.mkdir'] = jest.fn().mockResolvedValue(undefined) // mkdir calls
  mockRpc.commandMap['FileSystem.write'] = jest.fn().mockResolvedValue(undefined) // write calls

  await handleInit([], { cwd: 'web://test' })

  // Check that all necessary directories were created
  const mkdirInvocations = mockRpc.getInvocationsForMethod('FileSystem.mkdir')
  expect(mkdirInvocations).toHaveLength(6) // hooks, info, objects/info, objects/pack, refs/heads, refs/tags

  // Verify specific directory paths
  const mkdirPaths = mkdirInvocations.map((inv) => inv.params[0])
  expect(mkdirPaths).toContain('web://test/.git/hooks')
  expect(mkdirPaths).toContain('web://test/.git/info')
  expect(mkdirPaths).toContain('web://test/.git/objects/info')
  expect(mkdirPaths).toContain('web://test/.git/objects/pack')
  expect(mkdirPaths).toContain('web://test/.git/refs/heads')
  expect(mkdirPaths).toContain('web://test/.git/refs/tags')
})

test('handleInit writes config and HEAD files', async () => {
  // Mock filesystem calls
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockResolvedValue(false) // config doesn't exist
  mockRpc.commandMap['FileSystem.mkdir'] = jest.fn().mockResolvedValue(undefined) // mkdir calls
  mockRpc.commandMap['FileSystem.write'] = jest.fn().mockResolvedValue(undefined) // write calls

  await handleInit([], { cwd: 'web://test' })

  // Check that config and HEAD files were written
  const writeInvocations = mockRpc.getInvocationsForMethod('FileSystem.write')
  expect(writeInvocations).toHaveLength(2) // config and HEAD

  // Check config content
  const configInvocation = writeInvocations.find((inv) => inv.params[0].includes('config'))
  expect(configInvocation).toBeDefined()
  expect(configInvocation!.params[1]).toContain('[core]')
  expect(configInvocation!.params[1]).toContain('repositoryformatversion = 0')

  // Check HEAD content
  const headInvocation = writeInvocations.find((inv) => inv.params[0].includes('HEAD'))
  expect(headInvocation).toBeDefined()
  expect(headInvocation!.params[1]).toContain('ref: refs/heads/main')
})

test('handleInit verifies RPC invocations in correct order', async () => {
  // Mock filesystem calls
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockResolvedValue(false) // config doesn't exist
  mockRpc.commandMap['FileSystem.mkdir'] = jest.fn().mockResolvedValue(undefined) // mkdir calls
  mockRpc.commandMap['FileSystem.write'] = jest.fn().mockResolvedValue(undefined) // write calls

  await handleInit([], { cwd: 'web://test' })

  // Verify the order of RPC calls
  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.exists', params: ['web://test/.git/config'] },
    { rpcId: 1, method: 'FileSystem.mkdir', params: ['web://test/.git/hooks'] },
    { rpcId: 1, method: 'FileSystem.mkdir', params: ['web://test/.git/info'] },
    { rpcId: 1, method: 'FileSystem.mkdir', params: ['web://test/.git/objects/info'] },
    { rpcId: 1, method: 'FileSystem.mkdir', params: ['web://test/.git/objects/pack'] },
    { rpcId: 1, method: 'FileSystem.mkdir', params: ['web://test/.git/refs/heads'] },
    { rpcId: 1, method: 'FileSystem.mkdir', params: ['web://test/.git/refs/tags'] },
    { rpcId: 1, method: 'FileSystem.write', params: ['web://test/.git/config', expect.stringContaining('[core]')] },
    { rpcId: 1, method: 'FileSystem.write', params: ['web://test/.git/HEAD', 'ref: refs/heads/main\n'] },
  ])
})
