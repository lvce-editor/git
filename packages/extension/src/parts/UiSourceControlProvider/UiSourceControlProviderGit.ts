import * as Exec from '../Exec/Exec.ts'
import * as CommandAcceptInput from '../ExtensionHostCommand/ExtensionHostCommandGitAcceptInput.ts'
import * as CommandAdd from '../ExtensionHostCommand/ExtensionHostCommandGitAdd.ts'
import * as CommandFetch from '../ExtensionHostCommand/ExtensionHostCommandGitFetch.ts'
import * as GetBadgeCount from '../GetBadgeCount/GetBadgeCount.ts'
import * as GetChangedFiles from '../GetChangedFiles/GetChangedFiles.ts'
import * as GetFileBefore from '../GetFileBefore/GetFileBefore.ts'
import * as GetGroups from '../GetGroups/GetGroups.ts'
import * as GetDecorations from '../GetDecorations/GetDecorations.ts'
import * as IsActive from '../IsActive/IsActive.ts'
import * as StatusBarCheckout from '../StatusBarCheckout/StatusBarCheckout.ts'
import * as StatusBarSync from '../StatusBarSync/StatusBarSync.ts'

export const id = 'git'

export const label = 'Git'

export const acceptInput = CommandAcceptInput.execute

export const add = CommandAdd.execute

export const discard = CommandAdd.execute

export const isActive = IsActive.createIsActive({
  clearCheckout: StatusBarCheckout.clear,
  clearSync: StatusBarSync.clear,
  execute: Exec.exec,
  refreshCheckout: StatusBarCheckout.refresh,
  refreshSync: StatusBarSync.refresh,
})

export const getBadgeCount = GetBadgeCount.getBadgeCount

export const getChangedFiles = GetChangedFiles.getChangedFiles

export const getFileDecorations = GetDecorations.getDecorations

export const getGroups = GetGroups.getGroups

export const getFileBefore = GetFileBefore.getFileBefore

export const fetch = CommandFetch
