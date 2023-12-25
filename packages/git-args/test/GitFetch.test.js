import * as GitFetch from '../src/parts/GitFetch/GitFetch.js'

test('gitFetch', () => {
  expect(GitFetch.fetch()).toEqual(['fetch', '--all'])
})
