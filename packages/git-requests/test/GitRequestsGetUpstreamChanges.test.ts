import { expect, jest, test } from '@jest/globals'
import type { GitExec } from '../src/parts/Types/Types.ts'
import * as GitRequestsGetUpstreamChanges from '../src/parts/GitRequestsGetUpstreamChanges/GitRequestsGetUpstreamChanges.ts'

test('getUpstreamChanges', async (): Promise<void> => {
  const exec = jest.fn<GitExec>(async ({ args }) => {
    if (args[0] === 'rev-list') {
      return {
        stderr: '',
        stdout: '2\t3\n',
      }
    }
    return {
      stderr: '',
      stdout: 'origin/main\n',
    }
  })

  await expect(
    GitRequestsGetUpstreamChanges.getUpstreamChanges({
      cwd: '/test/workspace',
      exec,
      gitPath: '/test/git',
    }),
  ).resolves.toEqual({
    incoming: 3,
    outgoing: 2,
    upstream: 'origin/main',
  })
  expect(exec).toHaveBeenNthCalledWith(1, {
    args: ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}'],
    cwd: '/test/workspace',
    gitPath: '/test/git',
    name: 'getUpstreamChanges',
  })
  expect(exec).toHaveBeenNthCalledWith(2, {
    args: ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}'],
    cwd: '/test/workspace',
    gitPath: '/test/git',
    name: 'getUpstreamChanges',
  })
})

test('getUpstreamChanges - error', async (): Promise<void> => {
  const exec = jest.fn<GitExec>(async () => {
    throw new Error('No upstream configured')
  })

  await expect(
    GitRequestsGetUpstreamChanges.getUpstreamChanges({
      cwd: '/test/workspace',
      exec,
      gitPath: '/test/git',
    }),
  ).rejects.toThrow('Git: No upstream configured')
})
