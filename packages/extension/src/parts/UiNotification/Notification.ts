export const show = (type, message) => {
  // @ts-ignore
  vscode.showNotification(type, message)
}

export const showWithOptions = async (type, message, options) => {
  // @ts-ignore
  const selectedOption = await vscode.showNotificationWithOptions(type, message, options)
  return selectedOption
}
