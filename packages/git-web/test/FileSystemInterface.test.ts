import { test, expect } from '@jest/globals'
import type { FileSystem, FileStat } from '../src/FileSystemInterface/FileSystemInterface.ts'

// Mock implementation for testing the interface
class MockFileSystem implements FileSystem {
  private files = new Map<string, string>()
  private directories = new Set<string>()

  async exists(path: string): Promise<boolean> {
    return this.files.has(path) || this.directories.has(path)
  }

  async mkdir(path: string): Promise<void> {
    this.directories.add(path)
  }

  async write(path: string, content: string): Promise<void> {
    this.files.set(path, content)
  }

  async read(path: string): Promise<string> {
    const content = this.files.get(path)
    if (content === undefined) {
      throw new Error(`File not found: ${path}`)
    }
    return content
  }

  async readdir(path: string): Promise<string[]> {
    const files: string[] = []
    for (const filePath of this.files.keys()) {
      if (filePath.startsWith(path + '/')) {
        const relativePath = filePath.substring(path.length + 1)
        if (!relativePath.includes('/')) {
          files.push(relativePath)
        }
      }
    }
    return files
  }

  async stat(path: string): Promise<FileStat> {
    if (this.files.has(path)) {
      return {
        isFile: true,
        isDirectory: false,
        size: this.files.get(path)!.length
      }
    }
    if (this.directories.has(path)) {
      return {
        isFile: false,
        isDirectory: true,
        size: 0
      }
    }
    throw new Error(`Path not found: ${path}`)
  }

  async unlink(path: string): Promise<void> {
    if (!this.files.has(path)) {
      throw new Error(`File not found: ${path}`)
    }
    this.files.delete(path)
  }

  async rmdir(path: string): Promise<void> {
    if (!this.directories.has(path)) {
      throw new Error(`Directory not found: ${path}`)
    }
    this.directories.delete(path)
  }
}

test('FileSystem interface can be implemented', () => {
  const fs: FileSystem = new MockFileSystem()
  expect(fs).toBeDefined()
})

test('MockFileSystem exists works correctly', async () => {
  const fs = new MockFileSystem()

  expect(await fs.exists('/nonexistent')).toBe(false)

  await fs.write('/test/file.txt', 'content')
  expect(await fs.exists('/test/file.txt')).toBe(true)

  await fs.mkdir('/test/dir')
  expect(await fs.exists('/test/dir')).toBe(true)
})

test('MockFileSystem write and read work correctly', async () => {
  const fs = new MockFileSystem()

  await fs.write('/test/file.txt', 'hello world')
  const content = await fs.read('/test/file.txt')

  expect(content).toBe('hello world')
})

test('MockFileSystem mkdir works correctly', async () => {
  const fs = new MockFileSystem()

  await fs.mkdir('/test/dir')
  expect(await fs.exists('/test/dir')).toBe(true)
})

test('MockFileSystem readdir works correctly', async () => {
  const fs = new MockFileSystem()

  await fs.write('/test/file1.txt', 'content1')
  await fs.write('/test/file2.txt', 'content2')
  await fs.write('/test/subdir/file3.txt', 'content3')

  const files = await fs.readdir('/test')
  expect(files).toContain('file1.txt')
  expect(files).toContain('file2.txt')
  expect(files).not.toContain('file3.txt')
})

test('MockFileSystem stat works correctly', async () => {
  const fs = new MockFileSystem()

  await fs.write('/test/file.txt', 'content')
  await fs.mkdir('/test/dir')

  const fileStat = await fs.stat('/test/file.txt')
  expect(fileStat.isFile).toBe(true)
  expect(fileStat.isDirectory).toBe(false)
  expect(fileStat.size).toBe(7)

  const dirStat = await fs.stat('/test/dir')
  expect(dirStat.isFile).toBe(false)
  expect(dirStat.isDirectory).toBe(true)
  expect(dirStat.size).toBe(0)
})

test('MockFileSystem unlink works correctly', async () => {
  const fs = new MockFileSystem()

  await fs.write('/test/file.txt', 'content')
  expect(await fs.exists('/test/file.txt')).toBe(true)

  await fs.unlink('/test/file.txt')
  expect(await fs.exists('/test/file.txt')).toBe(false)
})

test('MockFileSystem rmdir works correctly', async () => {
  const fs = new MockFileSystem()

  await fs.mkdir('/test/dir')
  expect(await fs.exists('/test/dir')).toBe(true)

  await fs.rmdir('/test/dir')
  expect(await fs.exists('/test/dir')).toBe(false)
})

test('MockFileSystem throws errors for missing files', async () => {
  const fs = new MockFileSystem()

  await expect(fs.read('/nonexistent.txt')).rejects.toThrow('File not found')
  await expect(fs.unlink('/nonexistent.txt')).rejects.toThrow('File not found')
  await expect(fs.rmdir('/nonexistent')).rejects.toThrow('Directory not found')
  await expect(fs.stat('/nonexistent')).rejects.toThrow('Path not found')
})
