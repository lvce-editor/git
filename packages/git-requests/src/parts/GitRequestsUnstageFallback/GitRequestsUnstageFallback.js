/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const unstageFallback = async ({ cwd, gitPath, file, exec }) => {
  const args = ['reset', '--', file]
  const gitResult = await exec({
    args,
    name: 'unstage',
    cwd,
    gitPath,
  })
  return
}
