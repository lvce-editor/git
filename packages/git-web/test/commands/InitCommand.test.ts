import { test, expect } from '@jest/globals'
import { handleInit } from '../../src/commands/InitCommand/InitCommand.js'

// Mock RPC for testing
const mockRpc = {
  invoke: jest.fn()
}

// Replace global RPC with mock
Object.defineProperty(globalThis, 'rpc', {
  value: mockRpc,
  writable: true
})

test('handleInit returns success message', async () => {
  // Mock filesystem calls
  mockRpc.invoke
    .mockResolvedValueOnce(false) // config doesn't exist
    .mockResolvedValue(undefined) // mkdir calls
    .mockResolvedValue(undefined) // write calls
  
  const result = await handleInit([], { cwd: 'web://test' })
  
  expect(result).toEqual({
    stdout: 'Initialized empty Git repository in web://test/.git/',
    stderr: '',
    exitCode: 0
  })
})

test('handleInit with --bare flag', async () => {
  // Mock filesystem calls
  mockRpc.invoke
    .mockResolvedValueOnce(false) // config doesn't exist
    .mockResolvedValue(undefined) // mkdir calls
    .mockResolvedValue(undefined) // write calls
  
  const result = await handleInit(['--bare'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('Initialized empty Git repository in web://test/')
  expect(result.exitCode).toBe(0)
})

test('handleInit skips if config already exists', async () => {
  // Mock config exists
  mockRpc.invoke.mockResolvedValueOnce(true)
  
  const result = await handleInit([], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('Initialized empty Git repository')
  expect(result.exitCode).toBe(0)
  // Should not call mkdir or write since config exists
  expect(mockRpc.invoke).toHaveBeenCalledTimes(1)
})

test('handleInit handles filesystem errors', async () => {
  // Mock filesystem error
  mockRpc.invoke.mockRejectedValue(new Error('Filesystem error'))
  
  const result = await handleInit([], { cwd: 'web://test' })
  
  expect(result.stderr).toContain('Filesystem error')
  expect(result.exitCode).toBe(1)
})

test('handleInit creates all necessary directories', async () => {
  // Mock filesystem calls
  mockRpc.invoke
    .mockResolvedValueOnce(false) // config doesn't exist
    .mockResolvedValue(undefined) // mkdir calls
    .mockResolvedValue(undefined) // write calls
  
  await handleInit([], { cwd: 'web://test' })
  
  // Check that all necessary directories were created
  const mkdirCalls = mockRpc.invoke.mock.calls.filter(call => call[0] === 'FileSystem.mkdir')
  expect(mkdirCalls).toHaveLength(6) // hooks, info, objects/info, objects/pack, refs/heads, refs/tags
})

test('handleInit writes config and HEAD files', async () => {
  // Mock filesystem calls
  mockRpc.invoke
    .mockResolvedValueOnce(false) // config doesn't exist
    .mockResolvedValue(undefined) // mkdir calls
    .mockResolvedValue(undefined) // write calls
  
  await handleInit([], { cwd: 'web://test' })
  
  // Check that config and HEAD files were written
  const writeCalls = mockRpc.invoke.mock.calls.filter(call => call[0] === 'FileSystem.write')
  expect(writeCalls).toHaveLength(2) // config and HEAD
  
  // Check config content
  const configCall = writeCalls.find(call => call[1].includes('config'))
  expect(configCall[2]).toContain('[core]')
  expect(configCall[2]).toContain('repositoryformatversion = 0')
  
  // Check HEAD content
  const headCall = writeCalls.find(call => call[1].includes('HEAD'))
  expect(headCall[2]).toContain('ref: refs/heads/main')
})
