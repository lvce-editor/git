import * as GitWorker from '../GitWorker/GitWorker.js'

export const execute = async () => {
  await GitWorker.invoke('Git.pull')
}
