import * as FileTypeState from '../FileStateType/FileStateType.js'

/**
 * @enum {string}
 */
const UiStrings = {
  Modified: 'Modified',
  IndexModified: 'Index Modified',
  IndexAdded: 'Index Added',
  IndexDeleted: 'Index Deleted',
  Deleted: 'Deleted',
  IndexRenamed: 'Index Renamed',
  IndexCopied: 'Index Copied',
  Untracked: 'Untracked',
  Ignored: 'Ignored',
  IntentToAdd: 'Intent to Add',
  BothDeleted: 'Conflict: Both Deleted',
  AddedByUs: 'Conflict: Added by Us',
  DeletedByThem: 'Conflict: Deleted by them',
  AddedByThem: 'Conflict: Added by them',
  DeletedByUs: 'Conflict: Deleted by Us',
  BothAdded: 'Conflict: Both Added',
  BothModified: 'Conflict: Both Modified',
  Unknown: '',
}

/**
 *
 * @param {number} type
 * @returns
 */
export const getStatusText = (type) => {
  switch (type) {
    case FileTypeState.Modified:
      return UiStrings.Modified
    case FileTypeState.IndexModified:
      return UiStrings.IndexModified
    case FileTypeState.IndexAdded:
      return UiStrings.IndexAdded
    case FileTypeState.Deleted:
      return UiStrings.Deleted
    case FileTypeState.IndexRenamed:
      return UiStrings.IndexRenamed
    case FileTypeState.IndexCopied:
      return UiStrings.IndexCopied
    case FileTypeState.Untracked:
      return UiStrings.Untracked
    case FileTypeState.Ignored:
      return UiStrings.Ignored
    case FileTypeState.IntentToAdd:
      return UiStrings.IntentToAdd
    case FileTypeState.BothDeleted:
      return UiStrings.BothDeleted
    case FileTypeState.AddedByUs:
      return UiStrings.AddedByUs
    case FileTypeState.DeletedByThem:
      return UiStrings.DeletedByThem
    case FileTypeState.AddedByThem:
      return UiStrings.AddedByThem
    case FileTypeState.DeletedByUs:
      return UiStrings.DeletedByUs
    case FileTypeState.BothAdded:
      return UiStrings.BothAdded
    case FileTypeState.BothModified:
      return UiStrings.BothModified
    default:
      return UiStrings.Unknown
  }
}
