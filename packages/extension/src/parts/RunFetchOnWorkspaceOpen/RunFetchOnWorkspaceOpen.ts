export interface RunFetchOnWorkspaceOpenDependencies {
  readonly fetch: () => Promise<unknown>
  readonly getRunFetchOnWorkspaceOpen: () => Promise<unknown>
}

export const runFetchOnWorkspaceOpen = async (dependencies: RunFetchOnWorkspaceOpenDependencies): Promise<void> => {
  if ((await dependencies.getRunFetchOnWorkspaceOpen()) !== true) {
    return
  }
  try {
    await dependencies.fetch()
  } catch {
    // Opening a folder that is not a Git repository must not fail extension activation.
  }
}
