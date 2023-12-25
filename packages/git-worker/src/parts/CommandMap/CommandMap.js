import * as GitGetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'
import * as GitGetGroups from '../GetGroups/GetGroups.js'
import * as GitGetAddedFiles from '../GitRequestsGetAddedFiles/GitRequestsGetAddedFiles.js'
import * as GitGetCurrentBranch from '../GitRequestsGetCurrentBranch/GitRequestGetCurrentBranch.js'
import * as GitGetFileBefore from '../GitRequestsGetFileBefore/GitRequestGetFileBefore.js'
import * as GitSync from '../GitRequestsSync/GitRequestsSync.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'
import * as WrappedGitRequests from '../WrappedGitRequests/WrappedGitRequests.js'

export const commandMap = {
  [GitWorkerCommandType.GitAdd]: WrappedGitRequests.wrappedGitRequests.add,
  [GitWorkerCommandType.GitAddAll]: WrappedGitRequests.wrappedGitRequests.addAll,
  [GitWorkerCommandType.GitAddAllAndCommit]: WrappedGitRequests.wrappedGitRequests.addAllAndCommit,
  [GitWorkerCommandType.GitCheckout]: WrappedGitRequests.wrappedGitRequests.checkout,
  [GitWorkerCommandType.GitCleanAll]: WrappedGitRequests.wrappedGitRequests.cleanAll,
  [GitWorkerCommandType.GitCommit]: WrappedGitRequests.wrappedGitRequests.commit,
  [GitWorkerCommandType.GitDeleteBranch]: WrappedGitRequests.wrappedGitRequests.deleteBranch,
  [GitWorkerCommandType.GitDiscard]: WrappedGitRequests.wrappedGitRequests.discard,
  [GitWorkerCommandType.GitFetch]: WrappedGitRequests.wrappedGitRequests.fetch,
  [GitWorkerCommandType.GitGetAddedFiles]: GitGetAddedFiles.getAddedFiles,
  [GitWorkerCommandType.GitGetChangedFiles]: GitGetChangedFiles.getChangedFiles,
  [GitWorkerCommandType.GitGetCurrentBranch]: GitGetCurrentBranch.getCurrentBranch,
  [GitWorkerCommandType.GitGetFileBefore]: GitGetFileBefore.getFileBefore,
  [GitWorkerCommandType.GitGetGroups]: GitGetGroups.getGroups,
  [GitWorkerCommandType.GitInit]: WrappedGitRequests.wrappedGitRequests.init,
  [GitWorkerCommandType.GitPull]: WrappedGitRequests.wrappedGitRequests.pull,
  [GitWorkerCommandType.GitPullAndRebase]: WrappedGitRequests.wrappedGitRequests.pullAndRebase,
  [GitWorkerCommandType.GitPush]: WrappedGitRequests.wrappedGitRequests.push,
  [GitWorkerCommandType.GitStage]: WrappedGitRequests.wrappedGitRequests.stage,
  [GitWorkerCommandType.GitStageAll]: WrappedGitRequests.wrappedGitRequests.stageAll,
  [GitWorkerCommandType.GitSync]: GitSync.sync,
  [GitWorkerCommandType.GitTag]: WrappedGitRequests.wrappedGitRequests.tag,
  [GitWorkerCommandType.GitUndoLastCommit]: WrappedGitRequests.wrappedGitRequests.undoLastCommit,
  [GitWorkerCommandType.GitUnstage]: WrappedGitRequests.wrappedGitRequests.unstage,
  [GitWorkerCommandType.GitUnstageAll]: WrappedGitRequests.wrappedGitRequests.unstageAll,
  [GitWorkerCommandType.GitVersion]: WrappedGitRequests.wrappedGitRequests.version,
}
