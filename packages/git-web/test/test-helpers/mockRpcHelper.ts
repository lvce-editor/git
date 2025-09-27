import { test, expect } from '@jest/globals'
import * as Rpc from '@lvce-editor/rpc'
import { RpcId } from '../../src/RpcId/RpcId.js'

export interface MockRpcInvocation {
  rpcId: number
  method: string
  params: any[]
}

export class MockRpc {
  public invocations: MockRpcInvocation[] = []
  private commandMap: Record<string, (...args: any[]) => any> = {}

  constructor(commandMap: Record<string, (...args: any[]) => any> = {}) {
    this.commandMap = commandMap
  }

  async invoke(rpcId: number, method: string, ...params: any[]): Promise<any> {
    this.invocations.push({ rpcId, method, params })

    if (this.commandMap[method]) {
      return this.commandMap[method](...params)
    }

    throw new Error(`No mock implementation for method: ${method}`)
  }

  reset(): void {
    this.invocations = []
  }

  getInvocationsForMethod(method: string): MockRpcInvocation[] {
    return this.invocations.filter(inv => inv.method === method)
  }

  getInvocationsForRpcId(rpcId: number): MockRpcInvocation[] {
    return this.invocations.filter(inv => inv.rpcId === rpcId)
  }
}

export const createMockRpc = (commandMap: Record<string, (...args: any[]) => any> = {}): MockRpc => {
  return new MockRpc(commandMap)
}

export const setupRpcMock = (mockRpc: MockRpc): void => {
  // Mock the Rpc.invoke function
  jest.spyOn(Rpc, 'invoke').mockImplementation(mockRpc.invoke.bind(mockRpc))
}

export const teardownRpcMock = (): void => {
  jest.restoreAllMocks()
}

// Helper function to create filesystem command map
export const createFileSystemCommandMap = () => ({
  'FileSystem.exists': jest.fn().mockResolvedValue(false),
  'FileSystem.mkdir': jest.fn().mockResolvedValue(undefined),
  'FileSystem.write': jest.fn().mockResolvedValue(undefined),
  'FileSystem.read': jest.fn().mockResolvedValue(''),
  'FileSystem.readdir': jest.fn().mockResolvedValue([]),
  'FileSystem.stat': jest.fn().mockResolvedValue({ isFile: false, isDirectory: false, size: 0 }),
  'FileSystem.unlink': jest.fn().mockResolvedValue(undefined),
  'FileSystem.rmdir': jest.fn().mockResolvedValue(undefined),
})
