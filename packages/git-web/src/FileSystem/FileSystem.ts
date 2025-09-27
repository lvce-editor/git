import * as Rpc from '@lvce-editor/rpc'
import { RpcId } from '../RpcId/RpcId.ts'
import type { FileSystem } from '../FileSystemInterface/FileSystemInterface.ts'

export class RpcFileSystem implements FileSystem {
  async exists(path: string): Promise<boolean> {
    try {
      return await Rpc.invoke(RpcId, 'FileSystem.exists', path)
    } catch (error) {
      console.warn(`FileSystem.exists failed for ${path}:`, error)
      return false
    }
  }

  async mkdir(path: string): Promise<void> {
    try {
      await Rpc.invoke(RpcId, 'FileSystem.mkdir', path)
    } catch (error) {
      console.warn(`FileSystem.mkdir failed for ${path}:`, error)
      throw error
    }
  }

  async write(path: string, content: string): Promise<void> {
    try {
      await Rpc.invoke(RpcId, 'FileSystem.write', path, content)
    } catch (error) {
      console.warn(`FileSystem.write failed for ${path}:`, error)
      throw error
    }
  }

  async read(path: string): Promise<string> {
    try {
      return await Rpc.invoke(RpcId, 'FileSystem.read', path)
    } catch (error) {
      console.warn(`FileSystem.read failed for ${path}:`, error)
      throw error
    }
  }

  async readdir(path: string): Promise<string[]> {
    try {
      return await Rpc.invoke(RpcId, 'FileSystem.readdir', path)
    } catch (error) {
      console.warn(`FileSystem.readdir failed for ${path}:`, error)
      return []
    }
  }

  async stat(path: string): Promise<{ readonly isFile: boolean; readonly isDirectory: boolean; readonly size: number }> {
    try {
      return await Rpc.invoke(RpcId, 'FileSystem.stat', path)
    } catch (error) {
      console.warn(`FileSystem.stat failed for ${path}:`, error)
      return { isFile: false, isDirectory: false, size: 0 }
    }
  }

  async unlink(path: string): Promise<void> {
    try {
      await Rpc.invoke(RpcId, 'FileSystem.unlink', path)
    } catch (error) {
      console.warn(`FileSystem.unlink failed for ${path}:`, error)
      throw error
    }
  }

  async rmdir(path: string): Promise<void> {
    try {
      await Rpc.invoke(RpcId, 'FileSystem.rmdir', path)
    } catch (error) {
      console.warn(`FileSystem.rmdir failed for ${path}:`, error)
      throw error
    }
  }
}

// Default filesystem instance
export const defaultFileSystem = new RpcFileSystem()
