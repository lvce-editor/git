import * as GitRequests from '../GitRequests/GitRequests.ts'
import * as WrapGitCommand from '../WrapGitCommand/WrapGitCommand.ts'

const mapEntry = ([key, value]: readonly [string, (args: Readonly<Record<string, any>>) => Promise<any>]): readonly [string, (args: Readonly<Record<string, any>>) => Promise<any>] => {
  return [key, WrapGitCommand.wrapGitCommand(value)]
}

export const wrappedGitRequests = Object.fromEntries(Object.entries(GitRequests).map(mapEntry))
