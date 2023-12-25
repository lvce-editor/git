import * as GitDeleteBranch from '../src/parts/GitDeleteBranch/GitDeleteBranch.js'

test('deleteBranch', () => {
  expect(GitDeleteBranch.deleteBranch()).toEqual(['branch', '-d'])
})
