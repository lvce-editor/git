import * as GitGetAddedFiles from '../src/parts/GitGetAddedFiles/GitGetAddedFiles.js'

test('getAddedFiles', () => {
  expect(GitGetAddedFiles.getAddedFiles()).toEqual(['diff', '--name-only', '--cached'])
})
