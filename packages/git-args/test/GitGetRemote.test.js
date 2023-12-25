import * as GitGetRemote from '../src/parts/GitGetRemote/GitGetRemote.js'

test('getRemote', () => {
  expect(GitGetRemote.getRemote()).toEqual(['config', '--get', 'remote.origin.url'])
})
