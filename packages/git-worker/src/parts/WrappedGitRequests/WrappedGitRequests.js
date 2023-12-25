import * as GitRequests from '../GitRequests/GitRequests.js'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.js'

const mapEntry = ([key, value]) => {
  return [key, WrapGitCommand.wrapGitCommand(value)]
}

export const wrappedGitRequests = Object.fromEntries(Object.entries(GitRequests).map(mapEntry))
