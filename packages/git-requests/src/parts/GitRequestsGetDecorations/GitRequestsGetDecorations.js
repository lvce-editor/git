import { GitError } from '../GitError/GitError.js'

const joinByNull = (strings) => {
  return strings.join('\0')
}
/**
 *
 * @param {{cwd:string,gitPath:string , file:string, exec:any, uris:any  }} options
 */
export const getDecorations = async ({ cwd, gitPath, uris, exec }) => {
  try {
    const paths = uris.map((uri) => uri.slice('file://'.length))
    const input = joinByNull(paths)
    const gitResult = await exec({
      args: ['check-ignore', '-v', '-z', '--stdin'],
      name: 'decorations',
      cwd,
      gitPath,
      input,
    })
    return gitResult
  } catch (error) {
    throw new GitError(error, 'decorations')
  }
}
