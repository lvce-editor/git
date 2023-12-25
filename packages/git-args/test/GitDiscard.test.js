import * as GitDiscard from '../src/parts/GitDiscard/GitDiscard.js'

test('discard', () => {
  expect(
    GitDiscard.discard({
      file: '/test/file.txt',
    }),
  ).toEqual(['clean', '-f', '-q', '/test/file.txt'])
})
