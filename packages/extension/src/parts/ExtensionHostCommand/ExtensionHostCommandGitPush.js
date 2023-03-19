import * as CommandId from '../CommandId/CommandId.js'
import * as GitWorker from '../GitWorker/GitWorker.js'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.js'

export const id = CommandId.GitPush

export const execute = async () => {
  return GitWorker.invoke(GitWorkerCommandType.GitPush)
}

// export const resolveError = (error) => {
//   return {
//     type: 'error-dialog',
//     message: error.toString(),
//     options: ['close'],
//   }
// }
