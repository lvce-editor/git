import * as Exec from '../Exec/Exec.js'
import * as CommandAcceptInput from '../ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.js'
import * as CommandAdd from '../ExtensionHostCommand/ExtensionHostCommandGitAdd.js'
import * as CommandFetch from '../ExtensionHostCommand/ExtensionHostCommandGitFetch.js'
import * as GetBadgeCount from '../GetBadgeCount/GetBadgeCount.js'
import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.js'
import * as GetFileBefore from '../GetFileBefore/GetFileBefore.js'
import * as GetGroups from '../GetGroups/GetGroups.js'

export const id = 'git'

export const label = 'Git'

export const acceptInput = CommandAcceptInput.execute

export const add = CommandAdd.execute

export const discard = CommandAdd.execute

export const isActive = async (scheme, root) => {
  if (scheme !== '') {
    return false
  }
  try {
    const {} = await Exec.exec('git', ['rev-parse', '--git-dir'], {
      cwd: root,
    })
    return true
  } catch (error) {
    console.log({ error })
    return false
  }
}

export const getBadgeCount = GetBadgeCount.getBadgeCount

export const getChangedFiles = GetChangedFiles.getChangedFiles

export const getGroups = GetGroups.getGroups

export const getFileBefore = GetFileBefore.getFileBefore

export const fetch = CommandFetch

export const statusBarCommands = []
