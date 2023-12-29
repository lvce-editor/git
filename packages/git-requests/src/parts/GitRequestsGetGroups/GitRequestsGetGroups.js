import * as GitRequestsGetChangedFiles from '../GitRequestsGetChangedFiles/GitRequestsGetChangedFiles.js'
import * as GroupId from '../GroupId/GroupId.js'
import * as ParseGitStatusGroups from '../ParseGitStatusGroups/ParseGitStatusGroups.js'
import * as Strings from '../Strings/Strings.js'

export const getGroups = async ({ exec, getRepository }) => {
  const files = await GitRequestsGetChangedFiles.getChangedFiles({ getRepository, exec })
  const groupItems = ParseGitStatusGroups.parseGitStatusGroups(files)
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
