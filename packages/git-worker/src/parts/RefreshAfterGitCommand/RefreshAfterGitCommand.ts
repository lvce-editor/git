import * as Rpc from '../Rpc/Rpc.ts'

const MUTATING_COMMANDS = new Set([
  'add',
  'addAll',
  'addAllAndCommit',
  'applyStash',
  'branch',
  'cherryPick',
  'checkout',
  'cleanAll',
  'commit',
  'deleteBranch',
  'discard',
  'fetch',
  'fetchPrune',
  'init',
  'merge',
  'pull',
  'pullAndRebase',
  'push',
  'stage',
  'stageAll',
  'stash',
  'sync',
  'undoLastCommit',
  'unstage',
  'unstageAll',
  'unstash',
])

export const refreshAfterGitCommand = async (id: string): Promise<void> => {
  if (!MUTATING_COMMANDS.has(id)) {
    return
  }
  try {
    await Rpc.invoke('Layout.handleWorkspaceRefresh')
  } catch {
    // ignore
  }
}
