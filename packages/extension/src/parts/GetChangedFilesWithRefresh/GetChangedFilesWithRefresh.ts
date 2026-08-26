export interface GetChangedFilesWithRefreshDependencies {
  readonly getChangedFiles: () => Promise<readonly unknown[]>
  readonly refreshEditorGutterDecorations: () => Promise<void>
}

export const createGetChangedFilesWithRefresh = (dependencies: GetChangedFilesWithRefreshDependencies) => {
  return async (): Promise<readonly unknown[]> => {
    const changedFiles = await dependencies.getChangedFiles()
    try {
      await dependencies.refreshEditorGutterDecorations()
    } catch {
      // Older editor workers do not expose a gutter decoration refresh command.
    }
    return changedFiles
  }
}
