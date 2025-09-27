import type { FileStat, FileSystem } from '../FileSystemInterface/FileSystemInterface.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export class RpcFileSystem implements FileSystem {
  async exists(path: string): Promise<boolean> {
    try {
      return await Rpc.invoke('FileSystem.exists', path)
    } catch {
      return false
    }
  }

  async mkdir(path: string): Promise<void> {
    await Rpc.invoke('FileSystem.mkdir', path)
  }

  async write(path: string, content: string): Promise<void> {
    try {
      await Rpc.invoke('FileSystem.write', path, content)
    } catch (error) {
      throw error
    }
  }

  async read(path: string): Promise<string> {
    try {
      return await Rpc.invoke('FileSystem.read', path)
    } catch (error) {
      throw error
    }
  }

  async readdir(path: string): Promise<string[]> {
    try {
      return await Rpc.invoke('FileSystem.readdir', path)
    } catch {
      return []
    }
  }

  async stat(path: string): Promise<FileStat> {
    try {
      return await Rpc.invoke('FileSystem.stat', path)
    } catch {
      return { isFile: false, isDirectory: false, size: 0 }
    }
  }

  async unlink(path: string): Promise<void> {
    try {
      await Rpc.invoke('FileSystem.unlink', path)
    } catch (error) {
      throw error
    }
  }

  async rmdir(path: string): Promise<void> {
    try {
      await Rpc.invoke('FileSystem.rmdir', path)
    } catch (error) {
      throw error
    }
  }
}

// Default filesystem instance
export const defaultFileSystem = new RpcFileSystem()
