import * as GitRequestsGetChangedFiles from '../GitRequestsGetChangedFiles/GitRequestsGetChangedFiles.js'
import * as ParseGitStatusGroups from '../ParseGitStatusGroups/ParseGitStatusGroups.js'

const GroupId = {
  Merge: 'merge',
  Index: 'index',
  WorkingTree: 'working-tree',
  Untracked: 'untracked',
}

const UiStrings = {
  MergeChanges: 'Merge Changes',
  StagedChanges: 'Staged Changes',
  Changes: 'Changes',
  UntrackedChanges: 'Untracked Changes',
}

export const getGroups = async ({ exec, getRepository }) => {
  const files = await GitRequestsGetChangedFiles.getChangedFiles({ getRepository, exec })
  const groupItems = ParseGitStatusGroups.parseGitStatusGroups(files)
  return [
    {
      id: GroupId.Merge,
      label: UiStrings.MergeChanges,
      items: groupItems.mergeGroup,
    },
    {
      id: GroupId.Index,
      label: UiStrings.StagedChanges,
      items: groupItems.indexGroup,
    },
    {
      id: GroupId.WorkingTree,
      label: UiStrings.Changes,
      items: groupItems.workingTreeGroup,
    },
    {
      id: GroupId.Untracked,
      label: UiStrings.UntrackedChanges,
      items: groupItems.untrackedGroup,
    },
  ]
}
