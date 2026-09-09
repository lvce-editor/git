import * as requests from '../../../../git-requests/src/main.ts'
import { toGitPath, toRelativePath, toRemoteUri } from '../WorkspaceUris/WorkspaceUris.ts'

export * from '../../../../git-requests/src/main.ts'

const withFile =
  <T extends { readonly cwd: string; readonly file: string }, R>(fn: (args: T) => R) =>
  (args: T): R => {
    return fn({ ...args, file: toRelativePath(args.file, args.cwd) })
  }

const withWorktree =
  <T extends { readonly cwd: string; readonly worktreePath: string }, R>(fn: (args: T) => R) =>
  (args: T): R => {
    return fn({ ...args, worktreePath: toGitPath(args.worktreePath, args.cwd) })
  }

export const add = withFile(requests.add)
export const stage = withFile(requests.stage)
export const unstage = withFile(requests.unstage)
export const discard = withFile(requests.discard)
export const createWorktree = withWorktree(requests.createWorktree)
export const deleteWorktree = withWorktree(requests.deleteWorktree)

export const getFileBefore = (args: Parameters<typeof requests.getFileBefore>[0]): Promise<string> => {
  return requests.getFileBefore({ ...args, uri: toRelativePath(args.uri, args.repositoryPath) })
}

export const getDecorations = (args: Parameters<typeof requests.getDecorations>[0]): ReturnType<typeof requests.getDecorations> => {
  return requests.getDecorations({ ...args, uris: args.uris.map((uri) => toRemoteUri(uri, args.cwd)) })
}
