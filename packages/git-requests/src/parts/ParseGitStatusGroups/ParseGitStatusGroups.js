import * as FileStateType from '../FileStateType/FileStateType.js'

export const parseGitStatusGroups = (files) => {
  const indexGroup = []
  const mergeGroup = []
  const workingTreeGroup = []
  const untrackedGroup = []
  for (const file of files) {
    const { status } = file
    switch (status) {
      case FileStateType.Modified:
      case FileStateType.Deleted:
      case FileStateType.IntentToAdd:
      case FileStateType.Untracked:
      case FileStateType.Ignored:
        workingTreeGroup.push(file)
        break
      case FileStateType.IndexModified:
      case FileStateType.IndexAdded:
      case FileStateType.IndexDeleted:
      case FileStateType.IndexRenamed:
      case FileStateType.IndexCopied:
        indexGroup.push(file)
        break
      case FileStateType.BothDeleted:
      case FileStateType.AddedByUs:
      case FileStateType.DeletedByThem:
      case FileStateType.AddedByThem:
      case FileStateType.DeletedByUs:
      case FileStateType.BothAdded:
      case FileStateType.BothModified:
        mergeGroup.push(file)
        break
      default:
        throw new Error(`unexpected file status: ${status}`)
    }
  }
  return {
    indexGroup,
    mergeGroup,
    workingTreeGroup,
    untrackedGroup,
  }
}
