import { createRpc } from '@lvce-editor/api'
import { commandMap } from '../CommandMap/CommandMap.ts'
import * as GitWorkerUrl from '../GitWorkerUrl/GitWorkerUrl.ts'

type Rpc = {
  invoke(method: string, ...params: readonly any[]): Promise<any>
}

export const launchGitWorker = async (): Promise<Rpc> => {
  const workerUrl = GitWorkerUrl.getGitWorkerUrl()
  const rpc = await createRpc({
    commandMap,
    name: 'Git Worker',
    url: workerUrl,
  })
  return rpc
}
