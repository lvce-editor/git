import * as CommandId from '../CommandId/CommandId.ts'
import * as ShowBranchPicker from './ShowBranchPicker.ts'

export const id = CommandId.GitShowBranchPicker

export const execute = ShowBranchPicker.showBranchPicker
