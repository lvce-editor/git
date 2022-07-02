import { jest } from '@jest/globals'
import { stderr } from 'process'
import * as Exec from '../src/parts/Exec/Exec.js'
import * as GitRequests from '../src/parts/GitRequests/GitRequests.js'

class ExecError extends Error {
  constructor(stderr) {
    super('')
    this.stderr = stderr
  }
}

test('add - error - not a git repository', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('fatal: not a git repository')
  })
  await expect(
    GitRequests.add({
      cwd: '',
      file: '.',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: fatal: not a git repository'))
})

test('add - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequests.add({
      cwd: '/test/test-folder',
      file: '.',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})

test('checkout - error - pathspec did not match any files known to git', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError(
      `error: pathspec 'abc' did not match any file(s) known to git`
    )
  })
  await expect(
    GitRequests.checkout({
      cwd: '',
      ref: 'abc',
      gitPath: '',
    })
  ).rejects.toThrowError(
    new Error(
      `Git: error: pathspec 'abc' did not match any file(s) known to git`
    )
  )
})

test('checkout - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequests.checkout({
      ref: '',
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})

test('commit - error - unmerged files', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('not possible because you have unmerged files')
  })
  await expect(
    GitRequests.commit({
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
    GitRequests.commit({
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
    GitRequests.commit({
      message: '',
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})

test('deleteBranch - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequests.deleteBranch({
      name: '',
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})

test('getModifiedFiles', async () => {
  Exec.state.exec = jest.fn(async () => {
    return {
      stdout: ` M extensions/builtin.git/src/parts/GitRequests/GitRequests.js
 M packages/extension-host/src/parts/InternalCommand/InternalCommand.js`,
      stderr: '',
      exitCode: 0,
    }
  })
  expect(
    await GitRequests.getModifiedFiles({
      cwd: '',
      gitPath: '',
    })
  ).toEqual({
    count: 2,
    gitRoot: '',
    index: [],
    merge: [],
    untracked: [],
    workingTree: [
      {
        file: 'extensions/builtin.git/src/parts/GitRequests/GitRequests.js',
        status: 1,
      },
      {
        file: 'packages/extension-host/src/parts/InternalCommand/InternalCommand.js',
        status: 1,
      },
    ],
  })
})

test('getModifiedFiles - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequests.getModifiedFiles({
      cwd: '',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})

test('pull - error - no user name configured', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('Please tell me who you are.')
  })
  await expect(
    GitRequests.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: Please tell me who you are.'))
})

test('pull - error - dirty working tree', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError(
      'Pulling is not possible because you have unmerged files'
    )
  })
  await expect(
    GitRequests.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(
    new Error('Git: Pulling is not possible because you have unmerged files')
  )
})

test('pull - error - cannot lock ref (1)', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('cannot lock ref')
  })
  await expect(
    GitRequests.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: cannot lock ref'))
})

test('pull - error - cannot lock ref (2)', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('unable to update local ref')
  })
  await expect(
    GitRequests.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: unable to update local ref'))
})

test('pull - error - cannot rebase onto multiple branches', async () => {
  Exec.state.exec = jest.fn(async () => {
    throw new ExecError('cannot rebase onto multiple branches')
  })
  await expect(
    GitRequests.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: cannot rebase onto multiple branches'))
})

test('pull - error - remote connection error', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError('Could not read from remote repository')
  })
  await expect(
    GitRequests.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: Could not read from remote repository'))
})

test('pull - error - not a git repository', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError('fatal: not a git repository')
  })
  await expect(
    GitRequests.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: fatal: not a git repository'))
})

test('pull - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequests.pull({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: oops'))
})

test('push - error - push rejected', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError('error: failed to push some refs to')
  })
  await expect(
    GitRequests.push({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: error: failed to push some refs to'))
})

test('push - error - could not read from remote repository', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError('Could not read from remote repository')
  })

  await expect(
    GitRequests.push({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: Could not read from remote repository'))
})

test('push - error - no upstream branch', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError('fatal: The current branch abc has no upstream branch')
  })
  await expect(
    GitRequests.push({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(
    new Error('Git: fatal: The current branch abc has no upstream branch')
  )
})

test('push - error - no configured push destination', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError(`fatal: No configured push destination.
    Either specify the URL from the command-line or configure a remote repository using

        git remote add <name> <url>

    and then push using the remote name

        git push <name>
    `)
  })
  await expect(
    GitRequests.push({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(
    new Error(`Git: fatal: No configured push destination.`)
  )
})

test('push - error - permission denied', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError('Permission denied')
  })
  await expect(
    GitRequests.push({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrow(new Error('Git: Permission denied'))
})

test('push - error - unknown git error', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError('oops')
  })
  await expect(
    GitRequests.push({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: oops'))
})

test('tag - error - tag already exists', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new ExecError(`fatal: tag 'abc' already exists`)
  })
  await expect(
    GitRequests.tag({
      tag: 'v0.1',
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error("Git: fatal: tag 'abc' already exists"))
})

test('version', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    return {
      stdout: 'git version 2.34.1',
      stderr: '',
    }
  })
  expect(
    await GitRequests.version({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).toBe('2.34.1')
})

test('version - error', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new TypeError(`x is not a function`)
  })
  await expect(
    GitRequests.version({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: x is not a function'))
})

test('getRefs', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    return {
      stdout: `refs/remotes/origin/HEAD 903f9903f4f14e0d7ec1a389b9da617848e7f609\u0020
refs/remotes/origin/main 903f9903f4f14e0d7ec1a389b9da617848e7f609\u0020
refs/remotes/origin/sandy081/powerful-flea 903f9903f4f14e0d7ec1a389b9da617848e7f609\u0020
refs/remotes/origin/lszomoru/product-build-parallel 7ed03031bb8511eada0f8418550e33a70e208106\u0020`,
      stderr: '',
    }
  })
  expect(
    await GitRequests.getRefs({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).toEqual([
    {
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      name: 'origin/HEAD',
      remote: 'origin',
      type: 'remoteHead',
    },
    {
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      name: 'origin/main',
      remote: 'origin',
      type: 'remoteHead',
    },
    {
      commit: '903f9903f4f14e0d7ec1a389b9da617848e7f609',
      name: 'origin/sandy081/powerful-flea',
      remote: 'origin',
      type: 'remoteHead',
    },
    {
      commit: '7ed03031bb8511eada0f8418550e33a70e208106',
      name: 'origin/lszomoru/product-build-parallel',
      remote: 'origin',
      type: 'remoteHead',
    },
  ])
})

test('getRefs - error', async () => {
  Exec.state.exec = jest.fn(async (command, args) => {
    throw new TypeError(`x is not a function`)
  })
  await expect(
    GitRequests.getRefs({
      cwd: '/test/test-folder',
      gitPath: '',
    })
  ).rejects.toThrowError(new Error('Git: x is not a function'))
})
