import type { GitStatusFile } from '../Types/Types.ts'
import * as FileStateType from '../FileStateType/FileStateType.ts'

export const getDecorationStrikeThrough = (status: GitStatusFile['status']): boolean => {
  switch (status) {
    case FileStateType.BothDeleted:
    case FileStateType.Deleted:
    case FileStateType.DeletedByThem:
    case FileStateType.DeletedByUs:
    case FileStateType.IndexDeleted:
      return true
    default:
      return false
  }
}
