import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = 'git.addToGitignore'

export const execute = async (file: string): Promise<void> => {
  await GitWorker.invoke('Command.gitAddToGitignore', file)
}
