import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'

export const showBranchPicker = async () => {
  const selectedBranch = await GitWorker.invoke('Command.gitCheckoutRef')
  if (selectedBranch) {
    await StatusBarCheckout.refresh()
  }
  return selectedBranch
}
