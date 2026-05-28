import type { GitErrorLike, GitExec } from '../Types/Types.ts'

export const getFileBefore = async ({
  uri,
  repositoryPath,
  gitPath,
  exec,
}: {
  readonly uri: string
  readonly repositoryPath: string
  readonly gitPath: string
  readonly exec: GitExec
}): Promise<string> => {
  try {
    const gitResult = await exec({
      args: ['show', `HEAD:${uri}`],
      cwd: repositoryPath,
      gitPath,
      name: 'getFileBefore',
    })
    return gitResult.stdout
  } catch (error) {
    if ((error as GitErrorLike | undefined)?.stderr === `fatal: invalid object name 'HEAD'.`) {
      return ''
    }
    console.error(error)
    return ''
  }
}
