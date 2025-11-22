import * as Repositories from '../GitRepositories/GitRepositories.ts'

export const getFileDecorations = async (files: readonly string[]): Promise<readonly any[]> => {
  const repository = await Repositories.getCurrent()
  // TODO
  return []
}
