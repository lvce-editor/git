export const getWorkspaceFolder = () => {
  const path = vscode.getWorkspaceFolder()
  return path
}

export const getGitPaths = () => {
  // TODO don't couple vscode api with business logic too much
  const configuredGitPath = vscode.getConfiguration('git.path')
  if (configuredGitPath) {
    return [configuredGitPath]
  }
  const paths = ['git']
  if (vscode.env.GIT_PATH) {
    paths.unshift(vscode.env.GIT_PATH)
  }
  return paths
}
