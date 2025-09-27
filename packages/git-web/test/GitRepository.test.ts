import { test, expect } from '@jest/globals'
import { GitRepository } from '../src/GitRepository/GitRepository.js'

test('getRepository creates new repository for new cwd', async () => {
  const repo1 = await GitRepository.getRepository('web://test1')
  const repo2 = await GitRepository.getRepository('web://test2')
  
  expect(repo1).toBeInstanceOf(GitRepository)
  expect(repo2).toBeInstanceOf(GitRepository)
  expect(repo1).not.toBe(repo2)
})

test('getRepository returns same instance for same cwd', async () => {
  const repo1 = await GitRepository.getRepository('web://test')
  const repo2 = await GitRepository.getRepository('web://test')
  
  expect(repo1).toBe(repo2)
})

test('getStatus returns initial status', async () => {
  const repo = await GitRepository.getRepository('web://test-status')
  const status = await repo.getStatus()
  
  expect(status).toContain('On branch main')
  expect(status).toContain('nothing to commit, working tree clean')
})

test('addFiles with specific files', async () => {
  const repo = await GitRepository.getRepository('web://test-add')
  await repo.addFiles(['file1.txt', 'file2.txt'])
  
  const status = await repo.getStatus()
  expect(status).toContain('Changes to be committed')
  expect(status).toContain('file1.txt')
  expect(status).toContain('file2.txt')
})

test('addFiles with dot adds all files', async () => {
  const repo = await GitRepository.getRepository('web://test-add-all')
  await repo.addFiles(['.'])
  
  const status = await repo.getStatus()
  expect(status).toContain('Changes to be committed')
})

test('commit creates new commit', async () => {
  const repo = await GitRepository.getRepository('web://test-commit')
  await repo.addFiles(['test.txt'])
  
  const hash = await repo.commit('Test commit message')
  
  expect(hash).toMatch(/^[a-f0-9]{40}$/)
})

test('commit clears staged files', async () => {
  const repo = await GitRepository.getRepository('web://test-commit-clear')
  await repo.addFiles(['test.txt'])
  await repo.commit('Test commit')
  
  const status = await repo.getStatus()
  expect(status).toContain('nothing to commit')
})

test('push simulates success', async () => {
  const repo = await GitRepository.getRepository('web://test-push')
  
  // Should not throw
  await expect(repo.push([])).resolves.toBeUndefined()
})

test('pull simulates success', async () => {
  const repo = await GitRepository.getRepository('web://test-pull')
  
  // Should not throw
  await expect(repo.pull([])).resolves.toBeUndefined()
})

test('fetch simulates success', async () => {
  const repo = await GitRepository.getRepository('web://test-fetch')
  
  // Should not throw
  await expect(repo.fetch([])).resolves.toBeUndefined()
})

test('checkout switches branch', async () => {
  const repo = await GitRepository.getRepository('web://test-checkout')
  await repo.checkout('feature-branch')
  
  const branches = await repo.listBranches()
  expect(branches).toContain('* feature-branch')
})

test('listBranches returns branch list', async () => {
  const repo = await GitRepository.getRepository('web://test-branches')
  const branches = await repo.listBranches()
  
  expect(branches).toContain('* main')
  expect(Array.isArray(branches)).toBe(true)
})

test('getCommits returns commit list', async () => {
  const repo = await GitRepository.getRepository('web://test-commits')
  const commits = await repo.getCommits()
  
  expect(Array.isArray(commits)).toBe(true)
  expect(commits.length).toBeGreaterThan(0)
  expect(commits[0]).toHaveProperty('hash')
  expect(commits[0]).toHaveProperty('author')
  expect(commits[0]).toHaveProperty('message')
})

test('getDiff returns diff output', async () => {
  const repo = await GitRepository.getRepository('web://test-diff')
  const diff = await repo.getDiff([])
  
  expect(diff).toContain('diff --git')
  expect(diff).toContain('--- a/')
  expect(diff).toContain('+++ b/')
})

test('parseRef with HEAD returns current commit', async () => {
  const repo = await GitRepository.getRepository('web://test-parse-ref')
  const hash = await repo.parseRef(['HEAD'])
  
  expect(hash).toMatch(/^[a-f0-9]{40}$/)
})

test('parseRef with branch name returns commit hash', async () => {
  const repo = await GitRepository.getRepository('web://test-parse-branch')
  const hash = await repo.parseRef(['main'])
  
  expect(hash).toMatch(/^[a-f0-9]{40}$/)
})

test('parseRef with unknown ref returns as-is', async () => {
  const repo = await GitRepository.getRepository('web://test-parse-unknown')
  const result = await repo.parseRef(['unknown-ref'])
  
  expect(result).toBe('unknown-ref')
})

test('listRefs returns ref list', async () => {
  const repo = await GitRepository.getRepository('web://test-refs')
  const refs = await repo.listRefs([])
  
  expect(Array.isArray(refs)).toBe(true)
  expect(refs.length).toBeGreaterThan(0)
  expect(refs[0]).toContain('refs/heads/main')
})

test('handleRemote with add adds remote', async () => {
  const repo = await GitRepository.getRepository('web://test-remote-add')
  const result = await repo.handleRemote(['add', 'upstream', 'https://github.com/upstream/repo.git'])
  
  expect(result).toContain("Remote 'upstream' added")
})

test('handleRemote with remove removes remote', async () => {
  const repo = await GitRepository.getRepository('web://test-remote-remove')
  const result = await repo.handleRemote(['remove', 'origin'])
  
  expect(result).toContain("Remote 'origin' removed")
})

test('handleRemote with show shows remote', async () => {
  const repo = await GitRepository.getRepository('web://test-remote-show')
  const result = await repo.handleRemote(['show', 'origin'])
  
  expect(result).toContain('origin')
  expect(result).toContain('https://github.com/user/repo.git')
})

test('handleRemote with list lists remotes', async () => {
  const repo = await GitRepository.getRepository('web://test-remote-list')
  const result = await repo.handleRemote(['list'])
  
  expect(result).toContain('origin')
  expect(result).toContain('https://github.com/user/repo.git')
})

test('handleConfig with --get gets config value', async () => {
  const repo = await GitRepository.getRepository('web://test-config-get')
  const result = await repo.handleConfig(['--get', 'user.name'])
  
  expect(result).toBe('User')
})

test('handleConfig with --set sets config value', async () => {
  const repo = await GitRepository.getRepository('web://test-config-set')
  const result = await repo.handleConfig(['--set', 'user.name', 'NewUser'])
  
  expect(result).toBe('')
  
  // Verify it was set
  const getResult = await repo.handleConfig(['--get', 'user.name'])
  expect(getResult).toBe('NewUser')
})

test('handleConfig with --list lists all config', async () => {
  const repo = await GitRepository.getRepository('web://test-config-list')
  const result = await repo.handleConfig(['--list'])
  
  expect(result).toContain('user.name=User')
  expect(result).toContain('user.email=user@example.com')
})

test('generateHash creates valid git hash', async () => {
  const repo = await GitRepository.getRepository('web://test-hash')
  
  // Access private method through any type
  const hash = (repo as any).generateHash()
  
  expect(hash).toMatch(/^[a-f0-9]{40}$/)
  expect(hash.length).toBe(40)
})
