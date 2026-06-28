import type { GitStatusFile, GitStatusGroupResult } from '../Types/Types.ts'
import * as FileStateType from '../FileStateType/FileStateType.ts'

const getStatusGroup = <T extends GitStatusFile>(
  status: number,
  groups: Readonly<{
    indexGroup: T[]
    mergeGroup: T[]
    workingTreeGroup: T[]
  }>,
): T[] => {
  switch (status) {
    case FileStateType.AddedByThem:
    case FileStateType.AddedByUs:
    case FileStateType.BothAdded:
    case FileStateType.BothDeleted:
    case FileStateType.BothModified:
    case FileStateType.DeletedByThem:
    case FileStateType.DeletedByUs:
      return groups.mergeGroup
    case FileStateType.Deleted:
    case FileStateType.Ignored:
    case FileStateType.IntentToAdd:
    case FileStateType.Modified:
    case FileStateType.Untracked:
      return groups.workingTreeGroup
    case FileStateType.IndexAdded:
    case FileStateType.IndexCopied:
    case FileStateType.IndexDeleted:
    case FileStateType.IndexModified:
    case FileStateType.IndexRenamed:
      return groups.indexGroup
    default:
      throw new Error(`unexpected file status: ${status}`)
  }
}

export const parseGitStatusGroups = <T extends GitStatusFile>(files: readonly T[]): GitStatusGroupResult<T> => {
  const indexGroup: T[] = []
  const mergeGroup: T[] = []
  const workingTreeGroup: T[] = []
  const untrackedGroup: T[] = []
  for (const file of files) {
    getStatusGroup(file.status, { indexGroup, mergeGroup, workingTreeGroup }).push(file)
  }
  return {
    indexGroup,
    mergeGroup,
    untrackedGroup,
    workingTreeGroup,
  }
}
