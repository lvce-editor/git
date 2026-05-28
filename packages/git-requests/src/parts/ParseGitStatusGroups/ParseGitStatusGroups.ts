import type { GitStatusFile, GitStatusGroupResult } from '../Types/Types.ts'
import * as FileStateType from '../FileStateType/FileStateType.ts'

export const parseGitStatusGroups = <T extends GitStatusFile>(files: readonly T[]): GitStatusGroupResult<T> => {
  const indexGroup: T[] = []
  const mergeGroup: T[] = []
  const workingTreeGroup: T[] = []
  const untrackedGroup: T[] = []
  for (const file of files) {
    const { status } = file
    switch (status) {
      case FileStateType.AddedByThem:
      case FileStateType.AddedByUs:
      case FileStateType.BothAdded:
      case FileStateType.BothDeleted:
      case FileStateType.BothModified:
      case FileStateType.DeletedByThem:
      case FileStateType.DeletedByUs:
        mergeGroup.push(file)
        break
      case FileStateType.Deleted:
      case FileStateType.Ignored:
      case FileStateType.IntentToAdd:
      case FileStateType.Modified:
      case FileStateType.Untracked:
        workingTreeGroup.push(file)
        break
      case FileStateType.IndexAdded:
      case FileStateType.IndexCopied:
      case FileStateType.IndexDeleted:
      case FileStateType.IndexModified:
      case FileStateType.IndexRenamed:
        indexGroup.push(file)
        break
      default:
        throw new Error(`unexpected file status: ${status}`)
    }
  }
  return {
    indexGroup,
    mergeGroup,
    untrackedGroup,
    workingTreeGroup,
  }
}
