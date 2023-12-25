import * as GitRequests from '../GitRequests/GitRequests.js'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.js'

/**
 * @param {{cwd:string, gitPath:string, message:string}} options
 */
export const commit = WrapGitCommand.wrapGitCommand(GitRequests.commit)
