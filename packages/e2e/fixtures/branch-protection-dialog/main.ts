import { activate, registerCommand } from '@lvce-editor/api'

let response: number | undefined
let options: unknown

await activate()
registerCommand({
  id: 'test.configureBranchDialog',
  execute: (value: number | undefined): void => {
    response = value
    options = undefined
  },
})
registerCommand({
  id: 'Dialog.showMessageBox',
  execute: (value: unknown): number | undefined => {
    options = value
    return response
  },
})
registerCommand({
  id: 'test.getBranchDialogOptions',
  execute: (): unknown => options,
})
