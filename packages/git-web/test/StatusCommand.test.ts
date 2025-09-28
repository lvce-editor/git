import { test, expect } from '@jest/globals'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'
import { handleStatus } from '../src/StatusCommand/StatusCommand.ts'

test('handleStatus returns status for new repository', async () => {
  const mockRpc = registerMockRpc({
    'Exec.exec'(command: string, args: string[], options: any) {
      if (command === 'git' && args[0] === 'status') {
        return {
          stdout: 'On branch main\nnothing to commit, working tree clean',
          stderr: '',
          exitCode: 0,
        }
      }
      throw new Error(`unexpected command ${command} ${args.join(' ')}`)
    },
  })

  const result = await handleStatus([], { cwd: 'web://test-status' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['Exec.exec', 'git', ['status'], { cwd: 'web://test-status' }],
  ])
})

test('handleStatus works with different cwd', async () => {
  const mockRpc = registerMockRpc({
    'Exec.exec'(command: string, args: string[], options: any) {
      if (command === 'git' && args[0] === 'status') {
        return {
          stdout: 'On branch main\nnothing to commit, working tree clean',
          stderr: '',
          exitCode: 0,
        }
      }
      throw new Error(`unexpected command ${command} ${args.join(' ')}`)
    },
  })

  const result = await handleStatus([], { cwd: 'web://different-repo' })

  expect(result.stdout).toContain('On branch main')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['Exec.exec', 'git', ['status'], { cwd: 'web://different-repo' }],
  ])
})

test('handleStatus works with args', async () => {
  const mockRpc = registerMockRpc({
    'Exec.exec'(command: string, args: string[], options: any) {
      if (command === 'git' && args[0] === 'status' && args.includes('--porcelain')) {
        return {
          stdout: '',
          stderr: '',
          exitCode: 0,
        }
      }
      throw new Error(`unexpected command ${command} ${args.join(' ')}`)
    },
  })

  const result = await handleStatus(['--porcelain'], { cwd: 'web://test-status-args' })

  expect(result.stdout).toBe('')
  expect(result.exitCode).toBe(0)
  expect(mockRpc.invocations).toEqual([
    ['Exec.exec', 'git', ['status', '--porcelain'], { cwd: 'web://test-status-args' }],
  ])
})

test('handleStatus with --porcelain returns porcelain format', async () => {
  const mockRpc = registerMockRpc({
    'Exec.exec'(command: string, args: string[], options: any) {
      if (command === 'git' && args[0] === 'status' && args.includes('--porcelain')) {
        return {
          stdout: ' M packages/e2e/src/git.show-changed-files-in-side-bar.ts\n M packages/extension/src/parts/GetChangedFiles/GetChangedFiles.js',
          stderr: '',
          exitCode: 0,
        }
      }
      throw new Error(`unexpected command ${command} ${args.join(' ')}`)
    },
  })

  const result = await handleStatus(['--porcelain'], { cwd: 'web://test-porcelain' })

  expect(result.exitCode).toBe(0)
  // The output should contain porcelain format lines (status + filename)
  // Format: "XY filename" where X is index status, Y is working tree status
  expect(result.stdout).toMatch(/^[ AMDRC?][AMDRC?] .+$/m)
})

test('handleStatus with --porcelain and -uall returns porcelain format with untracked files', async () => {
  const mockRpc = registerMockRpc({
    'Exec.exec'(command: string, args: string[], options: any) {
      if (command === 'git' && args[0] === 'status' && args.includes('--porcelain') && args.includes('-uall')) {
        return {
          stdout: ' M packages/e2e/src/git.show-changed-files-in-side-bar.ts\n M packages/extension/src/parts/GetChangedFiles/GetChangedFiles.js\n?? packages/git-requests/src/parts/GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js\n?? packages/git-web/src/StatusCommand/StatusCommand.ts',
          stderr: '',
          exitCode: 0,
        }
      }
      throw new Error(`unexpected command ${command} ${args.join(' ')}`)
    },
  })

  const result = await handleStatus(['--porcelain', '-uall'], { cwd: 'web://test-porcelain-uall' })

  expect(result.exitCode).toBe(0)
  // Should include porcelain format lines (status + filename)
  // Format: "XY filename" where X is index status, Y is working tree status
  expect(result.stdout).toMatch(/^[ AMDRC?][AMDRC?] .+$/m)
})
