import { test, expect } from '@jest/globals'
import { GitRepository } from '../src/GitRepository/GitRepository.ts'
import { registerMockRpc } from '../src/RegisterMockRpc/RegisterMockRpc.ts'

<<<<<<< Updated upstream
test.skip('getRepository creates new repository for new cwd', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('getRepository creates new repository for new cwd', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const repo1 = await GitRepository.getRepository('web://test1')
  const repo2 = await GitRepository.getRepository('web://test2')

  expect(repo1).toBeInstanceOf(GitRepository)
  expect(repo2).toBeInstanceOf(GitRepository)
  expect(repo1).not.toBe(repo2)
})

<<<<<<< Updated upstream
test.skip('getRepository returns same instance for same cwd', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('getRepository returns same instance for same cwd', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists
    },
  })

  const repo1 = await GitRepository.getRepository('web://test')
  const repo2 = await GitRepository.getRepository('web://test')

  expect(repo1).toStrictEqual(repo2)
})

<<<<<<< Updated upstream
test.skip('getStatus returns initial status', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('getStatus returns initial status', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      if (path.endsWith('.git/config')) {
        return true
      }

      return false
    },
    'FileSystem.read'(path: string) {
      if (path.endsWith('.git/HEAD')) {
        return 'ref: refs/heads/main\n'
      }

      return ''
    },
  })

  const repo = await GitRepository.getRepository('web://test-status')
  const status = await repo.getStatus()

  expect(status).toContain('On branch main')
  expect(status).toContain('nothing to commit, working tree clean')
})

<<<<<<< Updated upstream
test.skip('addFiles with specific files', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('addFiles with specific files', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-add')
  await repo.addFiles(['file1.txt', 'file2.txt'])

  const status = await repo.getStatus()
  expect(status).toContain('Changes to be committed')
  expect(status).toContain('file1.txt')
  expect(status).toContain('file2.txt')
})

<<<<<<< Updated upstream
test.skip('addFiles with dot adds all files', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('addFiles with dot adds all files', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-add-all')
  await repo.addFiles(['.'])

  const status = await repo.getStatus()
  expect(status).toContain('Changes to be committed')
})

<<<<<<< Updated upstream
test.skip('commit creates new commit', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('commit creates new commit', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-commit')
  await repo.addFiles(['test.txt'])

  const hash = await repo.commit('Test commit message')

  expect(hash).toMatch(/^[a-f\d]{40}$/)
})

<<<<<<< Updated upstream
test.skip('commit clears staged files', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('commit clears staged files', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-commit-clear')
  await repo.addFiles(['test.txt'])
  await repo.commit('Test commit')

  const status = await repo.getStatus()
  expect(status).toContain('Untracked files')
})

<<<<<<< Updated upstream
test.skip('push simulates success', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('push simulates success', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-push')

  // Should not throw
  await expect(repo.push([])).resolves.toBeUndefined()
})

<<<<<<< Updated upstream
test.skip('pull simulates success', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('pull simulates success', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-pull')

  // Should not throw
  await expect(repo.pull([])).resolves.toBeUndefined()
})

<<<<<<< Updated upstream
test.skip('fetch simulates success', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('fetch simulates success', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-fetch')

  // Should not throw
  await expect(repo.fetch([])).resolves.toBeUndefined()
})

<<<<<<< Updated upstream
test.skip('checkout switches branch', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('checkout switches branch', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-checkout')
  await repo.checkout('main') // Checkout existing branch

  const branches = await repo.listBranches()
  expect(branches).toContain('* main')
})

<<<<<<< Updated upstream
test.skip('listBranches returns branch list', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('listBranches returns branch list', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-branches')
  const branches = await repo.listBranches()

  expect(branches).toContain('* main')
  expect(Array.isArray(branches)).toBe(true)
})

<<<<<<< Updated upstream
test.skip('getCommits returns commit list', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('getCommits returns commit list', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-commits')
  const commits = await repo.getCommits()

  expect(Array.isArray(commits)).toBe(true)
  expect(commits.length).toBeGreaterThan(0)
  expect(commits[0]).toHaveProperty('hash')
  expect(commits[0]).toHaveProperty('author')
  expect(commits[0]).toHaveProperty('message')
})

<<<<<<< Updated upstream
test.skip('getDiff returns diff output', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('getDiff returns diff output', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-diff')
  const diff = await repo.getDiff([])

  expect(diff).toContain('diff --git')
  expect(diff).toContain('--- a/')
  expect(diff).toContain('+++ b/')
})

<<<<<<< Updated upstream
test.skip('parseRef with HEAD returns current commit', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('parseRef with HEAD returns current commit', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-parse-ref')
  const hash = await repo.parseRef(['HEAD'])

  expect(hash).toMatch(/^[a-f\d]{40}$/)
})

<<<<<<< Updated upstream
test.skip('parseRef with branch name returns commit hash', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('parseRef with branch name returns commit hash', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-parse-branch')
  const hash = await repo.parseRef(['main'])

  expect(hash).toMatch(/^[a-f\d]{40}$/)
})

<<<<<<< Updated upstream
test.skip('parseRef with unknown ref returns as-is', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('parseRef with unknown ref returns as-is', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-parse-unknown')
  const result = await repo.parseRef(['unknown-ref'])

  expect(result).toBe('unknown-ref')
})

<<<<<<< Updated upstream
test.skip('listRefs returns ref list', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('listRefs returns ref list', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-refs')
  const refs = await repo.listRefs([])

  expect(Array.isArray(refs)).toBe(true)
  expect(refs.length).toBeGreaterThan(0)
  expect(refs[0]).toContain('refs/heads/main')
})

<<<<<<< Updated upstream
test.skip('handleRemote with add adds remote', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('handleRemote with add adds remote', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-remote-add')
  const result = await repo.handleRemote(['add', 'upstream', 'https://github.com/upstream/repo.git'])

  expect(result).toContain("Remote 'upstream' added")
})

<<<<<<< Updated upstream
test.skip('handleRemote with remove removes remote', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('handleRemote with remove removes remote', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-remote-remove')
  const result = await repo.handleRemote(['remove', 'origin'])

  expect(result).toContain("Remote 'origin' removed")
})

<<<<<<< Updated upstream
test.skip('handleRemote with show shows remote', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('handleRemote with show shows remote', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-remote-show')
  const result = await repo.handleRemote(['show', 'origin'])

  expect(result).toContain('origin')
  expect(result).toContain('https://github.com/user/repo.git')
})

<<<<<<< Updated upstream
test.skip('handleRemote with list lists remotes', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('handleRemote with list lists remotes', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-remote-list')
  const result = await repo.handleRemote(['list'])

  expect(result).toContain('origin')
  expect(result).toContain('https://github.com/user/repo.git')
})

<<<<<<< Updated upstream
test.skip('handleConfig with --get gets config value', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('handleConfig with --get gets config value', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-config-get')
  const result = await repo.handleConfig(['--get', 'user.name'])

  expect(result).toBe('User')
})

<<<<<<< Updated upstream
test.skip('handleConfig with --set sets config value', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('handleConfig with --set sets config value', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-config-set')
  const result = await repo.handleConfig(['--set', 'user.name', 'NewUser'])

  expect(result).toBe('')

  // Verify it was set
  const getResult = await repo.handleConfig(['--get', 'user.name'])
  expect(getResult).toBe('NewUser')
})

<<<<<<< Updated upstream
test.skip('handleConfig with --list lists all config', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('handleConfig with --list lists all config', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-config-list')
  const result = await repo.handleConfig(['--list'])

  expect(result).toContain('user.name=User')
  expect(result).toContain('user.email=user@example.com')
})

<<<<<<< Updated upstream
test.skip('generateHash creates valid git hash', async (): Promise<void> => {
  const mockRpc = registerMockRpc({
=======
test('generateHash creates valid git hash', async () => {
  registerMockRpc({
>>>>>>> Stashed changes
    'FileSystem.exists'(path: string) {
      return false // No git config exists, use in-memory mode
    },
  })

  const repo = await GitRepository.getRepository('web://test-hash')

  // Access private method through any type
  const hash = (repo as any).generateHash()

  expect(hash).toMatch(/^[a-f\d]{40}$/)
  expect(hash.length).toBe(40)
})
