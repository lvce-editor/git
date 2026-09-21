import * as requests from '../../../../git-requests/src/main.ts'
import { toGitPath, toRelativePath, toResourceUri } from '../WorkspaceUris/WorkspaceUris.ts'

export * from '../../../../git-requests/src/main.ts'

const withFile =
  <T extends { readonly cwd: string; readonly file: string }, R>(fn: (args: T) => R) =>
  (args: T): R => {
    return fn({ ...args, file: toRelativePath(args.file, args.cwd) })
  }

const withWorktree =
  <T extends { readonly cwd: string; readonly worktreePath: string }, R>(fn: (args: T) => R) =>
  (args: T): R => {
    return fn({ ...args, worktreePath: toGitPath(toResourceUri(args.worktreePath, args.cwd), args.cwd) })
  }

export const add = withFile(requests.add)
export const stage = withFile(requests.stage)
export const unstage = withFile(requests.unstage)
export const discard = withFile(requests.discard)

const toRootRelativePathspec = (file: string): string => `:(top,literal)${file}`

const getStatusFile = async (args: Parameters<typeof requests.stage>[0]): Promise<string> => {
  const result = await args.exec({
    args: ['rev-parse', '--show-prefix'],
    cwd: args.cwd,
    gitPath: args.gitPath,
    name: 'getRepositoryPrefix',
  })
  if (result.stdout.trim() === '') {
    return args.file
  }
  return toRootRelativePathspec(args.file)
}

// Status paths are repository-root-relative even when Git runs from a child workspace.
// Keep the regular requests workspace-relative for API callers and use root-anchored
// path specifications only for the source-control commands that consume those status paths.
export const stageRootRelative = async (args: Parameters<typeof requests.stage>[0]): ReturnType<typeof requests.stage> => {
  return requests.stage({ ...args, file: await getStatusFile(args) })
}

export const unstageRootRelative = async (args: Parameters<typeof requests.unstage>[0]): ReturnType<typeof requests.unstage> => {
  return requests.unstage({ ...args, file: await getStatusFile(args) })
}

export const createWorktree = withWorktree(requests.createWorktree)
export const deleteWorktree = withWorktree(requests.deleteWorktree)

export const getFileBefore = (args: Parameters<typeof requests.getFileBefore>[0]): Promise<string> => {
  return requests.getFileBefore({ ...args, uri: toRelativePath(args.uri, args.repositoryPath) })
}

export const getDecorations = (args: Parameters<typeof requests.getDecorations>[0]): ReturnType<typeof requests.getDecorations> => {
  return requests.getDecorations({ ...args, uris: args.uris.map((uri) => toResourceUri(uri, args.cwd)) })
}
