/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.pull'

// export const skip = 1

let workspaceDir = ''

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
      await globalThis.rpc.invoke('FileSystem.writeFile', `${workspaceDir}/file.txt`, 'version 2')
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

export const test: Test = async ({ Command, FileSystem, Git, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const upstreamDir = `${tmpDir}/upstream`
  workspaceDir = `${tmpDir}/workspace`
  const fileName = 'file.txt'
  const gitPath = 'file:///usr/bin/git'

  await Workspace.setPath(tmpDir)
  await FileSystem.mkdir(upstreamDir)
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'init', '--initial-branch', 'main'])
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'config', 'user.name', 'Test User'])
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'config', 'user.email', 'test@example.com'])
  await FileSystem.writeFile(`${upstreamDir}/${fileName}`, 'version 1')
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'add', '.'])
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'commit', '-m', 'Initial commit'])
  await Command.execute('Exec.exec', gitPath, ['clone', upstreamDir, workspaceDir])
  await FileSystem.writeFile(`${upstreamDir}/${fileName}`, 'version 2')
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'add', '.'])
  await Command.execute('Exec.exec', gitPath, ['-C', upstreamDir, 'commit', '-m', 'Update file'])
  await Workspace.setPath(workspaceDir)

  // act
  await Git.pull('origin', 'main')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/${fileName}`, 'version 2')
  await Git.shouldHaveInvocations([
    {
      command: ['git', 'pull'],
      cwd: workspaceDir,
    },
  ])
}
