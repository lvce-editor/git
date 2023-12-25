import * as GitCommit from '../src/parts/GitCommit/GitCommit.js'

test('commit', () => {
  expect(
    GitCommit.commit({
      message: 'test',
    }),
  ).toEqual(['commit', '-m', 'test'])
})
