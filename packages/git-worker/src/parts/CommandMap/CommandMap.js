import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as GitGetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'
import * as GitGetGroups from '../GetGroups/GetGroups.js'
import * as GitAdd from '../GitRequestsAdd/GitRequestsAdd.js'
import * as GitAddAll from '../GitRequestsAddAll/GitRequestsAddAll.js'
import * as GitAddAllAndCommit from '../GitRequestsAddAllAndCommit/GitRequestsAddAllAndCommit.js'
import * as GitCheckout from '../GitRequestsCheckout/GitRequestsCheckout.js'
import * as GitRequestsCleanAll from '../GitRequestsCleanAll/GitRequestsCleanAll.js'
import * as GitCommit from '../GitRequestsCommit/GitRequestsCommit.js'
import * as GitDeleteBranch from '../GitRequestsDeleteBranch/GitRequestsDeleteBranch.js'
import * as GitDiscard from '../GitRequestsDiscard/GitRequestsDiscard.js'
import * as GitFetch from '../GitRequestsFetch/GitRequestsFetch.js'
import * as GitGetAddedFiles from '../GitRequestsGetAddedFiles/GitRequestsGetAddedFiles.js'
import * as GitGetCurrentBranch from '../GitRequestsGetCurrentBranch/GitRequestGetCurrentBranch.js'
import * as GitGetFileBefore from '../GitRequestsGetFileBefore/GitRequestGetFileBefore.js'
import * as GitInit from '../GitRequestsInit/GitRequestsInit.js'
import * as GitPull from '../GitRequestsPull/GitRequestsPull.js'
import * as GitPullAndRebase from '../GitRequestsPullAndRebase/GitRequestPullAndRebase.js'
import * as GitPush from '../GitRequestsPush/GitRequestsPush.js'
import * as GitStage from '../GitRequestsStage/GitRequestsStage.js'
import * as GitRequestsStageAll from '../GitRequestsStageAll/GitRequestsStageAll.js'
import * as GitSync from '../GitRequestsSync/GitRequestsSync.js'
import * as GitTag from '../GitRequestsTag/GitRequestsTag.js'
import * as GitUnstage from '../GitRequestsUnstage/GitRequestsUnstage.js'
import * as GitUnstageAll from '../GitRequestsUnstageAll/GitRequestsUnstageAll.js'
import * as GitVersion from '../GitRequestsVersion/GitRequestsVersion.js'
import * as GitUndoLastCommit from '../GitRequestsUndoLastCommit/GitRequestsUndoLastCommit.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const commandMap = {
  [GitWorkerCommandType.GitGetChangedFiles]: GitGetChangedFiles.getChangedFiles,
  [GitWorkerCommandType.GitAddAllAndCommit]: GitAddAllAndCommit.addAllAndCommit,
  [GitWorkerCommandType.GitAdd]: GitAdd.add,
  [GitWorkerCommandType.GitAddAll]: GitAddAll.addAll,
  [GitWorkerCommandType.GitCheckout]: GitCheckout.checkout,
  [GitWorkerCommandType.GitCommit]: GitCommit.commit,
  [GitWorkerCommandType.GitDeleteBranch]: GitDeleteBranch.deleteBranch,
  [GitWorkerCommandType.GitDiscard]: GitDiscard.discard,
  [GitWorkerCommandType.GitFetch]: GitFetch.fetch,
  [GitWorkerCommandType.GitGetAddedFiles]: GitGetAddedFiles.getAddedFiles,
  [GitWorkerCommandType.GitGetCurrentBranch]: GitGetCurrentBranch.getCurrentBranch,
  [GitWorkerCommandType.GitGetFileBefore]: GitGetFileBefore.getFileBefore,
  [GitWorkerCommandType.GitInit]: GitInit.init,
  [GitWorkerCommandType.GitPull]: GitPull.pull,
  [GitWorkerCommandType.GitPullAndRebase]: GitPullAndRebase.pullAndRebase,
  [GitWorkerCommandType.GitPush]: GitPush.push,
  [GitWorkerCommandType.GitSync]: GitSync.sync,
  [GitWorkerCommandType.GitTag]: GitTag.tag,
  [GitWorkerCommandType.GitVersion]: GitVersion.version,
  [GitWorkerCommandType.GitGetGroups]: GitGetGroups.getGroups,
  [GitWorkerCommandType.GitUnstage]: GitUnstage.unstage,
  [GitWorkerCommandType.GitStage]: GitStage.stage,
  [GitWorkerCommandType.GitStageAll]: GitRequestsStageAll.stageAll,
  [GitWorkerCommandType.GitUnstageAll]: GitUnstageAll.unstageAll,
  [GitWorkerCommandType.GitCleanAll]: GitRequestsCleanAll.cleanAll,
  [GitWorkerCommandType.GitUndoLastCommit]: GitUndoLastCommit.undoLastCommit,
}
