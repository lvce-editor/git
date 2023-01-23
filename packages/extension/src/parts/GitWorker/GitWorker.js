export const intialize = async () => {
  const workerUrl = new URL(
    '../../../../git-worker/src/gitWorkerMain.js',
    import.meta.url
  )
  const worker = new Worker(workerUrl, {
    type: 'module',
    name: 'Git Worker',
  })
  console.log({ worker })
  // TODO
}

export const invoke = async (method, params) => {
  // TODO
}
