import { createWriteStream } from 'fs'

export const state = {
  stream: undefined,
}

export const trace = (message) => {
  if (!state.stream) {
    state.stream = createWriteStream('/tmp/git-log.txt')
  }
  state.stream.write(message)
  state.stream.write('\n')
}
