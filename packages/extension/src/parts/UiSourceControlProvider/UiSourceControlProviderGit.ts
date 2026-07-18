import * as Exec from '../Exec/Exec.ts'
import * as CommandAcceptInput from '../ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.ts'
import * as CommandAdd from '../ExtensionHostCommand/ExtensionHostCommandGitAdd.ts'
import * as CommandFetch from '../ExtensionHostCommand/ExtensionHostCommandGitFetch.ts'
import * as GetBadgeCount from '../GetBadgeCount/GetBadgeCount.ts'
import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.ts'
import * as GetFileBefore from '../GetFileBefore/GetFileBefore.ts'
import * as GetGroups from '../GetGroups/GetGroups.ts'
import * as GetDecorations from '../GetDecorations/GetDecorations.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'

export const id = 'git'

export const label = 'Git'

export const acceptInput = CommandAcceptInput.execute

export const add = CommandAdd.execute

export const discard = CommandAdd.execute

const supportedSchemes = ['file', '', 'memfs']

export const isActive = async (scheme, root) => {
  if (!root) {
    await StatusBarCheckout.clear()
    return false
  }
  if (!supportedSchemes.includes(scheme)) {
    await StatusBarCheckout.clear()
    return false
  }
  try {
    const { exitCode } = await Exec.exec('git', ['rev-parse', '--git-dir'], {
      cwd: root,
      reject: false,
    })
    const isGitRepository = exitCode === 0
    if (isGitRepository) {
      await StatusBarCheckout.refresh(root)
    } else {
      await StatusBarCheckout.clear()
    }
    return isGitRepository
  } catch (error) {
    console.log({ error })
    await StatusBarCheckout.clear()
    return false
  }
}

export const getBadgeCount = GetBadgeCount.getBadgeCount

export const getChangedFiles = GetChangedFiles.getChangedFiles

export const getFileDecorations = GetDecorations.getDecorations

export const getGroups = GetGroups.getGroups

export const getFileBefore = GetFileBefore.getFileBefore

export const fetch = CommandFetch
