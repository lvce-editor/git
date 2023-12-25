import * as GitInit from '../src/parts/GitInit/GitInit.js'

test('init', () => {
  expect(GitInit.init()).toEqual(['init'])
})
