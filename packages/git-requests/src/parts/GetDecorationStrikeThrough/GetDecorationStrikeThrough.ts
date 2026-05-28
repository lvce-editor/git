import * as FileStateType from '../FileStateType/FileStateType.ts'
import type { GitStatusFile } from '../Types/Types.ts'

export const getDecorationStrikeThrough = (status: GitStatusFile['status']): boolean => {
  switch (status) {
    case FileStateType.Deleted:
    case FileStateType.BothDeleted:
    case FileStateType.DeletedByThem:
    case FileStateType.DeletedByUs:
    case FileStateType.IndexDeleted:
      return true
    default:
      return false
  }
}
