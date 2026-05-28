import * as GitRequestsPush from '../src/parts/GitRequestsPush/GitRequestsPush.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    // @ts-ignore
    this.stderr = stderr
  }
}

test('push - error - push rejected', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('error: failed to push some refs to')
  }
  await expect(
    GitRequestsPush.push({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: error: failed to push some refs to'))
})

test('push - error - could not read from remote repository', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('Could not read from remote repository')
  }

  await expect(
    GitRequestsPush.push({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: Could not read from remote repository'))
})

test('push - error - no upstream branch', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('fatal: The current branch abc has no upstream branch')
  }
  await expect(
    GitRequestsPush.push({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: fatal: The current branch abc has no upstream branch'))
})

test('push - error - no configured push destination', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError(`fatal: No configured push destination.
    Either specify the URL from the command-line or configure a remote repository using

        git remote add <name> <url>

    and then push using the remote name

        git push <name>
    `)
  }
  await expect(
    GitRequestsPush.push({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error(`Git: fatal: No configured push destination.`))
})

test('push - error - permission denied', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('Permission denied')
  }
  await expect(
    GitRequestsPush.push({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: Permission denied'))
})

test('push - error - unknown git error', async (): Promise<void> => {
  const exec = (): never => {
    throw new ExecError('oops')
  }
  await expect(
    GitRequestsPush.push({
      cwd: '/test/test-folder',
      exec,
      gitPath: '',
    }),
  ).rejects.toThrow(new Error('Git: oops'))
})
