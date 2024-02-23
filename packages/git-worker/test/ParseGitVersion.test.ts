import * as ParseGitVersion from '../src/parts/ParseGitVersion/ParseGitVersion.ts'

test('parseGitVersion', () => {
  const raw = 'git version 2.39.2'
  expect(ParseGitVersion.parseGitVersion(raw)).toBe('2.39.2')
})
