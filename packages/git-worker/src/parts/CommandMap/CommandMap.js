import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.js'
import * as GitGetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'
import * as GitGetGroups from '../GetGroups/GetGroups.js'
import * as GitAdd from '../GitRequestsAdd/GitRequestsAdd.js'
import * as GitAddAll from '../GitRequestsAddAll/GitRequestsAddAll.js'
import * as GitAddAllAndCommit from '../GitRequestsAddAllAndCommit/GitRequestsAddAllAndCommit.js'
import * as GitCheckout from '../GitRequestsCheckout/GitRequestsCheckout.js'
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
import * as GitSync from '../GitRequestsSync/GitRequestsSync.js'
import * as GitTag from '../GitRequestsTag/GitRequestsTag.js'
import * as GitUnstage from '../GitRequestsUnstage/GitRequestsUnstage.js'
import * as GitVersion from '../GitRequestsVersion/GitRequestsVersion.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const getFn = (method) => {
  switch (method) {
    case GitWorkerCommandType.GitGetChangedFiles:
      return GitGetChangedFiles.getChangedFiles
    case GitWorkerCommandType.GitAddAllAndCommit:
      return GitAddAllAndCommit.addAllAndCommit
    case GitWorkerCommandType.GitAdd:
      return GitAdd.add
    case GitWorkerCommandType.GitAddAll:
      return GitAddAll.addAll
    case GitWorkerCommandType.GitCheckout:
      return GitCheckout.checkout
    case GitWorkerCommandType.GitCommit:
      return GitCommit.commit
    case GitWorkerCommandType.GitDeleteBranch:
      return GitDeleteBranch.deleteBranch
    case GitWorkerCommandType.GitDiscard:
      return GitDiscard.discard
    case GitWorkerCommandType.GitFetch:
      return GitFetch.fetch
    case GitWorkerCommandType.GitGetAddedFiles:
      return GitGetAddedFiles.getAddedFiles
    case GitWorkerCommandType.GitGetCurrentBranch:
      return GitGetCurrentBranch.getCurrentBranch
    case GitWorkerCommandType.GitGetFileBefore:
      return GitGetFileBefore.getFileBefore
    case GitWorkerCommandType.GitInit:
      return GitInit.init
    case GitWorkerCommandType.GitPull:
      return GitPull.pull
    case GitWorkerCommandType.GitPullAndRebase:
      return GitPullAndRebase.pullAndRebase
    case GitWorkerCommandType.GitPush:
      return GitPush.push
    case GitWorkerCommandType.GitSync:
      return GitSync.sync
    case GitWorkerCommandType.GitTag:
      return GitTag.tag
    case GitWorkerCommandType.GitVersion:
      return GitVersion.version
    case GitWorkerCommandType.GitGetGroups:
      return GitGetGroups.getGroups
    case GitWorkerCommandType.GitUnstage:
      return GitUnstage.unstage
    case GitWorkerCommandType.GitStage:
      return GitStage.stage
    default:
      throw new CommandNotFoundError(method)
  }
}
