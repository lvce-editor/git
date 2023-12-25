import * as GitPullAndRebase from '../src/parts/GitPullAndRebase/GitPullAndRebase.js'

test('pullAndRebase', () => {
  expect(GitPullAndRebase.pullAndRebase()).toEqual(['pull', '--rebase'])
})
