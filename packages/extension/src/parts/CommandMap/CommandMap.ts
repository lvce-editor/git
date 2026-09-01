import * as Config from '../Config/Config.ts'
import * as Exec from '../Exec/Exec.ts'
import * as ExtensionCommandType from '../ExtensionCommandType/ExtensionCommandType.ts'
import * as QuickPick from '../QuickPick/QuickPick.ts'

export const commandMap = {
  [ExtensionCommandType.ExecExec]: Exec.exec,
  [ExtensionCommandType.QuickPickShow]: QuickPick.show,
  [ExtensionCommandType.QuickPickShowInput]: QuickPick.showInput,
  [ExtensionCommandType.ConfigGetWorkspaceFolder]: Config.getWorkspaceFolder,
  [ExtensionCommandType.ConfigGetGitPaths]: Config.getGitPaths,
  [ExtensionCommandType.ConfigConfirmDiscard]: Config.confirmDiscard,
  [ExtensionCommandType.ConfirmPrompt]: Config.confirmPrompt,
  [ExtensionCommandType.ConfigShowErrorMessage]: Config.showErrorMessage,
  ['Config.getDefaultCloneLocation']: Config.getDefaultCloneLocation,
  ['Platform.getUserDataDir']: Config.getUserDataDir,
  ['Workspace.setWorkspaceUri']: Config.setWorkspaceUri,
  ['FileSystem.exists']: Config.exists,
  ['FileSystem.mkdir']: Config.mkdir,
  ['FileSystem.remove']: Config.remove,
  ['FileSystem.write']: Config.write,
  ['FileSystem.writeFile']: Config.write,
  ['FileSystem.read']: Config.readFile,
  ['FileSystem.readdir']: Config.readDir,
  ['FileSystem.stat']: Config.stat,
  ['Layout.handleWorkspaceRefresh']: Config.handleWorkspaceRefresh,
  ['Main.openUri']: Config.openUri,
}
