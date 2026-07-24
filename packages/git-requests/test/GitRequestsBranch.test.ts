import { expect, test } from '@jest/globals'
import type { GitExec, GitExecOptions } from '../src/parts/Types/Types.ts'
import * as GitRequestsBranch from '../src/parts/GitRequestsBranch/GitRequestsBranch.js'

test('branch', async (): Promise<void> => {
  const calls: GitExecOptions[] = []
  const exec: GitExec = async (options) => {
    calls.push(options)
    return {
      stderr: '',
      stdout: '',
    }
  }

  await GitRequestsBranch.branch({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
    name: 'feature/test',
  })

  expect(calls).toEqual([
    {
      args: ['branch', 'feature/test'],
      cwd: '/test/test-folder',
      gitPath: 'git',
      name: 'branch',
    },
  ])
})

test('branch rejects a missing name without invoking git', async (): Promise<void> => {
  let wasCalled = false
  const exec: GitExec = () => {
    wasCalled = true
    return {
      stderr: '',
      stdout: '',
    }
  }

  await expect(
    GitRequestsBranch.branch({
      cwd: '/test/test-folder',
      exec,
      gitPath: 'git',
      name: undefined as unknown as string,
    }),
  ).rejects.toThrow(new TypeError('branch name must be a string'))
  expect(wasCalled).toBe(false)
})
