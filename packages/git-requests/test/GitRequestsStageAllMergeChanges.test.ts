import { jest } from '@jest/globals'
import type { GitExec } from '../src/parts/Types/Types.js'
import * as GitRequestsStageAllMergeChanges from '../src/parts/GitRequestsStageAllMergeChanges/GitRequestsStageAllMergeChanges.js'

test('stageAllMergeChanges stages only merge files with safe path arguments', async (): Promise<void> => {
  const exec = jest.fn<GitExec>(async ({ name }) => {
    if (name === 'getModifiedFiles') {
      return {
        stderr: '',
        stdout: `UU -danger.txt\nDU path with spaces.txt\n M unrelated.txt\nM  staged.txt\n?? untracked.txt`,
      }
    }
    return { stderr: '', stdout: '' }
  })

  await GitRequestsStageAllMergeChanges.stageAllMergeChanges({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
  })

  expect(exec).toHaveBeenNthCalledWith(1, {
    args: ['status', '--porcelain', '-uall'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'getModifiedFiles',
  })
  expect(exec).toHaveBeenNthCalledWith(2, {
    args: ['add', '--', '-danger.txt', 'path with spaces.txt'],
    cwd: '/test/test-folder',
    gitPath: 'git',
    name: 'stageAllMergeChanges',
  })
})

test('stageAllMergeChanges does not run git add when the merge group is empty', async (): Promise<void> => {
  const exec = jest.fn<GitExec>(async () => ({ stderr: '', stdout: ' M unrelated.txt\nM  staged.txt' }))

  await GitRequestsStageAllMergeChanges.stageAllMergeChanges({
    cwd: '/test/test-folder',
    exec,
    gitPath: 'git',
  })

  expect(exec).toHaveBeenCalledTimes(1)
})

test('stageAllMergeChanges reports staging errors', async (): Promise<void> => {
  const exec = jest.fn<GitExec>(async ({ name }) => {
    if (name === 'getModifiedFiles') {
      return { stderr: '', stdout: 'UU conflict.txt' }
    }
    throw Object.assign(new Error('pathspec failed'), { stderr: 'pathspec failed' })
  })

  await expect(
    GitRequestsStageAllMergeChanges.stageAllMergeChanges({
      cwd: '/test/test-folder',
      exec,
      gitPath: 'git',
    }),
  ).rejects.toThrow('Git: pathspec failed')
})
