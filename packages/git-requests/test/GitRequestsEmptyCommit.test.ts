/// <reference types="node" />
import { afterEach, beforeEach, expect, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import type { GitExecOptions, GitExecResult } from '../src/parts/Types/Types.ts'
import { addAllAndCommit } from '../src/parts/GitRequestsAddAllAndCommit/GitRequestsAddAllAndCommit.ts'
import { isClean } from '../src/parts/GitRequestsIsClean/GitRequestsIsClean.ts'

const execFileAsync = promisify(execFile)
const state = { cwd: '' }
const run = async (...args: readonly string[]): Promise<string> => {
  const result = await execFileAsync('git', args, { cwd: state.cwd })
  return result.stdout.trim()
}
const exec = async (options: GitExecOptions): Promise<GitExecResult> => {
  try {
    return await execFileAsync(options.gitPath, options.args, { cwd: options.cwd })
  } catch (error) {
    if (options.throwError === false) {
      return { stderr: '', stdout: '' }
    }
    throw error
  }
}
beforeEach(async () => {
  state.cwd = await mkdtemp(join(tmpdir(), 'lvce-empty-commit-'))
  await run('init', '--initial-branch=feature/test')
  await run('config', 'user.name', 'Test User')
  await run('config', 'user.email', 'test@example.invalid')
  await writeFile(join(state.cwd, 'file.txt'), 'initial')
  await run('add', '.')
  await run('commit', '-m', 'Initial commit')
})
afterEach(async () => {
  await rm(state.cwd, { force: true, recursive: true })
})
test('explicit empty commit adds exactly one commit with the same tree and intended message', async () => {
  expect(await isClean({ cwd: state.cwd, exec, gitPath: 'git' })).toBe(true)
  const tree = await run('rev-parse', 'HEAD^{tree}')
  await addAllAndCommit({ allowEmpty: true, cwd: state.cwd, exec, gitPath: 'git', message: 'Empty commit', push: false })
  expect(await run('rev-list', '--count', 'HEAD')).toBe('2')
  expect(await run('rev-parse', 'HEAD^{tree}')).toBe(tree)
  expect(await run('log', '-1', '--format=%s')).toBe('Empty commit')
})
test('empty commit leaves newly staged changes out of the commit and in the index', async () => {
  const tree = await run('rev-parse', 'HEAD^{tree}')
  await writeFile(join(state.cwd, 'file.txt'), 'staged while prompt was open')
  await run('add', '.')
  expect(await isClean({ cwd: state.cwd, exec, gitPath: 'git' })).toBe(false)
  await addAllAndCommit({ allowEmpty: true, cwd: state.cwd, exec, gitPath: 'git', message: 'Empty commit', push: false })
  expect(await run('rev-parse', 'HEAD^{tree}')).toBe(tree)
  expect(await run('diff', '--cached', '--name-only')).toBe('file.txt')
})
test('ordinary unstaged commits still include changes', async () => {
  await writeFile(join(state.cwd, 'file.txt'), 'changed')
  expect(await isClean({ cwd: state.cwd, exec, gitPath: 'git' })).toBe(false)
  await addAllAndCommit({ cwd: state.cwd, exec, gitPath: 'git', message: 'Changed file', push: false })
  expect(await run('show', 'HEAD:file.txt')).toBe('changed')
})
test('ordinary staged commits leave unrelated unstaged changes out', async () => {
  await writeFile(join(state.cwd, 'staged.txt'), 'staged')
  await run('add', 'staged.txt')
  await writeFile(join(state.cwd, 'file.txt'), 'unstaged')
  await addAllAndCommit({ cwd: state.cwd, exec, gitPath: 'git', message: 'Staged file', push: false })
  expect(await run('show', 'HEAD:file.txt')).toBe('initial')
  expect(await run('show', 'HEAD:staged.txt')).toBe('staged')
})
test('status errors propagate instead of reporting a clean repository', async () => {
  await rm(join(state.cwd, '.git'), { force: true, recursive: true })
  await expect(isClean({ cwd: state.cwd, exec, gitPath: 'git' })).rejects.toThrow()
})

test('an empty repository can create its first empty commit', async () => {
  await rm(join(state.cwd, '.git'), { force: true, recursive: true })
  await rm(join(state.cwd, 'file.txt'))
  await run('init', '--initial-branch=feature/test')
  await run('config', 'user.name', 'Test User')
  await run('config', 'user.email', 'test@example.invalid')
  expect(await isClean({ cwd: state.cwd, exec, gitPath: 'git' })).toBe(true)
  await addAllAndCommit({ allowEmpty: true, cwd: state.cwd, exec, gitPath: 'git', message: 'Initial empty commit', push: false })
  expect(await run('rev-list', '--count', 'HEAD')).toBe('1')
  expect(await run('ls-tree', 'HEAD')).toBe('')
})
