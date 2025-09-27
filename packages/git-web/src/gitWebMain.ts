import * as Rpc from '@lvce-editor/rpc'
import { GitWebExec } from './GitWebExec/GitWebExec.js'

// RPC command map for the git-web package
const commandMap = {
  'GitWeb.exec': GitWebExec.exec,
}

// Initialize the RPC system
Rpc.createMain(commandMap)
