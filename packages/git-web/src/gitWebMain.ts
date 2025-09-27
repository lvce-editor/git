import * as Rpc from '@lvce-editor/rpc'
import { GitWebExec } from './GitWebExec/GitWebExec.js'
import * as GitCommands from './GitCommands/GitCommands.js'
import * as ExitCode from './ExitCode/ExitCode.js'
import { GitRepository } from './GitRepository/GitRepository.js'
import type { CommandOptions } from './CommandOptions/CommandOptions.js'
import type { CommandResult } from './CommandResult/CommandResult.js'

// Register all git commands
const registerGitCommands = () => {
  // Version command
  GitCommands.registerCommand('--version', async () => ({
    stdout: 'git version 2.34.1 (web-emulated)',
    stderr: '',
    exitCode: ExitCode.Success
  }))

  // Init command
  GitCommands.registerCommand('init', async () => ({
    stdout: 'Initialized empty Git repository in .git/',
    stderr: '',
    exitCode: ExitCode.Success
  }))

  // Status command
  GitCommands.registerCommand('status', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const status = await repository.getStatus()
    
    return {
      stdout: status,
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Add command
  GitCommands.registerCommand('add', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    await repository.addFiles(args)
    
    return {
      stdout: '',
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Commit command
  GitCommands.registerCommand('commit', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const message = extractCommitMessage(args)
    const commitHash = await repository.commit(message)
    
    return {
      stdout: `[main ${commitHash}] ${message}`,
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Push command
  GitCommands.registerCommand('push', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    await repository.push(args)
    
    return {
      stdout: 'Everything up-to-date',
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Pull command
  GitCommands.registerCommand('pull', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    await repository.pull(args)
    
    return {
      stdout: 'Already up to date.',
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Fetch command
  GitCommands.registerCommand('fetch', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    await repository.fetch(args)
    
    return {
      stdout: 'From https://github.com/user/repo\n * branch            main       -> FETCH_HEAD',
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Checkout command
  GitCommands.registerCommand('checkout', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const branch = args[0] || 'main'
    await repository.checkout(branch)
    
    return {
      stdout: `Switched to branch '${branch}'`,
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Branch command
  GitCommands.registerCommand('branch', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const branches = await repository.listBranches()
    
    return {
      stdout: branches.map(b => `* ${b}`).join('\n'),
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Log command
  GitCommands.registerCommand('log', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const commits = await repository.getCommits()
    
    return {
      stdout: commits.map(c => `commit ${c.hash}\nAuthor: ${c.author}\nDate: ${c.date}\n\n    ${c.message}`).join('\n\n'),
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Diff command
  GitCommands.registerCommand('diff', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const diff = await repository.getDiff(args)
    
    return {
      stdout: diff,
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Rev-parse command
  GitCommands.registerCommand('rev-parse', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const ref = await repository.parseRef(args)
    
    return {
      stdout: ref,
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // For-each-ref command
  GitCommands.registerCommand('for-each-ref', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const refs = await repository.listRefs(args)
    
    return {
      stdout: refs.join('\n'),
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Remote command
  GitCommands.registerCommand('remote', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const result = await repository.handleRemote(args)
    
    return {
      stdout: result,
      stderr: '',
      exitCode: ExitCode.Success
    }
  })

  // Config command
  GitCommands.registerCommand('config', async (args: string[], options: CommandOptions) => {
    const repository = await GitRepository.getRepository(options.cwd)
    const result = await repository.handleConfig(args)
    
    return {
      stdout: result,
      stderr: '',
      exitCode: ExitCode.Success
    }
  })
}

// Helper function to extract commit message from args
const extractCommitMessage = (args: string[]): string => {
  const messageIndex = args.indexOf('-m')
  if (messageIndex !== -1 && messageIndex + 1 < args.length) {
    return args[messageIndex + 1]
  }
  return 'Web commit'
}

// Register all commands
registerGitCommands()

// RPC command map for the git-web package
const commandMap = {
  'GitWeb.exec': GitWebExec.exec,
}

// Initialize the RPC system
Rpc.createMain(commandMap)
