import { beforeEach, expect, jest, test } from '@jest/globals'
import { runCommit, type CommitOptions } from '../src/parts/RunCommit/RunCommit.ts'

const executeCommand = jest.fn<(...args: any[]) => Promise<unknown>>()
const getPreference = jest.fn<(key: string) => Promise<unknown>>()
const showQuickInput = jest.fn<(...args: any[]) => Promise<string | undefined>>()
const invoke = jest.fn<(...args: any[]) => Promise<any>>()
const refresh = jest.fn<() => Promise<void>>()
const setSpinning = jest.fn<(value: boolean) => Promise<void>>()
const refreshCheckout = jest.fn<() => Promise<void>>()

const commit = (message: string | undefined, options: CommitOptions = {}): Promise<void> =>
  runCommit(message, options, {
    executeCommand,
    getPreference,
    getWorkspaceFolder: async () => '/repo',
    invoke,
    refresh,
    refreshCheckout,
    setSpinning,
    showQuickInput,
  })

beforeEach(() => {
  jest.resetAllMocks()
  invoke.mockImplementation(async (command) => (command === 'Git.getCurrentBranch' ? 'main\n' : undefined))
  executeCommand.mockResolvedValue(0)
})

test('protection defaults on and committing anyway commits to main', async () => {
  await commit('message')
  expect(executeCommand).toHaveBeenCalledWith('Dialog.showMessageBox', {
    buttons: ['Commit Anyway', 'Cancel', 'Commit to a New Branch'],
    defaultId: 2,
    message: 'You are trying to commit to a protected branch. How would you like to proceed?',
    type: 'warning',
  })
  expect(invoke).toHaveBeenLastCalledWith('Git.commit', { cwd: '/repo', message: 'message' })
})

test.each([1, undefined, -1])('cancel or dismiss (%s) never commits or syncs', async (choice) => {
  executeCommand.mockResolvedValue(choice)
  await commit('message', { postCommitCommand: 'sync' })
  expect(invoke.mock.calls.map(([command]) => command)).toEqual(['Git.getCurrentBranch'])
  expect(setSpinning).not.toHaveBeenCalled()
})

test('disabled protection does not query the branch or show a dialog', async () => {
  getPreference.mockImplementation(async (key) => (key === 'git.branchProtection' ? false : undefined))
  await commit('message')
  expect(executeCommand).not.toHaveBeenCalled()
  expect(invoke.mock.calls).toEqual([['Git.commit', { cwd: '/repo', message: 'message' }]])
})

test.each(['feature/test', '', 'main-feature'])('unprotected branch %s does not prompt', async (branch) => {
  invoke.mockResolvedValue(branch)
  await commit('message')
  expect(executeCommand).not.toHaveBeenCalled()
  expect(invoke).toHaveBeenLastCalledWith('Git.commit', { cwd: '/repo', message: 'message' })
})

test.each(['push', 'sync'])('creates and checks out a branch before committing and publishing for %s', async (postCommitCommand) => {
  executeCommand.mockResolvedValue(2)
  showQuickInput.mockResolvedValue('feature/test')
  await commit('message', { postCommitCommand })
  expect(showQuickInput).toHaveBeenCalledWith({
    placeholder: "Please provide a new branch name (Press 'Enter' to confirm or 'Escape' to cancel)",
    value: 'feature/',
  })
  expect(invoke.mock.calls.slice(2)).toEqual([
    ['Git.checkout', { create: true, cwd: '/repo', ref: 'feature/test' }],
    ['Git.commit', { cwd: '/repo', message: 'message' }],
    ['Git.push', { cwd: '/repo', setUpstream: ['origin', 'feature/test'] }],
  ])
})

test('canceling branch input never creates a branch, commits, or pushes', async () => {
  executeCommand.mockResolvedValue(2)
  await commit('message', { postCommitCommand: 'push' })
  expect(invoke.mock.calls.map(([command]) => command)).toEqual(['Git.getCurrentBranch'])
})

test.each(['Git.checkout', 'Git.commit'])('failure in %s prevents later mutations', async (failure) => {
  executeCommand.mockResolvedValue(2)
  showQuickInput.mockResolvedValue('feature/test')
  invoke.mockImplementation(async (command) => {
    if (command === failure) {
      throw new Error('failed')
    }
    return command === 'Git.getCurrentBranch' ? 'main' : undefined
  })
  await expect(commit('message', { postCommitCommand: 'sync' })).rejects.toThrow('failed')
  expect(invoke.mock.calls.at(-1)?.[0]).toBe(failure)
  expect(setSpinning).toHaveBeenLastCalledWith(false)
})

test('aborts if the branch changed while the dialog was open', async () => {
  invoke.mockResolvedValueOnce('main').mockResolvedValueOnce('feature/other')
  await expect(commit('message')).rejects.toThrow('current branch changed')
  expect(invoke.mock.calls.map(([command]) => command)).toEqual(['Git.getCurrentBranch', 'Git.getCurrentBranch'])
})

test('accept input stages changes and preserves its automatic push', async () => {
  getPreference.mockResolvedValue(false)
  await commit('message', { all: true })
  expect(invoke.mock.calls).toEqual([['Git.addAllAndCommit', { cwd: '/repo', message: 'message', newBranch: undefined, push: true }]])
})

test('syncs existing branches after committing', async () => {
  await commit('message', { postCommitCommand: 'sync' })
  expect(invoke.mock.calls.slice(-2)).toEqual([
    ['Git.commit', { cwd: '/repo', message: 'message' }],
    ['Git.sync', { cwd: '/repo' }],
  ])
})

test('command palette prompts for a missing commit message', async () => {
  invoke.mockResolvedValue('feature/test')
  showQuickInput.mockResolvedValue('Second commit')
  await commit(undefined)
  expect(showQuickInput).toHaveBeenCalledWith({ placeholder: 'Commit message', value: '' })
  expect(invoke).toHaveBeenLastCalledWith('Git.commit', { cwd: '/repo', message: 'Second commit' })
})

test.each([undefined, '', ' '.repeat(3)])('cancelled or blank message (%s) never commits or syncs', async (input) => {
  showQuickInput.mockResolvedValue(input)
  await commit(undefined, { postCommitCommand: 'sync' })
  expect(invoke).not.toHaveBeenCalled()
  expect(setSpinning).not.toHaveBeenCalled()
})
