// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.ts'

export const testWorker = async ({ execMap, config = {}, quickPick = () => {} }) => {
  const invocations = []
  const fullExecMap = {
    '--version': {
      stdout: 'git version 2.39.2',
      stderr: '',
      exitCode: 0,
    },
    ...execMap,
  }
  const fullConfig = {
    ...config,
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const rpc = {
    invoke(...args) {
      // @ts-ignore
      invocations.push(args)
      switch (args[0]) {
      case 'Exec.exec': {
        const result = fullExecMap[args[2][0]]
        if (!result) {
          throw new Error(`exec command not found ${args[2][0]}`)
        }
        return result
      }
      case 'Config.getGitPaths': {
        // @ts-ignore
        return fullConfig.gitPaths
      }
      case 'Config.getWorkspaceFolder': {
        // @ts-ignore
        return fullConfig.workspaceFolder
      }
      case 'Config.confirmDiscard': {
        // @ts-ignore
        return fullConfig.confirmDiscard
      }
      case 'Config.showErrorMessage': {
        // @ts-ignore
        return fullConfig.showErrorMessage
      }
      case 'QuickPick.show': {
        return quickPick()
      }
      default: {
        throw new Error(`unknown command ${args[0]}`)
      }
      }
    },
  }
  const worker = await startWorker(rpc)
  return {
    execute(...args) {
      // @ts-ignore
      return worker.execute(...args)
    },
    invocations,
  }
}
