import * as GitRefType from '../GitRefType/GitRefType.js'
import * as QuickPickIcon from '../QuickPickIcon/QuickPickIcon.js'

export const getBranchQuickPickIcon = (refType) => {
  switch (refType) {
    case GitRefType.RemoteHead:
      return QuickPickIcon.Cloud
    case GitRefType.Tag:
      return QuickPickIcon.Tag
    default:
      return QuickPickIcon.SourceControl
  }
}
