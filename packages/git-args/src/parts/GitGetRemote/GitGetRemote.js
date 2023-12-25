export const getRemote = () => {
  return ['config', '--get', 'remote.origin.url']
}
