import * as GitUndoLastCommit from '../src/parts/GitUndoLastCommit/GitUndoLastCommit.js'

test('undoLastCommit', () => {
  expect(GitUndoLastCommit.undoLastCommit()).toEqual(['reset', '--soft', 'HEAD~1'])
})
