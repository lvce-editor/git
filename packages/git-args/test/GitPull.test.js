import * as GitPull from '../src/parts/GitPull/GitPull.js'

test('pull', () => {
  expect(GitPull.pull()).toEqual(['pull'])
})
