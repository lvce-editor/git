import * as GitTag from '../src/parts/GitTag/GitTag.js'

test('tag', () => {
  expect(
    GitTag.tag({
      tag: 'v1.0.0',
    }),
  ).toEqual(['tag', 'v1.0.0'])
})
