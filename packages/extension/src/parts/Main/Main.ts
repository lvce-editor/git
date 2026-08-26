import {
  activate as activateExtensionApi,
  getPreference,
  registerCommand,
  registerEditorGutterDecorationProvider,
  registerEditorLineDecorationProvider,
  registerSourceControlProvider,
} from '@lvce-editor/api'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as GutterDecorationProvider from '../GutterDecorationProvider/GutterDecorationProvider.ts'
import * as InlineBlameProvider from '../InlineBlameProvider/InlineBlameProvider.ts'
import { runFetchOnWorkspaceOpen } from '../RunFetchOnWorkspaceOpen/RunFetchOnWorkspaceOpen.ts'
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
  registerEditorGutterDecorationProvider(GutterDecorationProvider)
  registerEditorLineDecorationProvider(InlineBlameProvider)
  StatusBarCheckout.initialize()
  StatusBarSync.initialize()
  await runFetchOnWorkspaceOpen({
    fetch: ExtensionHostCommand.GitFetch.execute,
    getRunFetchOnWorkspaceOpen: () => getPreference('git.runFetchOnWorkspaceOpen'),
  })
  await StatusBarCheckout.refresh()
  await StatusBarSync.refresh()
}

export const deactivate = (): void => {}
