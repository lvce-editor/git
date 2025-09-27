import { test, expect } from '@jest/globals'
import type { FileSystem, FileStat } from '../src/FileSystemInterface/FileSystemInterface.ts'
import { RpcFileSystem } from '../src/FileSystem/FileSystem.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'

test('RpcFileSystem exists returns true when file exists', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return true
    },
  })

  const fs = new RpcFileSystem()
  const result = await fs.exists('/test/path')

  expect(result).toBe(true)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', '/test/path']])
})

test('RpcFileSystem exists returns false when file does not exist', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false
    },
  })

  const fs = new RpcFileSystem()
  const result = await fs.exists('/nonexistent/path')

  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', '/nonexistent/path']])
})

test('RpcFileSystem exists handles errors gracefully', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      throw new Error('RPC error')
    },
  })

  const fs = new RpcFileSystem()
  const result = await fs.exists('/error/path')

  expect(result).toBe(false)
  expect(mockRpc.invocations).toEqual([['FileSystem.exists', '/error/path']])
})

test('RpcFileSystem mkdir calls RPC', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.mkdir'(path: string) {
      // Mock implementation
    },
  })

  const fs = new RpcFileSystem()
  await fs.mkdir('/test/dir')

  expect(mockRpc.invocations).toEqual([['FileSystem.mkdir', '/test/dir']])
})

test('RpcFileSystem write calls RPC', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.write'(path: string, content: string) {
      // Mock implementation
    },
  })

  const fs = new RpcFileSystem()
  await fs.write('/test/file', 'content')

  expect(mockRpc.invocations).toEqual([['FileSystem.write', '/test/file', 'content']])
})

test('RpcFileSystem read calls RPC', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.read'(path: string) {
      return 'file content'
    },
  })

  const fs = new RpcFileSystem()
  const result = await fs.read('/test/file')

  expect(result).toBe('file content')
  expect(mockRpc.invocations).toEqual([['FileSystem.read', '/test/file']])
})

test('RpcFileSystem readdir calls RPC', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.readdir'(path: string) {
      return ['file1.txt', 'file2.txt']
    },
  })

  const fs = new RpcFileSystem()
  const result = await fs.readdir('/test/dir')

  expect(result).toEqual(['file1.txt', 'file2.txt'])
  expect(mockRpc.invocations).toEqual([['FileSystem.readdir', '/test/dir']])
})

test('RpcFileSystem stat calls RPC', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.stat'(path: string) {
      return { isFile: true, isDirectory: false, size: 1024 } as FileStat
    },
  })

  const fs = new RpcFileSystem()
  const result = await fs.stat('/test/file')

  expect(result).toEqual({ isFile: true, isDirectory: false, size: 1024 })
  expect(mockRpc.invocations).toEqual([['FileSystem.stat', '/test/file']])
})

test('RpcFileSystem unlink calls RPC', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.unlink'(path: string) {
      // Mock implementation
    },
  })

  const fs = new RpcFileSystem()
  await fs.unlink('/test/file')

  expect(mockRpc.invocations).toEqual([['FileSystem.unlink', '/test/file']])
})

test('RpcFileSystem rmdir calls RPC', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.rmdir'(path: string) {
      // Mock implementation
    },
  })

  const fs = new RpcFileSystem()
  await fs.rmdir('/test/dir')

  expect(mockRpc.invocations).toEqual([['FileSystem.rmdir', '/test/dir']])
})
