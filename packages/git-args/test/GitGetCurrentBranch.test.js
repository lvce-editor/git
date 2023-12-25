import * as GitGetCurrentBranch from '../src/parts/GitGetCurrentBranch/GitGetCurrentBranch.js'

test('getCurrentBranch', () => {
  expect(GitGetCurrentBranch.getCurrentBranch()).toEqual(['branch', '--show-current'])
})
