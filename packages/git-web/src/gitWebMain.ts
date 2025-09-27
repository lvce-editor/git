import * as Rpc from '@lvce-editor/rpc'
import { GitWebExec } from './GitWebExec/GitWebExec.js'
import * as GitCommands from './GitCommands/GitCommands.js'
import { handleVersion } from './VersionCommand/VersionCommand.js'
import { handleInit } from './InitCommand/InitCommand.js'
import { handleStatus } from './StatusCommand/StatusCommand.js'
import { handleAdd } from './AddCommand/AddCommand.js'
import { handleCommit } from './CommitCommand/CommitCommand.js'
import { handlePush } from './PushCommand/PushCommand.js'
import { handlePull } from './PullCommand/PullCommand.js'
import { handleFetch } from './FetchCommand/FetchCommand.js'
import { handleCheckout } from './CheckoutCommand/CheckoutCommand.js'
import { handleBranch } from './BranchCommand/BranchCommand.js'
import { handleLog } from './LogCommand/LogCommand.js'
import { handleDiff } from './DiffCommand/DiffCommand.js'
import { handleRevParse } from './RevParseCommand/RevParseCommand.js'
import { handleForEachRef } from './ForEachRefCommand/ForEachRefCommand.js'
import { handleRemote } from './RemoteCommand/RemoteCommand.js'
import { handleConfig } from './ConfigCommand/ConfigCommand.js'

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
