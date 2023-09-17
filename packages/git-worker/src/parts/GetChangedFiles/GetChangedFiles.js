import * as GetDecorationIcon from '../GetDecorationIcon/GetDecorationIcon.js'
import * as GetDecorationStrikeThrough from '../GetDecorationStrikeThrough/GetDecorationStrikeThrough.js'
import * as GetStatusText from '../GetStatusText/GetStatusText.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRequestsGetModifiedFiles from '../GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js'

export const id = 'git'

export const label = 'Git'

const getWithDecoration = (resource) => {
  return {
    ...resource,
    icon: GetDecorationIcon.getDecorationIcon(resource.status),
    iconTitle: GetStatusText.getStatusText(resource.status),
    strikeThrough: GetDecorationStrikeThrough.getDecorationStrikeThrough(resource.status),
  }
}

const getWithDecorations = (index) => {
  return index.map(getWithDecoration)
}

export const getChangedFiles = async (cwd) => {
  const repository = await Repositories.getCurrent()
  const modifiedFiles = await GitRequestsGetModifiedFiles.getModifiedFiles({
    cwd: repository.path,
    gitPath: repository.gitPath,
  })
  const { index } = modifiedFiles
  const indexWithDecorations = getWithDecorations(index)
  return indexWithDecorations
}
