import { executeCommand, getPreference, showQuickInput } from '@lvce-editor/api'
import * as Config from '../Config/Config.ts'
import * as CommitQueue from '../CommitQueue/CommitQueue.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import { runCommit, type CommitOptions } from '../RunCommit/RunCommit.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

const commitQueue = CommitQueue.create()

export const commit = async (message: string | undefined, options: CommitOptions = {}): Promise<void> => {
  await commitQueue.run(async () => {
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
  })
}
