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
  }

  const clearStatusBars = async (): Promise<void> => {
    await dependencies.clearCheckout()
    await dependencies.clearSync()
  }

  return async (scheme: string, root?: string): Promise<boolean> => {
    if (!root || !supportedSchemes.includes(scheme)) {
      state.latestRequest += 1
      await clearStatusBars()
      return false
    }
    state.latestRequest += 1
    const requestId = state.latestRequest
    try {
      const { exitCode } = await dependencies.execute('git', ['rev-parse', '--git-dir'], {
        cwd: root,
        reject: false,
      })
      const isGitRepository = exitCode === 0
      if (requestId !== state.latestRequest) {
        return isGitRepository
      }
      if (isGitRepository) {
        await dependencies.refreshCheckout(root)
        await dependencies.refreshSync(root)
      } else {
        await clearStatusBars()
      }
      return isGitRepository
    } catch (error) {
      if (requestId !== state.latestRequest) {
        return false
      }
      console.log({ error })
      await clearStatusBars()
      return false
    }
  }
}
