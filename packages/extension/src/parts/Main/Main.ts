import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as SourceControlProviderGit from '../UiSourceControlProvider/UiSourceControlProviderGit.ts'

import { activate as activateExtensionApi, registerCommand, registerSourceControlProvider } from '@lvce-editor/api'

const main = async () => {
  await activateExtensionApi()

  for (const command of Object.values(ExtensionHostCommand)) {
    registerCommand(command)
  }

  registerSourceControlProvider(SourceControlProviderGit)

  return () => {
    // rootWatcher.dispose()
    // dotGitWatcher.dispose()
  }
}

main()
