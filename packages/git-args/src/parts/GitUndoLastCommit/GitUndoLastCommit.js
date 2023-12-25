export const undoLastCommit = () => {
  return ['reset', '--soft', 'HEAD~1']
}
