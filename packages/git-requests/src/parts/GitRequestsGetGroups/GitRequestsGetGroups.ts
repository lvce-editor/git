import * as GitRequestsGetChangedFiles from '../GitRequestsGetChangedFiles/GitRequestsGetChangedFiles.ts'
import * as GroupId from '../GroupId/GroupId.ts'
import * as ParseGitStatusGroups from '../ParseGitStatusGroups/ParseGitStatusGroups.ts'
import * as Strings from '../Strings/Strings.ts'
import type { GetRepository, GitDecoration, GitExec } from '../Types/Types.ts'

export const getGroups = async ({
  exec,
  getRepository,
}: {
  readonly exec: GitExec
  readonly getRepository: GetRepository
}): Promise<
  readonly {
    readonly id: string
    readonly label: string
  readonly items: readonly GitDecoration[]
  }[]
> => {
  const files = await GitRequestsGetChangedFiles.getChangedFiles({ getRepository, exec })
  const groupItems = ParseGitStatusGroups.parseGitStatusGroups<GitDecoration>(files)
  return [
    {
      id: GroupId.Merge,
      label: Strings.MergeChanges,
      items: groupItems.mergeGroup,
    },
    {
      id: GroupId.Index,
      label: Strings.StagedChanges,
      items: groupItems.indexGroup,
    },
    {
      id: GroupId.WorkingTree,
      label: Strings.Changes,
      items: groupItems.workingTreeGroup,
    },
    {
      id: GroupId.Untracked,
      label: Strings.UntrackedChanges,
      items: groupItems.untrackedGroup,
    },
  ]
}
