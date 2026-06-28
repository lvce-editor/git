import * as GitWorker from '../GitWorker/GitWorker.ts'

export const showBranchPicker = async () => {
  return GitWorker.invoke('Command.gitCheckoutRef')
}
