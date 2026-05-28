import type { GitStatusFile } from '../Types/Types.ts'
import * as FileTypeState from '../FileStateType/FileStateType.ts'
import * as IconType from '../IconType/IconType.ts'

export const getDecorationIcon = (type: GitStatusFile['status']): number => {
  switch (type) {
    case FileTypeState.AddedByThem:
    case FileTypeState.AddedByUs:
    case FileTypeState.BothAdded:
    case FileTypeState.BothDeleted:
    case FileTypeState.BothModified:
    case FileTypeState.DeletedByThem:
    case FileTypeState.DeletedByUs:
      return IconType.Conflict
    case FileTypeState.Deleted:
    case FileTypeState.IndexDeleted:
      return IconType.Deleted
    case FileTypeState.Ignored:
      return IconType.Ignored
    case FileTypeState.IndexAdded:
    case FileTypeState.IntentToAdd:
      return IconType.Added
    case FileTypeState.IndexCopied:
      return IconType.Copied
    case FileTypeState.IndexModified:
    case FileTypeState.Modified:
      return IconType.Modified
    case FileTypeState.IndexRenamed:
      return IconType.Renamed
    case FileTypeState.Untracked:
      return IconType.Untracked
    default:
      throw new Error(`unknown git status: ${type}`)
  }
}
