/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const unstageAllFallback = async ({ cwd, gitPath, file, exec }) => {
  const args = ['reset', '.']
  const gitResult = await exec({
    args,
    name: 'unstage',
    cwd,
    gitPath,
  })
  return
}
