import { createWriteStream } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

export const state = {
  stream: undefined,
}

export const trace = (message) => {
  if (!state.stream) {
    const tmpDir = tmpdir()
    const gitLogPtah = join(tmpDir, 'git-log.txt')
    state.stream = createWriteStream(gitLogPtah)
  }
  state.stream.write(message)
  state.stream.write('\n')
}
