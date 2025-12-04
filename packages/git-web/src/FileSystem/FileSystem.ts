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
    await Rpc.invoke('FileSystem.write', path, content)
  }

  async read(path: string): Promise<string> {
    return Rpc.invoke('FileSystem.read', path)
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
      return { isDirectory: false, isFile: false, size: 0 }
    }
  }

  async unlink(path: string): Promise<void> {
    await Rpc.invoke('FileSystem.unlink', path)
  }

  async rmdir(path: string): Promise<void> {
    await Rpc.invoke('FileSystem.rmdir', path)
  }
}

// Default filesystem instance
export const defaultFileSystem = new RpcFileSystem()
