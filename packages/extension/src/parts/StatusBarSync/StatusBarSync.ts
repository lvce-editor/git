import { registerStatusBarItemProvider } from '@lvce-editor/api'
import * as CommandId from '../CommandId/CommandId.ts'
import * as GetSyncAriaLabel from '../GetSyncAriaLabel/GetSyncAriaLabel.ts'
import * as GitWorker from '../GitWorker/GitWorker.ts'
import * as GitWorkerCommandType from '../GitWorkerCommandType/GitWorkerCommandType.ts'

const providerId = 'git.sync'

interface GitUpstreamChanges {
  readonly incoming: number
  readonly outgoing: number
  readonly upstream: string
}

const state: {
  handle: undefined | { refresh(): Promise<void> }
  incoming: number
  outgoing: number
  repositoryName: string
  spinning: boolean
  upstream: string
  visible: boolean
} = {
  handle: undefined,
  incoming: 0,
  outgoing: 0,
  repositoryName: '',
  spinning: false,
  upstream: '',
  visible: false,
}

const getRepositoryName = (cwd: string): string => {
  let normalizedCwd = cwd
  while (normalizedCwd.endsWith('/') || normalizedCwd.endsWith('\\')) {
    normalizedCwd = normalizedCwd.slice(0, -1)
  }
  const separatorIndex = Math.max(normalizedCwd.lastIndexOf('/'), normalizedCwd.lastIndexOf('\\'))
  return decodeURIComponent(normalizedCwd.slice(separatorIndex + 1))
}

const getStatusBarItem = () => {
  if (!state.visible) {
    return undefined
  }
  return {
    ariaLabel: GetSyncAriaLabel.getSyncAriaLabel(state.repositoryName, state.incoming, state.outgoing, state.upstream, state.spinning),
    icon: 'MaskIconSync',
    name: CommandId.GitSync,
    onClick: CommandId.GitSync,
    spinning: state.spinning,
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
  state.upstream = ''
  state.visible = false
  await state.handle?.refresh()
}

export const setSpinning = async (spinning: boolean): Promise<void> => {
  state.spinning = spinning
  await state.handle?.refresh()
}

export const refresh = async (cwd?: string): Promise<void> => {
  if (cwd) {
    state.repositoryName = getRepositoryName(cwd)
  }
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
    state.upstream = changes.upstream
  } catch {
    state.incoming = 0
    state.outgoing = 0
    state.upstream = ''
  }
  await state.handle?.refresh()
}
