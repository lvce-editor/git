import * as GitRefType from '../GitRefType/GitRefType.ts'
import * as QuickPickIcon from '../QuickPickIcon/QuickPickIcon.ts'

export const getBranchQuickPickIcon = (refType: number): number => {
  switch (refType) {
    case GitRefType.RemoteHead:
      return QuickPickIcon.Cloud
    case GitRefType.Tag:
      return QuickPickIcon.Tag
    default:
      return QuickPickIcon.SourceControl
  }
}
