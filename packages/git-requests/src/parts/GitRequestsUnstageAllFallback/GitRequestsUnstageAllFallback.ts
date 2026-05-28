/**
 *
 * @param {{cwd:string,gitPath:string ,  exec:any  }} options
 */
export const unstageAllFallback = async ({ cwd, exec, gitPath }) => {
  const args = ['reset', '.']
  const gitResult = await exec({
    args,
    cwd,
    gitPath,
    name: 'unstageAll',
  })
  return
}
