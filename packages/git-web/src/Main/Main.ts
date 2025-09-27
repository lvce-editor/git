import * as Rpc from '@lvce-editor/rpc'
import { handleAdd } from '../AddCommand/AddCommand.ts'
import { handleBranch } from '../BranchCommand/BranchCommand.ts'
import { handleCheckout } from '../CheckoutCommand/CheckoutCommand.ts'
import { handleCommit } from '../CommitCommand/CommitCommand.ts'
import { handleConfig } from '../ConfigCommand/ConfigCommand.ts'
import { handleDiff } from '../DiffCommand/DiffCommand.ts'
import { handleFetch } from '../FetchCommand/FetchCommand.ts'
import { handleForEachRef } from '../ForEachRefCommand/ForEachRefCommand.ts'
import * as GitCommands from '../GitCommands/GitCommands.ts'
import { exec } from '../GitWebExec/GitWebExec.ts'
import { handleInit } from '../InitCommand/InitCommand.ts'
import { handleLog } from '../LogCommand/LogCommand.ts'
import { handlePull } from '../PullCommand/PullCommand.ts'
import { handlePush } from '../PushCommand/PushCommand.ts'
import { handleRemote } from '../RemoteCommand/RemoteCommand.ts'
import { handleRevParse } from '../RevParseCommand/RevParseCommand.ts'
import { handleStatus } from '../StatusCommand/StatusCommand.ts'
import { handleVersion } from '../VersionCommand/VersionCommand.ts'

// Register all git commands
const registerGitCommands = () => {
  GitCommands.registerCommand('--version', handleVersion)
  GitCommands.registerCommand('init', handleInit)
  GitCommands.registerCommand('status', handleStatus)
  GitCommands.registerCommand('add', handleAdd)
  GitCommands.registerCommand('commit', handleCommit)
  GitCommands.registerCommand('push', handlePush)
  GitCommands.registerCommand('pull', handlePull)
  GitCommands.registerCommand('fetch', handleFetch)
  GitCommands.registerCommand('checkout', handleCheckout)
  GitCommands.registerCommand('branch', handleBranch)
  GitCommands.registerCommand('log', handleLog)
  GitCommands.registerCommand('diff', handleDiff)
  GitCommands.registerCommand('rev-parse', handleRevParse)
  GitCommands.registerCommand('for-each-ref', handleForEachRef)
  GitCommands.registerCommand('remote', handleRemote)
  GitCommands.registerCommand('config', handleConfig)
}

export const Main = (): void => {
  // Register all commands
  registerGitCommands()
}
