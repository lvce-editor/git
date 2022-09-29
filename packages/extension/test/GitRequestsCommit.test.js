import { jest } from '@jest/globals'
import * as Exec from '../src/parts/Exec/Exec.js'
import * as GitRequestsCommit from '../src/parts/GitRequestsCommit/GitRequestsCommit.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('commit - error - unmerged files', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('not possible because you have unmerged files')
  })
  await expect(
    GitRequestsCommit.commit({
      message: '',
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(
    new Error('Git: not possible because you have unmerged files')
  )
})

test('commit - error - nothing to commit', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('On branch main\nnothing to commit, working tree clean')
  })
  await expect(
    GitRequestsCommit.commit({
      message: '',
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: nothing to commit'))
})

test('commit - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequestsCommit.commit({
      message: '',
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})
