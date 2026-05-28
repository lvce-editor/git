/* eslint-disable @typescript-eslint/prefer-readonly-parameter-types */
import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.merge'
export const skip = 1

declare const invoke: (command: string, ...args: readonly unknown[]) => Promise<unknown>
declare const vscode: {
  mkdir: (uri: string) => Promise<unknown>
  writeFile: (uri: string, content: string) => Promise<unknown>
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
        stdout: 'git version 2.34.1',
      }
    case 'init': {
      await vscode.mkdir(`${options.cwd}/.git`)
      return {
        exitCode: 0,
        stderr: '',
        stdout: '',
      }
    }
    case 'merge': {
      if (args[1] !== 'source/main') {
        throw new Error(`unexpected merge ref ${args[1]}`)
      }
      await vscode.writeFile(`${options.cwd}/added.txt`, 'merged content')
      return {
        exitCode: 0,
        stderr: '',
        stdout: '',
      }
    }
    default:
      throw new Error(`unexpected arguments ${args.join(' ')}`)
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
  const tmpDir = await FileSystem.getTmpDir()
  const workspaceDir = `${tmpDir}/target`
  const sourceDir = `${tmpDir}/source`

  await Workspace.setPath(tmpDir)
  await FileSystem.mkdir(workspaceDir)
  await FileSystem.writeFile(`${workspaceDir}/base.txt`, 'base')
  await FileSystem.mkdir(sourceDir)
  await FileSystem.writeFile(`${sourceDir}/added.txt`, 'merged content')
  await Git.init({
    initialBranch: 'main',
    uri: workspaceDir,
  })
  await Git.init({
    initialBranch: 'main',
    uri: sourceDir,
  })
  await Workspace.setPath(workspaceDir)

  // act
  await Command.execute('ExtensionHost.executeCommand', 'git.merge', 'source/main')

  // assert
  await FileSystem.shouldHaveFile(`${workspaceDir}/added.txt`, 'merged content')
}
