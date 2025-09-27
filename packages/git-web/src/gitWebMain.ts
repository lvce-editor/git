import * as Rpc from '@lvce-editor/rpc'
import { GitWebExec } from './GitWebExec/GitWebExec.js'
import * as GitCommands from './GitCommands/GitCommands.js'
import { handleVersion } from './commands/VersionCommand/VersionCommand.js'
import { handleInit } from './commands/InitCommand/InitCommand.js'
import { handleStatus } from './commands/StatusCommand/StatusCommand.js'
import { handleAdd } from './commands/AddCommand/AddCommand.js'
import { handleCommit } from './commands/CommitCommand/CommitCommand.js'
import { handlePush } from './commands/PushCommand/PushCommand.js'
import { handlePull } from './commands/PullCommand/PullCommand.js'
import { handleFetch } from './commands/FetchCommand/FetchCommand.js'
import { handleCheckout } from './commands/CheckoutCommand/CheckoutCommand.js'
import { handleBranch } from './commands/BranchCommand/BranchCommand.js'
import { handleLog } from './commands/LogCommand/LogCommand.js'
import { handleDiff } from './commands/DiffCommand/DiffCommand.js'
import { handleRevParse } from './commands/RevParseCommand/RevParseCommand.js'
import { handleForEachRef } from './commands/ForEachRefCommand/ForEachRefCommand.js'
import { handleRemote } from './commands/RemoteCommand/RemoteCommand.js'
import { handleConfig } from './commands/ConfigCommand/ConfigCommand.js'

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

// Register all commands
registerGitCommands()

// RPC command map for the git-web package
const commandMap = {
  'GitWeb.exec': GitWebExec.exec,
}

// Initialize the RPC system
Rpc.createMain(commandMap)
