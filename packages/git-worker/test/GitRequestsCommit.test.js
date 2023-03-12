import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Exec/Exec.js', () => {
  return {
    exec: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const GitRequestsCommit = await import(
  '../src/parts/GitRequestsCommit/GitRequestsCommit.js'
)
const Exec = await import('../src/parts/Exec/Exec.js')

// TODO mock exec instead

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('commit - error - unmerged files', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
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
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
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
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
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
