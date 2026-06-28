import * as Exec from '../Exec/Exec.ts'
import * as CommandAcceptInput from '../ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.ts'
import * as CommandAdd from '../ExtensionHostCommand/ExtensionHostCommandGitAdd.ts'
import * as CommandFetch from '../ExtensionHostCommand/ExtensionHostCommandGitFetch.ts'
import * as GetBadgeCount from '../GetBadgeCount/GetBadgeCount.ts'
import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.ts'
import * as GetFileBefore from '../GetFileBefore/GetFileBefore.ts'
import * as GetGroups from '../GetGroups/GetGroups.ts'
import * as GetDecorations from '../GetDecorations/GetDecorations.ts'
import * as CommandId from '../CommandId/CommandId.ts'

export const id = 'git'

export const label = 'Git'

export const acceptInput = CommandAcceptInput.execute

export const add = CommandAdd.execute

export const discard = CommandAdd.execute

const supportedSchemes = ['file', '', 'memfs']

export const isActive = async (scheme, root) => {
  if (!root) {
    return false
  }
  if (!supportedSchemes.includes(scheme)) {
    return false
  }
  try {
    const { exitCode } = await Exec.exec('git', ['rev-parse', '--git-dir'], {
      cwd: root,
      reject: false,
    })
    return exitCode === 0
  } catch (error) {
    console.log({ error })
    return false
  }
}

export const getBadgeCount = GetBadgeCount.getBadgeCount

export const getChangedFiles = GetChangedFiles.getChangedFiles

export const getFileDecorations = GetDecorations.getDecorations

export const getGroups = GetGroups.getGroups

export const getFileBefore = GetFileBefore.getFileBefore

export const fetch = CommandFetch

export const statusBarCommands = [
  {
    text: 'select branch',
  },
]

export const handleClickBranch = () => {
  // TODO
}

export const getStatusBarItems = () => {
  return [
    {
      icon: 'branch',
      text: 'select branch',
      name: CommandId.GitShowBranchPicker,
      onClick: CommandId.GitShowBranchPicker,
    },
  ]
}
