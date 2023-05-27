export const create = async ({ url, name }) => {
  const ipc = await vscode.createWorker({
    method: 'moduleWorker',
    url,
    name,
  })
  return ipc
}

export const wrap = (ipc) => {
  return {
    ipc,
    send(message) {
      this.ipc.send(message)
    },
    set onmessage(listener) {
      this.ipc.onmessage = listener
    },
  }
}
