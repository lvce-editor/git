import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.js'
import * as ExtensionInfo from '../ExtensionInfo/ExtensionInfo.js'
import * as SourceControlProviderGit from '../UiSourceControlProvider/UiSourceControlProviderGit.js'

export const activate = async ({ path }) => {
  for (const command of Object.values(ExtensionHostCommand)) {
    vscode.registerCommand(command)
  }

  ExtensionInfo.setPath(path)
  vscode.registerSourceControlProvider(SourceControlProviderGit)

  // vscode.registerStatusBarItem(StatusBarCheckout.create())
  // vscode.registerStatusBarItem(StatusBarItemSync)

  // vscode.updateGitDecorations()

  // await initializeProject()
  // vscode.useEffect(()=>{
  //   setupWatcher()

  // })

  return () => {
    // rootWatcher.dispose()
    // dotGitWatcher.dispose()
  }
}

export const deactivate = () => {
  // for (const sourceControlProvider of sourceControlProviders) {
  //   vscode.unregisterSourceControlProvider(sourceControlProvider)
  // }
  // sourceControlProviders.clear()
}
