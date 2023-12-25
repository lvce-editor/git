export const discard = ({ file }) => {
  return ['clean', '-f', '-q', file]
}
