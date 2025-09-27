import * as ExitCode from '../ExitCode/ExitCode.js'
import type { CommandOptions } from '../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../CommandResult/CommandResult.js'
import type { CommandHandler } from '../CommandHandler/CommandHandler.js'

export type { CommandOptions, CommandResult, CommandHandler }

// Command registry - starts empty
const commandRegistry = new Map<string, CommandHandler>()

/**
 * Register a git command handler
 */
export const registerCommand = (command: string, handler: CommandHandler): void => {
  commandRegistry.set(command, handler)
}

/**
 * Unregister a git command handler
 */
export const unregisterCommand = (command: string): void => {
  commandRegistry.delete(command)
}

/**
 * Get all registered commands
 */
export const getRegisteredCommands = (): string[] => {
  return Array.from(commandRegistry.keys())
}

/**
 * Check if a command is registered
 */
export const isCommandRegistered = (command: string): boolean => {
  return commandRegistry.has(command)
}

/**
 * Execute a git command with web-compatible emulation
 */
export const executeCommand = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  if (!args || args.length === 0) {
    return {
      stdout: '',
      stderr: 'usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]\n           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]\n           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]\n           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]\n           <command> [<args>]',
      exitCode: ExitCode.GeneralError
    }
  }

  const command = args[0]
  const commandArgs = args.slice(1)

  try {
    const handler = commandRegistry.get(command)
    
    if (!handler) {
      return {
        stdout: '',
        stderr: `git: '${command}' is not a git command. See 'git --help'.`,
        exitCode: ExitCode.CommandNotFound
      }
    }

    return await handler(commandArgs, options)
  } catch (error) {
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
      exitCode: ExitCode.GeneralError
    }
  }
}

