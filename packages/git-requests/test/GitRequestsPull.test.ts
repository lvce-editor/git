import * as GitRequestsPull from '../src/parts/GitRequestsPull/GitRequestsPull.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('pull - error - no user name configured', async () => {
  const exec = () => {
    throw new ExecError('Please tell me who you are.')
  }
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: Please tell me who you are.'))
})

test('pull - error - dirty working tree', async () => {
  const exec = () => {
    throw new ExecError('Pulling is not possible because you have unmerged files')
  }
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: Pulling is not possible because you have unmerged files'))
})

test('pull - error - cannot lock ref (1)', async () => {
  const exec = () => {
    throw new ExecError('cannot lock ref')
  }
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: cannot lock ref'))
})

test('pull - error - cannot lock ref (2)', async () => {
  const exec = () => {
    throw new ExecError('unable to update local ref')
  }
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: unable to update local ref'))
})

test('pull - error - cannot rebase onto multiple branches', async () => {
  const exec = () => {
    throw new ExecError('cannot rebase onto multiple branches')
  }
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: cannot rebase onto multiple branches'))
})

test('pull - error - remote connection error', async () => {
  const exec = () => {
    throw new ExecError('Could not read from remote repository')
  }
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: Could not read from remote repository'))
})

test('pull - error - not a git repository', async () => {
  const exec = () => {
    throw new ExecError('fatal: not a git repository')
  }
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: fatal: not a git repository'))
})

test('pull - error - unknown git error', async () => {
  const exec = () => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsPull.pull({
      cwd: '/test/test-folder',
      gitPath: '',
      exec,
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
