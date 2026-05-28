import type { GetRepository, GitDecoration, GitStatusFile, GitExec } from '../Types/Types.ts'
import * as GetDecorationIcon from '../GetDecorationIcon/GetDecorationIcon.ts'
import * as GetDecorationStrikeThrough from '../GetDecorationStrikeThrough/GetDecorationStrikeThrough.ts'
import * as GetStatusText from '../GetStatusText/GetStatusText.ts'
import * as GitRequestsGetModifiedFiles from '../GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.ts'

export const id = 'git'

export const label = 'Git'

const getWithDecoration = (resource: GitStatusFile): GitDecoration => {
  return {
    ...resource,
    icon: GetDecorationIcon.getDecorationIcon(resource.status),
    iconTitle: GetStatusText.getStatusText(resource.status),
    strikeThrough: GetDecorationStrikeThrough.getDecorationStrikeThrough(resource.status),
  }
}

const getWithDecorations = (index: readonly GitStatusFile[]): readonly GitDecoration[] => {
  return index.map(getWithDecoration)
}

export const getChangedFiles = async ({
  exec,
  getRepository,
}: {
  readonly getRepository: GetRepository
  readonly exec: GitExec
}): Promise<readonly GitDecoration[]> => {
  const repository = await getRepository()
  const modifiedFiles = await GitRequestsGetModifiedFiles.getModifiedFiles({
    cwd: repository.path,
    exec,
    gitPath: repository.gitPath,
  })
  const { index } = modifiedFiles
  const indexWithDecorations = getWithDecorations(index)
  return indexWithDecorations
}
