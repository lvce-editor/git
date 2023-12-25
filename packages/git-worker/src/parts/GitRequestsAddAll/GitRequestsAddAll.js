import * as GitRequests from '../GitRequests/GitRequests.js'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.js'
/**
 * @param {{cwd:string, gitPath:string }} options
 */
export const addAll = WrapGitCommand.wrapGitCommand(GitRequests.addAll)
