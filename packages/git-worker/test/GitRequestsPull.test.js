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

const GitRequestsPull = await import(
  '../src/parts/GitRequestsPull/GitRequestsPull.js'
)
const Exec = await import('../src/parts/Exec/Exec.js')

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('pull - error - no user name configured', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('Please tell me who you are.')
  })
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: Please tell me who you are.'))
})

test('pull - error - dirty working tree', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError(
      'Pulling is not possible because you have unmerged files'
    )
  })
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(
    new Error('Git: Pulling is not possible because you have unmerged files')
  )
})

test('pull - error - cannot lock ref (1)', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('cannot lock ref')
  })
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: cannot lock ref'))
})

test('pull - error - cannot lock ref (2)', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('unable to update local ref')
  })
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: unable to update local ref'))
})

test('pull - error - cannot rebase onto multiple branches', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('cannot rebase onto multiple branches')
  })
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: cannot rebase onto multiple branches'))
})

test('pull - error - remote connection error', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('Could not read from remote repository')
  })
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: Could not read from remote repository'))
})

test('pull - error - not a git repository', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('fatal: not a git repository')
  })
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: fatal: not a git repository'))
})

test('pull - error - unknown git error', async () => {
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: oops'))
})
