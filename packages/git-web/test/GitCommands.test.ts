import { test, expect } from '@jest/globals'
import { executeCommand, registerCommand, unregisterCommand, getRegisteredCommands, isCommandRegistered } from '../src/GitCommands/GitCommands.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'
import { handleVersion } from '../src/VersionCommand/VersionCommand.ts'
import { handleInit } from '../src/InitCommand/InitCommand.ts'
import { handleStatus } from '../src/StatusCommand/StatusCommand.ts'
import { handleAdd } from '../src/AddCommand/AddCommand.ts'
import { handleCommit } from '../src/CommitCommand/CommitCommand.ts'
import { handlePush } from '../src/PushCommand/PushCommand.ts'
import { handlePull } from '../src/PullCommand/PullCommand.ts'
import { handleFetch } from '../src/FetchCommand/FetchCommand.ts'
import { handleCheckout } from '../src/CheckoutCommand/CheckoutCommand.ts'
import { handleBranch } from '../src/BranchCommand/BranchCommand.ts'
import { handleLog } from '../src/LogCommand/LogCommand.ts'
import { handleDiff } from '../src/DiffCommand/DiffCommand.ts'
import { handleRevParse } from '../src/RevParseCommand/RevParseCommand.ts'
import { handleForEachRef } from '../src/ForEachRefCommand/ForEachRefCommand.ts'
import { handleRemote } from '../src/RemoteCommand/RemoteCommand.ts'
import { handleConfig } from '../src/ConfigCommand/ConfigCommand.ts'

// Register all git commands for testing
const registerGitCommands = () => {
  registerCommand('--version', handleVersion)
  registerCommand('init', handleInit)
  registerCommand('status', handleStatus)
  registerCommand('add', handleAdd)
  registerCommand('commit', handleCommit)
  registerCommand('push', handlePush)
  registerCommand('pull', handlePull)
  registerCommand('fetch', handleFetch)
  registerCommand('checkout', handleCheckout)
  registerCommand('branch', handleBranch)
  registerCommand('log', handleLog)
  registerCommand('diff', handleDiff)
  registerCommand('rev-parse', handleRevParse)
  registerCommand('for-each-ref', handleForEachRef)
  registerCommand('remote', handleRemote)
  registerCommand('config', handleConfig)
}

// Register commands before running tests
registerGitCommands()

test('executeCommand with --version', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const result = await executeCommand(['--version'], { cwd: 'web://test' })

  expect(result).toEqual({
    stdout: 'git version 2.34.1 (web-emulated)',
    stderr: '',
    exitCode: 0
  })

  // --version command doesn't make any RPC calls
  expect(mockRpc.invocations).toEqual([])
})

test('executeCommand with init', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
    'FileSystem.mkdir'(path: string) {
      // Mock mkdir calls
    },
    'FileSystem.write'(path: string, content: string) {
      // Mock write calls
    },
  })

  const result = await executeCommand(['init'], { cwd: 'web://test' })

  expect(result.stdout).toContain('Initialized empty Git repository')
  expect(result.exitCode).toBe(0)

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

test('executeCommand with status', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['status'], { cwd: 'web://test' })

  expect(result.stdout).toContain('On branch main')
  expect(result.stdout).toContain('Changes not staged for commit')
  expect(result.stdout).toContain('Untracked files')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with add', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['add', '.'], { cwd: 'web://test' })

  expect(result.stdout).toBe('')
  expect(result.stderr).toBe('')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with commit', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['commit', '-m', 'Test commit'], { cwd: 'web://test' })

  expect(result.stdout).toContain('[main')
  expect(result.stdout).toContain('Test commit')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with push', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['push'], { cwd: 'web://test' })

  expect(result.stdout).toContain('Everything up-to-date')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with pull', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['pull'], { cwd: 'web://test' })

  expect(result.stdout).toContain('Already up to date')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with fetch', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['fetch'], { cwd: 'web://test' })

  expect(result.stdout).toContain('From https://github.com/user/repo')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with checkout', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['checkout', 'main'], { cwd: 'web://test' })

  expect(result.stdout).toContain("Switched to branch 'main'")
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with branch', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['branch'], { cwd: 'web://test' })

  expect(result.stdout).toContain('* main')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with log', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['log'], { cwd: 'web://test' })

  expect(result.stdout).toContain('commit')
  expect(result.stdout).toContain('Author:')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with diff', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['diff'], { cwd: 'web://test' })

  expect(result.stdout).toContain('diff --git')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with rev-parse', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['rev-parse', 'HEAD'], { cwd: 'web://test' })

  expect(result.stdout).toMatch(/^[a-f0-9]{40}$/)
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with for-each-ref', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['for-each-ref'], { cwd: 'web://test' })

  expect(result.stdout).toContain('refs/heads/main')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with remote', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['remote'], { cwd: 'web://test' })

  expect(result.stdout).toContain('origin')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with config', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const result = await executeCommand(['config', '--list'], { cwd: 'web://test' })

  expect(result.stdout).toContain('user.name=User')
  expect(result.exitCode).toBe(0)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with unknown command', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const result = await executeCommand(['unknown-command'], { cwd: 'web://test' })

  expect(result.stderr).toContain('is not a git command')
  expect(result.exitCode).toBe(127)

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/test/.git/config'],
  ])
})

test('executeCommand with empty args', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const result = await executeCommand([], { cwd: 'web://test' })

  expect(result.stderr).toContain('usage: git')
  expect(result.exitCode).toBe(1)

  // Empty args don't make any RPC calls
  expect(mockRpc.invocations).toEqual([])
})

test('executeCommand handles errors gracefully', async () => {
  const mockRpc = registerMockRpc({
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const result = await executeCommand(['status'], { cwd: 'invalid-path' })
  expect(result.exitCode).toBe(0) // Should still work with virtual repo

  expect(mockRpc.invocations).toEqual([
    ['FileSystem.exists', 'web:/invalid-path/.git/config'],
  ])
})

// Registry tests
test('registerCommand adds command to registry', () => {
  const handler = async () => ({ stdout: 'test', stderr: '', exitCode: 0 })

  registerCommand('test-command', handler)

  expect(isCommandRegistered('test-command')).toBe(true)
  expect(getRegisteredCommands()).toContain('test-command')
})

test('unregisterCommand removes command from registry', () => {
  const handler = async () => ({ stdout: 'test', stderr: '', exitCode: 0 })

  registerCommand('test-command', handler)
  expect(isCommandRegistered('test-command')).toBe(true)

  unregisterCommand('test-command')
  expect(isCommandRegistered('test-command')).toBe(false)
  expect(getRegisteredCommands()).not.toContain('test-command')
})

test('executeCommand with registered custom command', async () => {
  const handler = async () => ({ stdout: 'custom output', stderr: '', exitCode: 0 })

  registerCommand('custom-command', handler)

  const result = await executeCommand(['custom-command'], { cwd: 'web://test' })

  expect(result.stdout).toBe('custom output')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with unregistered command returns error', async () => {
  const result = await executeCommand(['unregistered-command'], { cwd: 'web://test' })

  expect(result.stderr).toContain('is not a git command')
  expect(result.exitCode).toBe(127)
})

test('getRegisteredCommands returns all registered commands', () => {
  const handler = async () => ({ stdout: 'test', stderr: '', exitCode: 0 })

  registerCommand('command1', handler)
  registerCommand('command2', handler)

  const commands = getRegisteredCommands()

  expect(commands).toContain('command1')
  expect(commands).toContain('command2')
  expect(commands.length).toBeGreaterThanOrEqual(2)
})

test('isCommandRegistered returns correct status', () => {
  const handler = async () => ({ stdout: 'test', stderr: '', exitCode: 0 })

  expect(isCommandRegistered('nonexistent')).toBe(false)

  registerCommand('existent', handler)
  expect(isCommandRegistered('existent')).toBe(true)
})
