import { activate as activateExtensionApi, registerCommand, registerSourceControlProvider } from '@lvce-editor/api'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'
import * as SourceControlProviderGit from '../UiSourceControlProvider/UiSourceControlProviderGit.ts'

const state = {
  isActivated: false,
}

export const activate = async (): Promise<void> => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  await activateExtensionApi()

  for (const command of Object.values(ExtensionHostCommand)) {
    registerCommand(command)
  }

  registerSourceControlProvider(SourceControlProviderGit)
  StatusBarCheckout.initialize()
  StatusBarSync.initialize()
  await StatusBarCheckout.refresh()
  await StatusBarSync.refresh()
}

export const deactivate = (): void => {}
