export const getFileBefore = ({ uri }) => {
  return ['show', `HEAD:${uri}`]
}
