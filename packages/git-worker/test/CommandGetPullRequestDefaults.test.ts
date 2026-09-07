/// <reference types="node" />
/* eslint-disable jest/no-restricted-jest-methods */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const exec = promisify(execFile)
const state = { directory: '' }
const run = async (...args: readonly string[]): Promise<string> => {
  const result = await exec('git', args, { cwd: state.directory })
  return result.stdout.trim()
}
jest.unstable_mockModule('../src/parts/GitRepositories/GitRepositories.ts', () => ({
  getCurrent: async (): Promise<{ gitPath: string; path: string }> => ({ gitPath: 'git', path: state.directory }),
}))
jest.unstable_mockModule('../src/parts/Git/Git.ts', () => ({
  exec: async ({
    args,
    cwd,
    throwError = true,
  }: Readonly<{ args: readonly string[]; cwd: string; throwError?: boolean }>): Promise<{ stdout: string; exitCode: number }> => {
    try {
      const value = await exec('git', args, { cwd })
      return { ...value, exitCode: 0 }
    } catch (error) {
      if (throwError) throw error
      return { exitCode: 1, stdout: '' }
    }
  },
}))
const { commandGetPullRequestDefaults } = await import('../src/parts/CommandGetPullRequestDefaults/CommandGetPullRequestDefaults.ts')
beforeEach(async () => {
  state.directory = await mkdtemp(join(tmpdir(), 'lvce-pr-defaults-'))
  await run('init', '--initial-branch=feature/pr')
  await run('config', 'user.name', 'Test User')
  await run('config', 'user.email', 'test@example.invalid')
  await run('commit', '--allow-empty', '-m', 'feature: latest title', '-m', 'Commit body')
  await run('remote', 'add', 'origin', 'git@github.com:owner/repo.git')
})
afterEach(async () => {
  await rm(state.directory, { force: true, recursive: true })
})
test('reads current branch, commit subject, push remote, and default branch', async () => {
  await run('symbolic-ref', 'refs/remotes/origin/HEAD', 'refs/remotes/origin/develop')
  expect(await commandGetPullRequestDefaults()).toEqual({
    baseBranch: 'develop',
    headBranch: 'feature/pr',
    remoteUrl: 'git@github.com:owner/repo.git',
    title: 'feature: latest title',
  })
})
test('leaves unknown default branch for authenticated GitHub lookup', async () => {
  const result = await commandGetPullRequestDefaults()
  expect(result.baseBranch).toBe('')
})
test('uses branch tracking remote and push URL', async () => {
  await run('remote', 'add', 'fork', 'https://github.com/upstream/repo.git')
  await run('remote', 'set-url', '--push', 'fork', 'https://github.com/me/repo.git')
  await run('config', 'branch.feature/pr.remote', 'fork')
  const result = await commandGetPullRequestDefaults()
  expect(result.remoteUrl).toBe('https://github.com/me/repo.git')
})
test('supports a linked worktree', async () => {
  const parent = state.directory
  const worktree = join(parent, 'linked')
  await run('worktree', 'add', '-b', 'linked-branch', worktree)
  state.directory = worktree
  try {
    const result = await commandGetPullRequestDefaults()
    expect(result.headBranch).toBe('linked-branch')
  } finally {
    state.directory = parent
  }
})
test('rejects detached HEAD', async () => {
  await run('checkout', '--detach')
  await expect(commandGetPullRequestDefaults()).rejects.toThrow('Check out a branch')
})
test('rejects missing remote', async () => {
  await run('remote', 'remove', 'origin')
  await expect(commandGetPullRequestDefaults()).rejects.toThrow()
})
test('rejects repositories with no commits', async () => {
  await run('checkout', '--orphan', 'empty')
  await expect(commandGetPullRequestDefaults()).rejects.toThrow()
})
