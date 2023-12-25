import * as GitAdd from '../src/parts/GitAdd/GitAdd.js'

test('add', () => {
  expect(
    GitAdd.add({
      file: '/test/file.txt',
    }),
  ).toEqual(['add', '/test/file.txt'])
})
