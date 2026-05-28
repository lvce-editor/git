/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any  }} options
 */
export const unstageFallback = async ({ cwd, exec, file, gitPath }) => {
  const args = ['reset', '--', file]
  const gitResult = await exec({
    args,
    cwd,
    gitPath,
    name: 'unstage',
  })
  return
}
