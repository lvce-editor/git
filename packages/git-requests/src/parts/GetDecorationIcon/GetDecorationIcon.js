import * as IconType from '../IconType/IconType.js'
import * as FileTypeState from '../FileStateType/FileStateType.js'

/**
 *
 * @param {number} type
 * @returns
 */
export const getDecorationIcon = (type) => {
  switch (type) {
    case FileTypeState.IndexModified:
    case FileTypeState.Modified:
      return IconType.Modified
    case FileTypeState.IndexAdded:
    case FileTypeState.IntentToAdd:
      return IconType.Added
    case FileTypeState.Deleted:
    case FileTypeState.IndexDeleted:
      return IconType.Deleted
    case FileTypeState.IndexRenamed:
      return IconType.Renamed
    case FileTypeState.IndexCopied:
      return IconType.Copied
    case FileTypeState.Untracked:
      return IconType.Untracked
    case FileTypeState.Ignored:
      return IconType.Ignored
    case FileTypeState.BothDeleted:
    case FileTypeState.AddedByUs:
    case FileTypeState.DeletedByThem:
    case FileTypeState.AddedByThem:
    case FileTypeState.DeletedByUs:
    case FileTypeState.BothAdded:
    case FileTypeState.BothModified:
      return IconType.Conflict
    default:
      throw new Error(`unknown git status: ${type}`)
  }
}
