import * as GitStatusTrace from '../GitStatusTrace/GitStatusTrace.ts'
import { registerStatusBarItemProvider } from '@lvce-editor/api'
import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

const providerId = 'git.checkout'

const state: {
  branch: string
  handle: undefined | { refresh(): Promise<void> }
} = {
  branch: '',
  handle: undefined,
}

const getStatusBarItem = () => {
  GitStatusTrace.record('checkout.get', { branch: state.branch })
  if (!state.branch) {
    return undefined
  }
  return {
    icon: 'branch',
    name: CommandId.GitShowBranchPicker,
    onClick: CommandId.GitShowBranchPicker,
    text: state.branch,
  }
}

export const initialize = (): void => {
  state.handle = registerStatusBarItemProvider({
    getStatusBarItem,
    id: providerId,
  })
}

export const clear = async (): Promise<void> => {
  GitStatusTrace.record('checkout.clear', { branch: state.branch })
  state.branch = ''
  await state.handle?.refresh()
  GitStatusTrace.record('checkout.refresh.notified', { branch: state.branch })
}

export const refresh = async (cwd?: string): Promise<void> => {
  const request = { cwd, started: performance.now() }
  GitStatusTrace.record('checkout.refresh.start', request)
  try {
    state.branch = await GitWorker.invoke(GitWorkerCommandType.GitGetCurrentBranch, { cwd })
    GitStatusTrace.record('checkout.refresh.result', { ...request, branch: state.branch })
  } catch (error) {
    GitStatusTrace.record('checkout.refresh.error', { ...request, error: String(error) })
    state.branch = ''
  }
  await state.handle?.refresh()
  GitStatusTrace.record('checkout.refresh.notified', { branch: state.branch })
}
