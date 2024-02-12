import * as CommandCheckout from '../CommandCheckout/CommandCheckout.js'
import * as CommandFetch from '../CommandFetch/CommandFetch.js'
import * as CommandAdd from '../CommandAdd/CommandAdd.js'
import * as CommandPull from '../CommandPull/CommandPull.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'
import * as WrappedGitRequests from '../WrappedGitRequests/WrappedGitRequests.js'

export const commandMap = {
  [GitWorkerCommandType.CommandAdd]: CommandAdd.commandAdd,
  [GitWorkerCommandType.CommandCheckoutRef]: CommandCheckout.commandCheckout,
  [GitWorkerCommandType.CommandFetch]: CommandFetch.commandFetch,
  [GitWorkerCommandType.CommandPull]: CommandPull.commandPull,
  [GitWorkerCommandType.GitAdd]: WrappedGitRequests.wrappedGitRequests.add,
  [GitWorkerCommandType.GitAddAll]: WrappedGitRequests.wrappedGitRequests.addAll,
  [GitWorkerCommandType.GitAddAllAndCommit]: WrappedGitRequests.wrappedGitRequests.addAllAndCommit,
  [GitWorkerCommandType.GitCheckout]: WrappedGitRequests.wrappedGitRequests.checkout,
  [GitWorkerCommandType.GitCleanAll]: WrappedGitRequests.wrappedGitRequests.cleanAll,
  [GitWorkerCommandType.GitCommit]: WrappedGitRequests.wrappedGitRequests.commit,
  [GitWorkerCommandType.GitDeleteBranch]: WrappedGitRequests.wrappedGitRequests.deleteBranch,
  [GitWorkerCommandType.GitDiscard]: WrappedGitRequests.wrappedGitRequests.discard,
  [GitWorkerCommandType.GitFetch]: WrappedGitRequests.wrappedGitRequests.fetch,
  [GitWorkerCommandType.GitGetAddedFiles]: WrappedGitRequests.wrappedGitRequests.getAddedFiles,
  [GitWorkerCommandType.GitGetChangedFiles]: WrappedGitRequests.wrappedGitRequests.getChangedFiles,
  [GitWorkerCommandType.GitGetCurrentBranch]: WrappedGitRequests.wrappedGitRequests.getCurrentBranch,
  [GitWorkerCommandType.GitGetFileBefore]: WrappedGitRequests.wrappedGitRequests.getFileBefore,
  [GitWorkerCommandType.GitGetGroups]: WrappedGitRequests.wrappedGitRequests.getGroups,
  [GitWorkerCommandType.GitGetRefs]: WrappedGitRequests.wrappedGitRequests.getRefs,
  [GitWorkerCommandType.GitInit]: WrappedGitRequests.wrappedGitRequests.init,
  [GitWorkerCommandType.GitPull]: WrappedGitRequests.wrappedGitRequests.pull,
  [GitWorkerCommandType.GitPullAndRebase]: WrappedGitRequests.wrappedGitRequests.pullAndRebase,
  [GitWorkerCommandType.GitPush]: WrappedGitRequests.wrappedGitRequests.push,
  [GitWorkerCommandType.GitStage]: WrappedGitRequests.wrappedGitRequests.stage,
  [GitWorkerCommandType.GitStageAll]: WrappedGitRequests.wrappedGitRequests.stageAll,
  [GitWorkerCommandType.GitSync]: WrappedGitRequests.wrappedGitRequests.sync,
  [GitWorkerCommandType.GitTag]: WrappedGitRequests.wrappedGitRequests.tag,
  [GitWorkerCommandType.GitUndoLastCommit]: WrappedGitRequests.wrappedGitRequests.undoLastCommit,
  [GitWorkerCommandType.GitUnstage]: WrappedGitRequests.wrappedGitRequests.unstage,
  [GitWorkerCommandType.GitUnstageAll]: WrappedGitRequests.wrappedGitRequests.unstageAll,
  [GitWorkerCommandType.GitVersion]: WrappedGitRequests.wrappedGitRequests.version,
}
