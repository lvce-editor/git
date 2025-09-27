import * as ExitCode from '../ExitCode/ExitCode.js'
import { defaultFileSystem } from '../FileSystem/FileSystem.js'
import { join } from '../../utils/join.js'
import type { CommandOptions } from '../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../CommandResult/CommandResult.js'

/**
 * Initialize a new repository
 */
const initRepository = async (cwd: string, bare: boolean = false, defaultBranch: string = 'main'): Promise<void> => {
  const gitdir = bare ? cwd : join(cwd, '.git')

  // Don't overwrite an existing config
  if (await defaultFileSystem.exists(join(gitdir, 'config'))) {
    return
  }

  // Create necessary directories
  const folders = ['hooks', 'info', 'objects/info', 'objects/pack', 'refs/heads', 'refs/tags']

  // TODO create folders in parallel

  for (const folder of folders) {
    const fullPath = join(gitdir, folder)
    await defaultFileSystem.mkdir(fullPath)
  }

  // Write config file
  const configContent =
    '[core]\n' +
    '\trepositoryformatversion = 0\n' +
    '\tfilemode = false\n' +
    `\tbare = ${bare}\n` +
    (bare ? '' : '\tlogallrefupdates = true\n') +
    '\tsymlinks = false\n' +
    '\tignorecase = true\n'

  await defaultFileSystem.write(join(gitdir, 'config'), configContent)

  // Write HEAD file
  await defaultFileSystem.write(join(gitdir, 'HEAD'), `ref: refs/heads/${defaultBranch}\n`)
}

export const handleInit = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  try {
    // Parse arguments
    const bare = args.includes('--bare')
    const defaultBranch = 'main' // Could be parsed from --initial-branch if needed

    await initRepository(options.cwd, bare, defaultBranch)

    const message = bare ? `Initialized empty Git repository in ${options.cwd}/` : `Initialized empty Git repository in ${join(options.cwd, '.git')}/`

    return {
      stdout: message,
      stderr: '',
      exitCode: ExitCode.Success,
    }
  } catch (error) {
    return {
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
      exitCode: ExitCode.GeneralError,
    }
  }
}
