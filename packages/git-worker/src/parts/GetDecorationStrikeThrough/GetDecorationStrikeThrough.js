import * as FileStateType from '../FileStateType/FileStateType.js'

/**
 * @param {number} status
 * @returns
 */
export const getDecorationStrikeThrough = (status) => {
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
