import type { CommandOptions } from '../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../CommandResult/CommandResult.js'

export type CommandHandler = (args: string[], options: CommandOptions) => Promise<CommandResult>
