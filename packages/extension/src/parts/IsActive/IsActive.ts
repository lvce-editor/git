const supportedSchemes = ['file', '', 'memfs']

export interface IsActiveDependencies {
  readonly clearCheckout: () => Promise<void>
  readonly clearSync: () => Promise<void>
  readonly execute: (
    command: string,
    args: readonly string[],
    options: { readonly cwd: string; readonly reject: boolean },
  ) => Promise<{ readonly exitCode: number }>
  readonly refreshCheckout: (root: string) => Promise<void>
  readonly refreshSync: (root: string) => Promise<void>
}

export const createIsActive = (dependencies: IsActiveDependencies) => {
  const state = {
    latestRequest: 0,
    statusBarUpdate: Promise.resolve(),
  }

  const runStatusBarUpdate = async (previousUpdate: Promise<void>, requestId: number, isGitRepository: boolean, root?: string): Promise<void> => {
    try {
      await previousUpdate
    } catch {
      // A newer status bar update must still run if the previous update failed.
    }
    if (requestId !== state.latestRequest) {
      return
    }
    if (isGitRepository && root) {
      await dependencies.refreshCheckout(root)
      if (requestId !== state.latestRequest) {
        return
      }
      await dependencies.refreshSync(root)
      return
    }
    await dependencies.clearCheckout()
    if (requestId !== state.latestRequest) {
      return
    }
    await dependencies.clearSync()
  }

  const updateStatusBars = async (requestId: number, isGitRepository: boolean, root?: string): Promise<void> => {
    const currentUpdate = runStatusBarUpdate(state.statusBarUpdate, requestId, isGitRepository, root)
    state.statusBarUpdate = currentUpdate
    await currentUpdate
  }

  return async (scheme: string, root?: string): Promise<boolean> => {
    state.latestRequest += 1
    const requestId = state.latestRequest
    if (!root || !supportedSchemes.includes(scheme)) {
      await updateStatusBars(requestId, false)
      return false
    }
    try {
      const { exitCode } = await dependencies.execute('git', ['rev-parse', '--git-dir'], {
        cwd: root,
        reject: false,
      })
      const isGitRepository = exitCode === 0
      if (requestId !== state.latestRequest) {
        return isGitRepository
      }
      await updateStatusBars(requestId, isGitRepository, root)
      return isGitRepository
    } catch (error) {
      if (requestId !== state.latestRequest) {
        return false
      }
      console.log({ error })
      await updateStatusBars(requestId, false)
      return false
    }
  }
}
