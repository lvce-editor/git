import { test, expect } from '@jest/globals'
import { RpcFileSystem } from '../src/FileSystem/FileSystem.js'
import type { FileSystem } from '../src/FileSystemInterface/FileSystemInterface.js'

// Mock RPC for testing
const mockRpc = {
  invoke: jest.fn()
}

// Replace global RPC with mock
Object.defineProperty(globalThis, 'rpc', {
  value: mockRpc,
  writable: true
})

test('RpcFileSystem exists returns true when file exists', async () => {
  mockRpc.invoke.mockResolvedValue(true)
  
  const fs = new RpcFileSystem()
  const result = await fs.exists('/test/path')
  
  expect(result).toBe(true)
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.exists', '/test/path')
})

test('RpcFileSystem exists returns false when file does not exist', async () => {
  mockRpc.invoke.mockResolvedValue(false)
  
  const fs = new RpcFileSystem()
  const result = await fs.exists('/nonexistent/path')
  
  expect(result).toBe(false)
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.exists', '/nonexistent/path')
})

test('RpcFileSystem exists handles errors gracefully', async () => {
  mockRpc.invoke.mockRejectedValue(new Error('RPC error'))
  
  const fs = new RpcFileSystem()
  const result = await fs.exists('/error/path')
  
  expect(result).toBe(false)
})

test('RpcFileSystem mkdir calls RPC', async () => {
  mockRpc.invoke.mockResolvedValue(undefined)
  
  const fs = new RpcFileSystem()
  await fs.mkdir('/test/dir')
  
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.mkdir', '/test/dir')
})

test('RpcFileSystem write calls RPC', async () => {
  mockRpc.invoke.mockResolvedValue(undefined)
  
  const fs = new RpcFileSystem()
  await fs.write('/test/file', 'content')
  
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.write', '/test/file', 'content')
})

test('RpcFileSystem read calls RPC', async () => {
  mockRpc.invoke.mockResolvedValue('file content')
  
  const fs = new RpcFileSystem()
  const result = await fs.read('/test/file')
  
  expect(result).toBe('file content')
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.read', '/test/file')
})

test('RpcFileSystem readdir calls RPC', async () => {
  mockRpc.invoke.mockResolvedValue(['file1.txt', 'file2.txt'])
  
  const fs = new RpcFileSystem()
  const result = await fs.readdir('/test/dir')
  
  expect(result).toEqual(['file1.txt', 'file2.txt'])
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.readdir', '/test/dir')
})

test('RpcFileSystem stat calls RPC', async () => {
  mockRpc.invoke.mockResolvedValue({ isFile: true, isDirectory: false, size: 1024 })
  
  const fs = new RpcFileSystem()
  const result = await fs.stat('/test/file')
  
  expect(result).toEqual({ isFile: true, isDirectory: false, size: 1024 })
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.stat', '/test/file')
})

test('RpcFileSystem unlink calls RPC', async () => {
  mockRpc.invoke.mockResolvedValue(undefined)
  
  const fs = new RpcFileSystem()
  await fs.unlink('/test/file')
  
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.unlink', '/test/file')
})

test('RpcFileSystem rmdir calls RPC', async () => {
  mockRpc.invoke.mockResolvedValue(undefined)
  
  const fs = new RpcFileSystem()
  await fs.rmdir('/test/dir')
  
  expect(mockRpc.invoke).toHaveBeenCalledWith('FileSystem.rmdir', '/test/dir')
})
