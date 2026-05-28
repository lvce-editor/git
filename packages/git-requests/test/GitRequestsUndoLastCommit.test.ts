import type { GitExec, GitExecOptions, GitExecResult } from '../src/parts/Types/Types.ts'
import * as GitRequestsUndoLastCommit from '../src/parts/GitRequestsUndoLastCommit/GitRequestsUndoLastCommit.js'

class ExecError extends Error {
  stderr: string

  constructor(stderr: string) {
    super('')
    this.stderr = stderr
  }
}

test('undoLastCommit - uses soft reset by default', async (): Promise<void> => {
  const calls: GitExecOptions[] = []
  const exec: GitExec = async (args): Promise<GitExecResult> => {
    calls.push(args)
    return { stderr: '', stdout: '' }
  }

  await GitRequestsUndoLastCommit.undoLastCommit({
    cwd: '/test/test-folder',
    exec,
    gitPath: '',
  })

  expect(calls).toHaveLength(1)
  expect(calls[0]).toEqual({
    args: ['reset', '--soft', 'HEAD~1'],
    cwd: '/test/test-folder',
    gitPath: '',
    name: 'undoLastCommit/default',
  })
})

test('undoLastCommit - falls back for initial commit', async (): Promise<void> => {
  const calls: GitExecOptions[] = []
  const exec: GitExec = async (args): Promise<GitExecResult> => {
    calls.push(args)
    if (args.name === 'undoLastCommit/default') {
      throw new Error(`fatal: ambiguous argument 'HEAD~1': unknown revision or path not in the working tree.`)
    }
    return { stderr: '', stdout: '' }
  }

  await GitRequestsUndoLastCommit.undoLastCommit({
    cwd: '/test/test-folder',
    exec,
    gitPath: '',
  })

  expect(calls[0]).toEqual({
    args: ['reset', '--soft', 'HEAD~1'],
    cwd: '/test/test-folder',
    gitPath: '',
    name: 'undoLastCommit/default',
  })
  expect(calls[1]).toEqual({
    args: ['update-ref', '-d', 'HEAD'],
    cwd: '/test/test-folder',
    gitPath: '',
    name: 'undoLastCommit/fallback',
  })
  expect(calls[2]).toEqual({
    args: ['restore', '--staged', '.'],
    cwd: '/test/test-folder',
    gitPath: '',
    name: 'unstageAll',
  })
})

test('undoLastCommit - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }

  await expect(
    GitRequestsUndoLastCommit.undoLastCommit({
      cwd: '',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
