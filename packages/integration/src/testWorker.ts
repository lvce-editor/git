// TODO add integration tests for git worker
// send and receive messages

import { startWorker } from './startWorker.ts'

type ExecResult = {
  exitCode: number
  stderr: string
  stdout: string
}

type TestWorkerOptions = {
  readonly config?: Readonly<Record<string, any>>
  readonly execMap: Readonly<Record<string, ExecResult>>
  readonly quickPick?: () => any
}

export const testWorker = async ({ config = {}, execMap, quickPick = (): any => undefined }: TestWorkerOptions): Promise<{ execute(...args: readonly any[]): any; invocations: any[] }> => {
  const invocations: any[] = []
  const fullExecMap = {
    '--version': {
      exitCode: 0,
      stderr: '',
      stdout: 'git version 2.39.2',
    },
    ...execMap,
  }
  const fullConfig = {
    ...config,
    gitPaths: ['git'],
    workspaceFolder: '/test',
  }
  const rpc = {
    invoke(...args: readonly any[]): any {
      invocations.push(args)
      switch (args[0]) {
        case 'Config.confirmDiscard': {
          // @ts-ignore
          return fullConfig.confirmDiscard
        }
        case 'Config.getGitPaths': {
          // @ts-ignore
          return fullConfig.gitPaths
        }
        case 'Config.getWorkspaceFolder': {
          // @ts-ignore
          return fullConfig.workspaceFolder
        }
        case 'Config.showErrorMessage': {
          // @ts-ignore
          return fullConfig.showErrorMessage
        }
        case 'Exec.exec': {
          const result = fullExecMap[args[2][0]]
          if (!result) {
            throw new Error(`exec command not found ${args[2][0]}`)
          }
          return result
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
    execute(...args: readonly any[]): any {
      return worker.execute(...args)
    },
    invocations,
  }
}
