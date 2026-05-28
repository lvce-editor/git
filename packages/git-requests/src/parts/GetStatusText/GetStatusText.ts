import type { GitStatusFile } from '../Types/Types.ts'
import * as FileTypeState from '../FileStateType/FileStateType.ts'
import * as Strings from '../Strings/Strings.ts'

export const getStatusText = (type: GitStatusFile['status']): string => {
  switch (type) {
    case FileTypeState.AddedByThem:
      return Strings.AddedByThem
    case FileTypeState.AddedByUs:
      return Strings.AddedByUs
    case FileTypeState.BothAdded:
      return Strings.BothAdded
    case FileTypeState.BothDeleted:
      return Strings.BothDeleted
    case FileTypeState.BothModified:
      return Strings.BothModified
    case FileTypeState.Deleted:
      return Strings.Deleted
    case FileTypeState.DeletedByThem:
      return Strings.DeletedByThem
    case FileTypeState.DeletedByUs:
      return Strings.DeletedByUs
    case FileTypeState.Ignored:
      return Strings.Ignored
    case FileTypeState.IndexAdded:
      return Strings.IndexAdded
    case FileTypeState.IndexCopied:
      return Strings.IndexCopied
    case FileTypeState.IndexModified:
      return Strings.IndexModified
    case FileTypeState.IndexRenamed:
      return Strings.IndexRenamed
    case FileTypeState.IntentToAdd:
      return Strings.IntentToAdd
    case FileTypeState.Modified:
      return Strings.Modified
    case FileTypeState.Untracked:
      return Strings.Untracked
    default:
      return Strings.Unknown
  }
}
