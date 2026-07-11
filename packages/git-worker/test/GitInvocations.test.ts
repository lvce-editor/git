import { beforeEach, expect, test } from '@jest/globals'
import * as GitInvocations from '../src/parts/GitInvocations/GitInvocations.ts'

beforeEach(() => {
  GitInvocations.reset()
})

test('records git invocations', () => {
  GitInvocations.add('file:///workspace', ['commit', '-m', 'message'])

  expect(GitInvocations.get()).toEqual([
    {
      command: ['git', 'commit', '-m', 'message'],
      cwd: 'file:///workspace',
    },
  ])
})

test('normalizes absolute command paths and ignores config commands', () => {
  GitInvocations.add('file:///workspace', ['config', 'user.name', 'Test User'])
  GitInvocations.add('file:///workspace', ['worktree', 'add', '/tmp/worktree'])

  expect(GitInvocations.get()).toEqual([
    {
      command: ['git', 'worktree', 'add', 'file:///tmp/worktree'],
      cwd: 'file:///workspace',
    },
  ])
})
