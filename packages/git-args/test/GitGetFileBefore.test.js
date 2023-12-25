import * as GitGetFileBefore from '../src/parts/GitGetFileBefore/GitGetFileBefore.js'

test('getFileBefore', () => {
  expect(
    GitGetFileBefore.getFileBefore({
      uri: '/test/file.txt',
    }),
  ).toEqual(['show', 'HEAD:/test/file.txt'])
})
