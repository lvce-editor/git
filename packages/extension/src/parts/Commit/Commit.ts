import { executeCommand, getPreference, showQuickInput } from '@lvce-editor/api'
import * as Config from '../Config/Config.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import { runCommit, type CommitOptions } from '../RunCommit/RunCommit.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

const state = { committing: false }

export const commit = async (message: string, options: CommitOptions = {}): Promise<void> => {
  if (state.committing) {
    return
  }
  state.committing = true
  try {
    await runCommit(message, options, {
      executeCommand,
      getPreference,
      getWorkspaceFolder: Config.getWorkspaceFolder,
      invoke: GitWorker.invoke,
      refresh: StatusBarSync.refresh,
      refreshCheckout: StatusBarCheckout.refresh,
      setSpinning: StatusBarSync.setSpinning,
      showQuickInput,
    })
  } finally {
    state.committing = false
  }
}
