/* eslint-disable jest/no-restricted-jest-methods */
import { beforeEach, expect, jest, test } from '@jest/globals'
import type * as Rpc from '../src/parts/Rpc/Rpc.ts'

const invoke = jest.fn<typeof Rpc.invoke>()
jest.unstable_mockModule('../src/parts/Rpc/Rpc.ts', () => ({ invoke }))

const { exec } = await import('../src/parts/Exec/Exec.ts')
const Git = await import('../src/parts/Git/Git.ts')
const GitRequests = await import('../src/parts/GitRequests/GitRequests.ts')
const GitStates = await import('../src/parts/GitStates/GitStates.ts')
const { getCurrent } = await import('../src/parts/GitRepositories/GitRepositories.ts')
const { getFileDecorations } = await import('../src/parts/CommandGetFileDecorations/GetFileDecorations.ts')
const { wrappedGitRequests } = await import('../src/parts/WrappedGitRequests/WrappedGitRequests.ts')

const workspaceUri = 'remote-ssh://me@host:2222/home/me/project%20%25'
const remoteWorkspaceUri = 'file:///home/me/project%20%25'

beforeEach(() => {
  GitStates.reset()
  invoke.mockReset()
  invoke.mockImplementation(async (method, ...params) => {
    if (method === 'Config.getWorkspaceFolder') {
      return workspaceUri
    }
    if (method === 'Config.getGitPaths') {
      return ['git']
    }
    if (method === 'Exec.exec') {
      const args = params[1]
      const stdout = args[0] === '--version' ? 'git version 2.39.2' : ''
      return { exitCode: 0, stderr: '', stdout }
    }
    throw new Error(`Unexpected RPC: ${method}`)
  })
})

test('repository state retains both workspace URIs and discovers Git using the remote file URI', async () => {
  const repository = await getCurrent()
  expect(repository).toEqual({ gitPath: 'git', gitVersion: '2.39.2', path: workspaceUri, remoteWorkspaceUri, workspaceUri })
  expect(GitStates.get(workspaceUri)).toMatchObject({ remoteWorkspaceUri, workspaceUri })
  expect(invoke).toHaveBeenCalledWith('Exec.exec', 'git', ['--version'], { cwd: remoteWorkspaceUri })
})

test('activation and Git execution normalize cwd without rewriting arbitrary arguments or stdin', async () => {
  const args = ['commit', '-m', workspaceUri]
  const options = { cwd: workspaceUri, input: workspaceUri, reject: false }
  await exec('git', args, options)
  expect(invoke).toHaveBeenLastCalledWith('Exec.exec', 'git', args, { ...options, cwd: remoteWorkspaceUri })
  expect(options.cwd).toBe(workspaceUri)
})

test('stage and diff convert full remote document URIs to repository-relative paths', async () => {
  const file = `${workspaceUri}/nested/a%20%23%25.txt`
  await GitRequests.stage({ cwd: workspaceUri, exec: Git.exec, file, gitPath: 'git' })
  expect(invoke).toHaveBeenLastCalledWith('Exec.exec', 'git', ['add', 'nested/a #%.txt'], expect.objectContaining({ cwd: remoteWorkspaceUri }))
  await GitRequests.getFileBefore({ exec: Git.exec, gitPath: 'git', repositoryPath: workspaceUri, uri: file })
  expect(invoke).toHaveBeenLastCalledWith('Exec.exec', 'git', ['show', 'HEAD:nested/a #%.txt'], expect.objectContaining({ cwd: remoteWorkspaceUri }))
})

test('worktree destinations use decoded remote filesystem paths', async () => {
  await GitRequests.createWorktree({
    cwd: workspaceUri,
    exec: Git.exec,
    gitPath: 'git',
    ref: 'topic',
    worktreePath: 'remote-ssh://me@host:2222/home/me/new%20%25',
  })
  expect(invoke).toHaveBeenLastCalledWith(
    'Exec.exec',
    'git',
    ['worktree', 'add', '/home/me/new %', 'topic'],
    expect.objectContaining({ cwd: remoteWorkspaceUri }),
  )
})

test('ignore decorations round trip to the original remote authority and encoded resource URI', async () => {
  const uri = `${workspaceUri}/ignored%20%23%25.txt`
  await getCurrent()
  // getCurrent reads the workspace before the decoration request.
  invoke.mockReset()
  invoke.mockImplementation(async (method) => {
    if (method === 'Config.getWorkspaceFolder') {
      return workspaceUri
    }
    return { exitCode: 0, stderr: '', stdout: '.gitignore\u{0}1\u{0}ignored*\u{0}/home/me/project %/ignored #%.txt\u{0}' }
  })
  await expect(getFileDecorations([uri])).resolves.toEqual([{ decoration: 'ignore', uri }])
  expect(invoke).toHaveBeenLastCalledWith(
    'Exec.exec',
    'git',
    ['check-ignore', '-v', '-z', '--stdin'],
    expect.objectContaining({ cwd: remoteWorkspaceUri, input: '/home/me/project %/ignored #%.txt' }),
  )
})

test('rejects file and cwd inputs from another SSH host before execution', async () => {
  expect(() => GitRequests.stage({ cwd: workspaceUri, exec: Git.exec, file: 'remote-ssh://other/home/me/file', gitPath: 'git' })).toThrow(
    'different remote workspace host',
  )
  await getCurrent()
  invoke.mockClear()
  await expect(wrappedGitRequests.getGroups({ cwd: 'remote-ssh://other/home/me/project' })).rejects.toThrow('different remote workspace host')
  expect(invoke).not.toHaveBeenCalledWith('Exec.exec', expect.anything(), expect.anything(), expect.anything())
})

test('a commit message and a Git remote URL retain their contents', async () => {
  await wrappedGitRequests.addRemote({ name: 'origin', url: workspaceUri })
  expect(invoke).toHaveBeenLastCalledWith(
    'Exec.exec',
    'git',
    ['remote', 'add', 'origin', workspaceUri],
    expect.objectContaining({ cwd: remoteWorkspaceUri }),
  )
})
