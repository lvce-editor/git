export const getArgs = ({ file }) => {
  return {
    args: ['clean', '-f', '-q', file],
    name: 'discard',
  }
}
