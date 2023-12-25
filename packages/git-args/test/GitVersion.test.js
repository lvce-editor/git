import * as GitVersion from '../src/parts/GitVersion/GitVersion.js'

test('version', () => {
  expect(GitVersion.version()).toEqual(['--version'])
})
