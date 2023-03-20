import * as ExtensionHostCommandAcceptInput from './parts/ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.js'
import * as ExtensionHostCommandGitAddAll from './parts/ExtensionHostCommand/ExtensionHostCommandGitAddAll.js'
import * as ExtensionHostCommandGitCheckout from './parts/ExtensionHostCommand/ExtensionHostCommandGitCheckout.js'
import * as ExtensionHostCommandGitCheckoutRef from './parts/ExtensionHostCommand/ExtensionHostCommandGitCheckoutRef.js'
import * as ExtensionHostCommandGitFetch from './parts/ExtensionHostCommand/ExtensionHostCommandGitFetch.js'
import * as ExtensionHostCommandGitInit from './parts/ExtensionHostCommand/ExtensionHostCommandGitInit.js'
import * as ExtensionHostCommandGitDiscard from './parts/ExtensionHostCommand/ExtensionHostCommandGitDiscard.js'
import * as ExtensionHostCommandGitPull from './parts/ExtensionHostCommand/ExtensionHostCommandGitPull.js'
import * as ExtensionHostCommandGitPullRebase from './parts/ExtensionHostCommand/ExtensionHostCommandGitPullRebase.js'
import * as ExtensionHostCommandGitPullRequest from './parts/ExtensionHostCommand/ExtensionHostCommandGitPullRequest.js'
import * as ExtensionHostCommandGitPush from './parts/ExtensionHostCommand/ExtensionHostCommandGitPush.js'
import * as ExtensionHostCommandGitStage from './parts/ExtensionHostCommand/ExtensionHostCommandGitStage.js'
import * as ExtensionHostCommandGitStageAll from './parts/ExtensionHostCommand/ExtensionHostCommandGitStageAll.js'
import * as ExtensionHostCommandGitSync from './parts/ExtensionHostCommand/ExtensionHostCommandGitSync.js'
import * as ExtensionHostCommandGitUnstage from './parts/ExtensionHostCommand/ExtensionHostCommandGitUnstage.js'
import * as ExtensionHostCommandGitUnstageAll from './parts/ExtensionHostCommand/ExtensionHostCommandGitUnstageAll.js'
import * as ExtensionHostCommandGitCleanAll from './parts/ExtensionHostCommand/ExtensionHostCommandGitCleanAll.js'
import * as GitFind from './parts/GitFind/GitFind.js'
import * as OutputChannelGit from './parts/UiOutputChannel/UiOutputChannelGit.js'
import * as SourceControlProviderGit from './parts/UiSourceControlProvider/UiSourceControlProviderGit.js'

export const initializeProject = async () => {
  const git = await GitFind.findGit()
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

export const activate = async () => {
  vscode.registerCommand(ExtensionHostCommandAcceptInput)
  vscode.registerCommand(ExtensionHostCommandGitAddAll)
  vscode.registerCommand(ExtensionHostCommandGitCheckout)
  vscode.registerCommand(ExtensionHostCommandGitCheckoutRef)
  vscode.registerCommand(ExtensionHostCommandGitCleanAll)
  vscode.registerCommand(ExtensionHostCommandGitDiscard)
  vscode.registerCommand(ExtensionHostCommandGitFetch)
  vscode.registerCommand(ExtensionHostCommandGitInit)
  vscode.registerCommand(ExtensionHostCommandGitPull)
  vscode.registerCommand(ExtensionHostCommandGitPullRebase)
  vscode.registerCommand(ExtensionHostCommandGitPullRequest)
  vscode.registerCommand(ExtensionHostCommandGitPush)
  vscode.registerCommand(ExtensionHostCommandGitStage)
  vscode.registerCommand(ExtensionHostCommandGitStageAll)
  vscode.registerCommand(ExtensionHostCommandGitSync)
  vscode.registerCommand(ExtensionHostCommandGitUnstage)
  vscode.registerCommand(ExtensionHostCommandGitUnstageAll)

  vscode.registerSourceControlProvider(SourceControlProviderGit)

  await initializeProject()

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
