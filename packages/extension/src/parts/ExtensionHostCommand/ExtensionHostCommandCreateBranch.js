import * as CommandId from '../CommandId/CommandId.js'

export const id = CommandId.GitCreateBranch

export const execute = async () => {
  // TODO show quick input, asking to enter a branch name
  // @ts-ignore
  const { canceled, inputValue } = await vscode.showQuickInput({
    ignoreFocusOut: true,
    render(state) {
      return {
        subtitleType: 'info',
        subtitle: 'Please provide a new branch name',
        placeholder: 'Branch Name',
        validationMessage: '',
      }
    },
  })

  if (canceled) {
    return
  }

  // TODO create a branch with the input value name
  // if an error occurs, show a dialog
}
