import * as GitRefType from '../GitRefType/GitRefType.ts'
import * as QuickPickIcon from '../QuickPickIcon/QuickPickIcon.ts'

export const getBranchQuickPickIcon = (refType: string): string => {
  switch (refType) {
    case GitRefType.RemoteHead:
      return QuickPickIcon.Cloud
    case GitRefType.Tag:
      return QuickPickIcon.Tag
    default:
      return QuickPickIcon.SourceControl
  }
}
