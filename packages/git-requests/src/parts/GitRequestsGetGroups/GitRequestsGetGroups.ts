import type { GetRepository, GitDecoration, GitExec } from '../Types/Types.ts'
import * as GitRequestsGetChangedFiles from '../GitRequestsGetChangedFiles/GitRequestsGetChangedFiles.ts'
import * as GroupId from '../GroupId/GroupId.ts'
import * as ParseGitStatusGroups from '../ParseGitStatusGroups/ParseGitStatusGroups.ts'
import * as Strings from '../Strings/Strings.ts'

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
  const files = await GitRequestsGetChangedFiles.getChangedFiles({ exec, getRepository })
  const groupItems = ParseGitStatusGroups.parseGitStatusGroups<GitDecoration>(files)
  return [
    {
      id: GroupId.Merge,
      items: groupItems.mergeGroup,
      label: Strings.MergeChanges,
    },
    {
      id: GroupId.Index,
      items: groupItems.indexGroup,
      label: Strings.StagedChanges,
    },
    {
      id: GroupId.WorkingTree,
      items: groupItems.workingTreeGroup,
      label: Strings.Changes,
    },
    {
      id: GroupId.Untracked,
      items: groupItems.untrackedGroup,
      label: Strings.UntrackedChanges,
    },
  ]
}
