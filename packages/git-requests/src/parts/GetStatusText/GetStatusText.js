import * as FileTypeState from '../FileStateType/FileStateType.js'
import * as Strings from '../Strings/Strings.js'

/**
 *
 * @param {number} type
 * @returns
 */
export const getStatusText = (type) => {
  switch (type) {
    case FileTypeState.Modified:
      return Strings.Modified
    case FileTypeState.IndexModified:
      return Strings.IndexModified
    case FileTypeState.IndexAdded:
      return Strings.IndexAdded
    case FileTypeState.Deleted:
      return Strings.Deleted
    case FileTypeState.IndexRenamed:
      return Strings.IndexRenamed
    case FileTypeState.IndexCopied:
      return Strings.IndexCopied
    case FileTypeState.Untracked:
      return Strings.Untracked
    case FileTypeState.Ignored:
      return Strings.Ignored
    case FileTypeState.IntentToAdd:
      return Strings.IntentToAdd
    case FileTypeState.BothDeleted:
      return Strings.BothDeleted
    case FileTypeState.AddedByUs:
      return Strings.AddedByUs
    case FileTypeState.DeletedByThem:
      return Strings.DeletedByThem
    case FileTypeState.AddedByThem:
      return Strings.AddedByThem
    case FileTypeState.DeletedByUs:
      return Strings.DeletedByUs
    case FileTypeState.BothAdded:
      return Strings.BothAdded
    case FileTypeState.BothModified:
      return Strings.BothModified
    default:
      return Strings.Unknown
  }
}
