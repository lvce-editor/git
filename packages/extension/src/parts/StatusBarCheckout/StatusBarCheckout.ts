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

export const refresh = async (cwd?: string): Promise<void> => {
  try {
    state.branch = await GitWorker.invoke(GitWorkerCommandType.GitGetCurrentBranch, { cwd })
  } catch {
    state.branch = ''
  }
  await state.handle?.refresh()
}
