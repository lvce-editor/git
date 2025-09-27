import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'

export type CommandHandler = (args: string[], options: CommandOptions) => Promise<CommandResult>
