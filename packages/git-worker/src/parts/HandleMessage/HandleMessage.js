import * as GitWorkerPull from '../GitWorkerPull/GitWorkerPull.js'

const getFn = (method) => {
  switch (method) {
    case 'Git.pull':
      return GitWorkerPull.pull
    default:
      throw new Error(`method not found ${method}`)
  }
}

export const handleMessage = async (event) => {
  const { data } = event
  const { method, params } = data
  console.log({ data })
  const fn = getFn(method)
  const result = await fn(...params)
  // TODO
  console.log(data)
}
