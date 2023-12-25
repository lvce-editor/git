import * as GitRequests from '../GitRequests/GitRequests.js'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.js'

/**
 *
 * @param {{cwd:string, message:string, gitPath:string }} options
 */
export const addAllAndCommit = WrapGitCommand.wrapGitCommand(GitRequests.addAllAndCommit)
