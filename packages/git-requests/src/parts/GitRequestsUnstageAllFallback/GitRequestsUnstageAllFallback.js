/**
 *
 * @param {{cwd:string,gitPath:string ,  exec:any  }} options
 */
export const unstageAllFallback = async ({ cwd, gitPath, exec }) => {
  const args = ['reset', '.']
  const gitResult = await exec({
    args,
    name: 'unstage',
    cwd,
    gitPath,
  })
  return
}
