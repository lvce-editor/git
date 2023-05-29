import * as ExtensionHostCommand from './parts/ExtensionHostCommand/ExtensionHostCommand.js'
import * as GitFind from './parts/GitFind/GitFind.js'
import * as OutputChannelGit from './parts/UiOutputChannel/UiOutputChannelGit.js'
import * as SourceControlProviderGit from './parts/UiSourceControlProvider/UiSourceControlProviderGit.js'
import * as ExtensionInfo from './parts/ExtensionInfo/ExtensionInfo.js'

export const initializeProject = async () => {
  const git = await GitFind.findGit()
  console.log({ git })
  if (!git) {
    console.info('[git] git not found')
    OutputChannelGit.append('git not found')
    // TODO should modeless status bar item
    // or item in output channel
    // that git could not be found
    return
  }
  OutputChannelGit.append(`using git version ${git.version}\n`)
  // const folder = vscode.getWorkspaceFolder()
  // const repository = await Repositories.getCurrent()
}

export const activate = async ({ path }) => {
  for (const command of Object.values(ExtensionHostCommand)) {
    vscode.registerCommand(command)
  }

  ExtensionInfo.setPath(path)
  vscode.registerSourceControlProvider(SourceControlProviderGit)

  await initializeProject()

  // vscode.registerStatusBarItem(StatusBarCheckout.create())
  // vscode.registerStatusBarItem(StatusBarItemSync)

  // vscode.updateGitDecorations()

  // await initializeProject()
  // vscode.useEffect(()=>{
  //   setupWatcher()

  // })

  console.log('finished activate')

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
