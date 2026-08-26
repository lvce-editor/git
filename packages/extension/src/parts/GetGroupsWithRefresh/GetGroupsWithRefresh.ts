export interface GetGroupsWithRefreshDependencies {
  readonly getGroups: (cwd: string) => Promise<readonly unknown[]>
  readonly refreshEditorGutterDecorations: () => Promise<void>
}

export const createGetGroupsWithRefresh = (dependencies: GetGroupsWithRefreshDependencies) => {
  return async (cwd: string): Promise<readonly unknown[]> => {
    const groups = await dependencies.getGroups(cwd)
    try {
      await dependencies.refreshEditorGutterDecorations()
    } catch {
      // Older editor workers do not expose a gutter decoration refresh command.
    }
    return groups
  }
}
