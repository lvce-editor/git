import { activate as activateExtensionApi, registerCommand, registerSourceControlProvider } from '@lvce-editor/api'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'
import * as SourceControlProviderGit from '../UiSourceControlProvider/UiSourceControlProviderGit.ts'

const main = async (): Promise<void> => {
  await activateExtensionApi()

  for (const command of Object.values(ExtensionHostCommand)) {
    registerCommand(command)
  }

  registerSourceControlProvider(SourceControlProviderGit)
}

await main()
