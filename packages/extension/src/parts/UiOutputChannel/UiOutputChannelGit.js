export const state = {
  outputChannel: undefined,
}

export const append = async (message) => {
  if (!state.outputChannel) {
    state.outputChannel = await vscode.createOutputChannel({ id: 'git' })
  }
  state.outputChannel.append(message)
}
