import { activate as activateExtensionApi, registerCommand, registerSourceControlProvider } from '@lvce-editor/api'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
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
}

export const deactivate = (): void => {}
