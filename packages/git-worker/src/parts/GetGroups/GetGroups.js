import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'
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

export const getGroups = async (cwd) => {
  const files = await GetChangedFiles.getChangedFiles(cwd)
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
