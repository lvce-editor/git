import * as GitWorker from '../GitWorker/GitWorker.js'
import * as Assert from '../Assert/Assert.js'

export const getChangedFiles = async (cwd) => {
  const rpc = await GitWorker.getInstance()
  const result = await rpc.invoke('Git.getChangedFiles')
  Assert.array(result)
  return result
}
