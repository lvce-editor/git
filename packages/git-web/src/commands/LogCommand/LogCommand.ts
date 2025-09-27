import * as ExitCode from '../../ExitCode/ExitCode.js'
import { GitRepository } from '../../GitRepository/GitRepository.js'
import type { CommandOptions } from '../../CommandOptions/CommandOptions.js'
import type { CommandResult } from '../../CommandResult/CommandResult.js'

export const handleLog = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const commits = await repository.getCommits()

  return {
    stdout: commits.map(c => `commit ${c.hash}\nAuthor: ${c.author}\nDate: ${c.date}\n\n    ${c.message}`).join('\n\n'),
    stderr: '',
    exitCode: ExitCode.Success
  }
}
