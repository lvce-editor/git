import * as GitStates from '../src/parts/GitStates/GitStates.ts'

beforeEach(() => {
  GitStates.reset()
})

test('setGitState preserves existing repositories', () => {
  GitStates.set('app-1', {
    gitPath: 'git',
    gitRepositories: [{ groups: [], uri: '/workspace' }],
    parsedGitVersion: '2.39.2',
    rawGitVersion: 'git version 2.39.2',
  })

  const previousState = GitStates.get('app-1')
  const nextState = GitStates.setGitState('app-1', {
    gitPath: '/usr/bin/git',
    parsedGitVersion: '2.40.0',
    rawGitVersion: 'git version 2.40.0',
  })

  expect(nextState.gitRepositories).toEqual([{ groups: [], uri: '/workspace' }])
  expect(nextState).not.toBe(previousState)
  expect(previousState?.gitPath).toBe('git')
})

test('setRepositoryGroups updates repository immutably', () => {
  GitStates.set('app-1', {
    gitPath: 'git',
    gitRepositories: [{ groups: [], uri: '/workspace' }],
    parsedGitVersion: '2.39.2',
    rawGitVersion: 'git version 2.39.2',
  })

  const previousState = GitStates.get('app-1')
  const previousRepository = previousState?.gitRepositories[0]
  const groups = [{ id: 'index', items: [{ file: 'a.txt' }], label: 'Staged Changes' }]
  const nextState = GitStates.setRepositoryGroups('app-1', '/workspace', groups)

  expect(nextState?.gitRepositories[0]).toEqual({
    groups,
    uri: '/workspace',
  })
  expect(nextState).not.toBe(previousState)
  expect(nextState?.gitRepositories[0]).not.toBe(previousRepository)
  expect(previousRepository).toEqual({ groups: [], uri: '/workspace' })
})
