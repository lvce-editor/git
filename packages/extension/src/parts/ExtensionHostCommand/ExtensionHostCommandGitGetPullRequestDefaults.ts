import * as GitWorker from '../GitWorker/GitWorker.ts'

export const id = 'git.getPullRequestDefaults'

export const execute = async () => {
  return GitWorker.invoke('Git.getPullRequestDefaults')
}
