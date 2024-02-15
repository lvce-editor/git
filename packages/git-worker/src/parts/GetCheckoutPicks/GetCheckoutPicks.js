import * as Git from '../Git/Git.js'
import * as Repositories from '../GitRepositories/GitRepositories.js'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.js'
import * as GitRequests from '../GitRequests/GitRequests.js'

const getShortCommit = (commit) => {
  return commit.slice(0, 8)
}

const toPick = (ref) => {
  return {
    label: ref.name,
    description: getShortCommit(ref.commit),
  }
}

const getRawPicks = async () => {
  const repository = await Repositories.getCurrent()
  const refs = await GitRepositoriesRequests.execute({
    id: 'getRefs',
    fn: GitRequests.getRefs,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      exec: Git.exec,
    },
  })
  return refs
}

export const getCheckoutPicks = async () => {
  const rawPicks = await getRawPicks()
  const picks = rawPicks.map(toPick)
  return picks
}
