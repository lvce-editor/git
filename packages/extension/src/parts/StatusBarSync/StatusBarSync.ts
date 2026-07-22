import { registerStatusBarItemProvider } from '@lvce-editor/api'
import * as CommandId from '../CommandId/CommandId.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

const providerId = 'git.sync'

interface GitUpstreamChanges {
  readonly incoming: number
  readonly outgoing: number
}

const state: {
  handle: undefined | { refresh(): Promise<void> }
  incoming: number
  outgoing: number
  visible: boolean
} = {
  handle: undefined,
  incoming: 0,
  outgoing: 0,
  visible: false,
}

const getStatusBarItem = () => {
  if (!state.visible) {
    return undefined
  }
  return {
    icon: 'MaskIconSync',
    name: CommandId.GitSync,
    onClick: CommandId.GitSync,
    text: `${state.incoming}↓ ${state.outgoing}↑`,
  }
}

export const initialize = (): void => {
  state.handle = registerStatusBarItemProvider({
    getStatusBarItem,
    id: providerId,
  })
}

export const clear = async (): Promise<void> => {
  state.incoming = 0
  state.outgoing = 0
  state.visible = false
  await state.handle?.refresh()
}

export const refresh = async (cwd?: string): Promise<void> => {
  let branch: string
  try {
    branch = await GitWorker.invoke(GitWorkerCommandType.GitGetCurrentBranch, { cwd })
  } catch {
    await clear()
    return
  }
  if (!branch) {
    await clear()
    return
  }
  state.visible = true
  try {
    const changes: GitUpstreamChanges = await GitWorker.invoke(GitWorkerCommandType.GitGetUpstreamChanges, { cwd })
    state.incoming = changes.incoming
    state.outgoing = changes.outgoing
  } catch {
    state.incoming = 0
    state.outgoing = 0
  }
  await state.handle?.refresh()
}
