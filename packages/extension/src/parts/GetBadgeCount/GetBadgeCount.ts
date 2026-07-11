import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

export const getBadgeCount = async (): Promise<number> => {
  const groups = await GitWorker.invoke(GitWorkerCommandType.GitGetGroups, {})
  if (!Array.isArray(groups)) {
    return 0
  }
  let badgeCount = 0
  for (const group of groups) {
    if (!group || !Array.isArray(group.items)) {
      continue
    }
    badgeCount += group.items.length
  }
  return badgeCount
}
