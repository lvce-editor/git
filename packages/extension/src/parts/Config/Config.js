export const getWorkspaceFolder = () => {
  // @ts-ignore
  const path = vscode.getWorkspaceFolder()
  return path
}

export const getGitPaths = () => {
  // TODO don't couple vscode api with business logic too much
  // @ts-ignore
  const configuredGitPath = vscode.getConfiguration('git.path')
  if (configuredGitPath) {
    return [configuredGitPath]
  }
  const paths = ['git']
  // @ts-ignore
  if (vscode.env.GIT_PATH) {
    // @ts-ignore
    paths.unshift(vscode.env.GIT_PATH)
  }
  return paths
}

export const confirmDiscard = () => {
  // @ts-ignore
  const value = vscode.getConfiguration('git.confirmDiscard')
  return value
}

export const showErrorMessage = () => {
  // @ts-ignore
  const value = vscode.getConfiguration('git.showErrorMessage')
  return value
}

export const exists = async (uri) => {
  // @ts-ignore
  const value = await vscode.exists(uri)
  return value
}

export const mkdir = async (uri) => {
  // @ts-ignore
  const value = await vscode.mkdir(uri)
  return value
}

export const write = async (uri, content) => {
  // @ts-ignore
  const value = await vscode.writeFile(uri, content)
  return value
}
export const readFile = async (uri) => {
  // @ts-ignore
  const value = await vscode.readFile(uri)
  return value
}

export const confirmPrompt = async (message) => {
  // @ts-ignore
  const result = await vscode.confirm(message)
  return result
}
