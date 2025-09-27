import { test, expect } from '@jest/globals'
import { RpcFileSystem } from '../src/FileSystem/FileSystem.js'
import type { FileSystem } from '../src/FileSystemInterface/FileSystemInterface.js'
import { createMockRpc, setupRpcMock, teardownRpcMock, createFileSystemCommandMap } from './test-helpers/mockRpcHelper.js'

let mockRpc: ReturnType<typeof createMockRpc>

test.beforeEach(() => {
  mockRpc = createMockRpc(createFileSystemCommandMap())
  setupRpcMock(mockRpc)
})

test.afterEach(() => {
  teardownRpcMock()
})

test('RpcFileSystem exists returns true when file exists', async () => {
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockResolvedValue(true)

  const fs = new RpcFileSystem()
  const result = await fs.exists('/test/path')

  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.exists', params: ['/test/path'] }
  ])
})

test('RpcFileSystem exists returns false when file does not exist', async () => {
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockResolvedValue(false)

  const fs = new RpcFileSystem()
  const result = await fs.exists('/nonexistent/path')

  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.exists', params: ['/nonexistent/path'] }
  ])
})

test('RpcFileSystem exists handles errors gracefully', async () => {
  mockRpc.commandMap['FileSystem.exists'] = jest.fn().mockRejectedValue(new Error('RPC error'))

  const fs = new RpcFileSystem()
  const result = await fs.exists('/error/path')

  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.exists', params: ['/error/path'] }
  ])
})

test('RpcFileSystem mkdir calls RPC', async () => {
  mockRpc.commandMap['FileSystem.mkdir'] = jest.fn().mockResolvedValue(undefined)

  const fs = new RpcFileSystem()
  await fs.mkdir('/test/dir')

  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.mkdir', params: ['/test/dir'] }
  ])
})

test('RpcFileSystem write calls RPC', async () => {
  mockRpc.commandMap['FileSystem.write'] = jest.fn().mockResolvedValue(undefined)

  const fs = new RpcFileSystem()
  await fs.write('/test/file', 'content')

  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.write', params: ['/test/file', 'content'] }
  ])
})

test('RpcFileSystem read calls RPC', async () => {
  mockRpc.commandMap['FileSystem.read'] = jest.fn().mockResolvedValue('file content')

  const fs = new RpcFileSystem()
  const result = await fs.read('/test/file')

  expect(result).toBe('file content')
  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.read', params: ['/test/file'] }
  ])
})

test('RpcFileSystem readdir calls RPC', async () => {
  mockRpc.commandMap['FileSystem.readdir'] = jest.fn().mockResolvedValue(['file1.txt', 'file2.txt'])

  const fs = new RpcFileSystem()
  const result = await fs.readdir('/test/dir')

  expect(result).toEqual(['file1.txt', 'file2.txt'])
  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.readdir', params: ['/test/dir'] }
  ])
})

test('RpcFileSystem stat calls RPC', async () => {
  mockRpc.commandMap['FileSystem.stat'] = jest.fn().mockResolvedValue({ isFile: true, isDirectory: false, size: 1024 })

  const fs = new RpcFileSystem()
  const result = await fs.stat('/test/file')

  expect(result).toEqual({ isFile: true, isDirectory: false, size: 1024 })
  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.stat', params: ['/test/file'] }
  ])
})

test('RpcFileSystem unlink calls RPC', async () => {
  mockRpc.commandMap['FileSystem.unlink'] = jest.fn().mockResolvedValue(undefined)

  const fs = new RpcFileSystem()
  await fs.unlink('/test/file')

  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.unlink', params: ['/test/file'] }
  ])
})

test('RpcFileSystem rmdir calls RPC', async () => {
  mockRpc.commandMap['FileSystem.rmdir'] = jest.fn().mockResolvedValue(undefined)

  const fs = new RpcFileSystem()
  await fs.rmdir('/test/dir')

  expect(mockRpc.invocations).toEqual([
    { rpcId: 1, method: 'FileSystem.rmdir', params: ['/test/dir'] }
  ])
})
