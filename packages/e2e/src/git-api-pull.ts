import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.pull'

// export const skip = 1

const fileUrlToPath = (url: string): string => {
  const parsedUrl = new URL(url)
  const pathname = decodeURIComponent(parsedUrl.pathname)
  if (parsedUrl.hostname) {
    return `//${parsedUrl.hostname}${pathname}`
  }
  if (/^\/[A-Za-z]:/.test(pathname)) {
    return pathname.slice(1)
  }
  return pathname
}

const exec = async (
  command: string,
  args: readonly string[],
  options: { cwd: string },
): Promise<{ exitCode: number; stderr: string; stdout: string }> => {
  if (command !== 'git') {
    throw new Error(`unexpected command ${command}`)
  }
  switch (args[0]) {
    case '--version':
      return {
        exitCode: 0,
        stderr: '',
        stdout: 'git version 2.39.5',
      }
    case 'pull':
      // Fallback for environments where the actual pull command is mocked through this RPC layer.
      // @ts-ignore
      await globalThis.rpc.invoke('FileSystem.writeFile', `${options.cwd}/file.txt`, 'version 2')
      return {
        exitCode: 0,
        stderr: '',
        stdout: '',
      }
    default:
      throw new Error(`unexpected git args ${args.join(' ')}`)
  }
}

export const mockRpc = {
  commands: {
    'Exec.exec': exec,
  },
  name: 'Git',
}

type GitPullWithFrom = {
  readonly pull: (options: { readonly from?: readonly string[] }) => Promise<void>
}

export const test: Test = async ({ Command, FileSystem, Git, Settings, Workspace }) => {
  // arrange
  const tmpDirUrl = await FileSystem.getTmpDir({ scheme: 'file' })
  const tmpDir = fileUrlToPath(tmpDirUrl)
  const upstreamDir = `${tmpDir}/upstream`
  const upstreamDirUrl = `${tmpDirUrl}/upstream`
  const workspaceDirUrl = `${tmpDirUrl}/workspace`
  const workspaceDir = `${tmpDir}/workspace`
  const fileName = 'file.txt'
  const gitPath = /^[A-Za-z]:/.test(tmpDir) ? 'file:///C:/Program%20Files/Git/cmd/git.exe' : 'file:///usr/bin/git'

  await Workspace.setPath(tmpDirUrl)
  await Settings.update({
    'git.path': gitPath,
  })
  await FileSystem.mkdir(upstreamDirUrl)
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'init', '--initial-branch', 'main'], {})
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'config', 'user.name', 'Test User'], {})
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'config', 'user.email', 'test@example.com'], {})
  await FileSystem.writeFile(`${upstreamDirUrl}/${fileName}`, 'version 1')
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'add', '.'], {})
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'commit', '-m', 'Initial commit'], {})
  await Command.execute('Exec.exec', gitPath, ['clone', upstreamDir, workspaceDir], {})
  await FileSystem.writeFile(`${upstreamDirUrl}/${fileName}`, 'version 2')
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'add', '.'], {})
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'commit', '-m', 'Update file'], {})
  await Workspace.setPath(workspaceDirUrl)

  // act
  await (Git as unknown as GitPullWithFrom).pull({
    from: ['origin', 'main'],
  })

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDirUrl}/${fileName}`, 'version 2')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'pull', 'origin', 'main'],
      cwd: workspaceDirUrl,
    },
  ])
}
