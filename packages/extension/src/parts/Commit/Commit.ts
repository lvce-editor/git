import { executeCommand, getPreference, showQuickInput } from '@lvce-editor/api'
import * as Config from '../Config/Config.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import { runCommit, type CommitOptions } from '../RunCommit/RunCommit.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

const state: { promise: Promise<void> | undefined } = {
  promise: undefined,
}

export const commit = async (message: string | undefined, options: CommitOptions = {}): Promise<void> => {
  const previous = state.promise || Promise.resolve()
  const promise = previous
    .catch(() => {})
    .then(() =>
      runCommit(message, options, {
        executeCommand,
        getPreference,
        getWorkspaceFolder: Config.getWorkspaceFolder,
        invoke: GitWorker.invoke,
        refresh: StatusBarSync.refresh,
        refreshCheckout: StatusBarCheckout.refresh,
        setSpinning: StatusBarSync.setSpinning,
        showQuickInput,
      }),
    )
  state.promise = promise
  try {
    await promise
  } finally {
    if (state.promise === promise) {
      state.promise = undefined
    }
  }
}
