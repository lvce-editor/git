import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.create-worktree-path-with-spaces'

const fileUriToPath = (uri: string): string => {
  const pathname = decodeURIComponent(new URL(uri).pathname)
  return /^\/[A-Za-z]:/.test(pathname) ? pathname.slice(1) : pathname
}

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const workspaceDir = `${tmpDir}/workspace`
  const worktreeDir = `${tmpDir}/feature%20worktree`
  const worktreePath = fileUriToPath(worktreeDir)
  const worktreeInvocationPath = decodeURIComponent(worktreeDir)
  await Workspace.setPath(tmpDir)
  await Command.execute('ExtensionHost.executeCommand', 'git.loadFixture', import.meta.resolve('../fixtures/git-api-branch'))
  await Workspace.setPath(workspaceDir)
  await Git.createTag('worktree-source')

  await Git.createWorktree(worktreePath, 'worktree-source')

  await Git.shouldHaveInvocations([
    {
      command: ['git', 'worktree', 'add', worktreeInvocationPath, 'worktree-source'],
      cwd: workspaceDir,
    },
  ])
}
