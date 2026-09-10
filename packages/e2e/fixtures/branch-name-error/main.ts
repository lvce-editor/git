import { activate, registerCommand } from '@lvce-editor/api'

let message: string | undefined

await activate()
registerCommand({
  id: 'ConfirmPrompt.prompt',
  execute: (value: string): boolean => {
    message = value
    return true
  },
})
registerCommand({
  id: 'test.getBranchNameError',
  execute: (): string | undefined => message,
})
