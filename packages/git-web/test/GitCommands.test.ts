import { test, expect } from '@jest/globals'
import { executeCommand, registerCommand, unregisterCommand, getRegisteredCommands, isCommandRegistered } from '../src/GitCommands/GitCommands.js'

test('executeCommand with --version', async () => {
  const result = await executeCommand(['--version'], { cwd: 'web://test' })
  
  expect(result).toEqual({
    stdout: 'git version 2.34.1 (web-emulated)',
    stderr: '',
    exitCode: 0
  })
})

test('executeCommand with init', async () => {
  const result = await executeCommand(['init'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('Initialized empty Git repository')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with status', async () => {
  const result = await executeCommand(['status'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with add', async () => {
  const result = await executeCommand(['add', '.'], { cwd: 'web://test' })
  
  expect(result.stdout).toBe('')
  expect(result.stderr).toBe('')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with commit', async () => {
  const result = await executeCommand(['commit', '-m', 'Test commit'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('[main')
  expect(result.stdout).toContain('Test commit')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with push', async () => {
  const result = await executeCommand(['push'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('Everything up-to-date')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with pull', async () => {
  const result = await executeCommand(['pull'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('Already up to date')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with fetch', async () => {
  const result = await executeCommand(['fetch'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('From https://github.com/user/repo')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with checkout', async () => {
  const result = await executeCommand(['checkout', 'main'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain("Switched to branch 'main'")
  expect(result.exitCode).toBe(0)
})

test('executeCommand with branch', async () => {
  const result = await executeCommand(['branch'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('* main')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with log', async () => {
  const result = await executeCommand(['log'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('commit')
  expect(result.stdout).toContain('Author:')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with diff', async () => {
  const result = await executeCommand(['diff'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('diff --git')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with rev-parse', async () => {
  const result = await executeCommand(['rev-parse', 'HEAD'], { cwd: 'web://test' })
  
  expect(result.stdout).toMatch(/^[a-f0-9]{40}$/)
  expect(result.exitCode).toBe(0)
})

test('executeCommand with for-each-ref', async () => {
  const result = await executeCommand(['for-each-ref'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('refs/heads/main')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with remote', async () => {
  const result = await executeCommand(['remote'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('origin')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with config', async () => {
  const result = await executeCommand(['config', '--list'], { cwd: 'web://test' })
  
  expect(result.stdout).toContain('user.name=User')
  expect(result.exitCode).toBe(0)
})

test('executeCommand with unknown command', async () => {
  const result = await executeCommand(['unknown-command'], { cwd: 'web://test' })
  
  expect(result.stderr).toContain('is not a git command')
  expect(result.exitCode).toBe(127)
})

test('executeCommand with empty args', async () => {
  const result = await executeCommand([], { cwd: 'web://test' })
  
  expect(result.stderr).toContain('usage: git')
  expect(result.exitCode).toBe(1)
})

test('executeCommand handles errors gracefully', async () => {
  // Mock a command that throws an error
  const originalConsoleError = console.error
  console.error = jest.fn()
  
  try {
    const result = await executeCommand(['status'], { cwd: 'invalid-path' })
    expect(result.exitCode).toBe(0) // Should still work with virtual repo
  } finally {
    console.error = originalConsoleError
  }
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
