import * as ExitCode from '../ExitCode/ExitCode.ts'
import { GitRepository } from '../GitRepository/GitRepository.ts'
import type { CommandOptions } from '../CommandOptions/CommandOptions.ts'
import type { CommandResult } from '../CommandResult/CommandResult.ts'

export const handleLog = async (args: string[], options: CommandOptions): Promise<CommandResult> => {
  const repository = await GitRepository.getRepository(options.cwd)
  const commits = await repository.getCommits()

  return {
    stdout: commits.map((c) => `commit ${c.hash}\nAuthor: ${c.author}\nDate: ${c.date}\n\n    ${c.message}`).join('\n\n'),
    stderr: '',
    exitCode: ExitCode.Success,
  }
}
