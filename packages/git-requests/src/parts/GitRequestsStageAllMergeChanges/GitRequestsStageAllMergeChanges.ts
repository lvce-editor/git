import type { GitRequestContext } from '../Types/Types.ts'
import { GitError } from '../GitError/GitError.ts'
import { getModifiedFiles } from '../GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.ts'
import * as ParseGitStatusGroups from '../ParseGitStatusGroups/ParseGitStatusGroups.ts'

export const stageAllMergeChanges = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  const { index } = await getModifiedFiles({ cwd, exec, gitPath })
  const { mergeGroup } = ParseGitStatusGroups.parseGitStatusGroups(index)
  const files = mergeGroup.map(({ file }) => file)
  if (files.length === 0) {
    return
  }
  try {
    await exec({
      args: ['add', '--', ...files],
      cwd,
      gitPath,
      name: 'stageAllMergeChanges',
    })
  } catch (error) {
    throw new GitError(error, 'stageAllMergeChanges')
  }
}
