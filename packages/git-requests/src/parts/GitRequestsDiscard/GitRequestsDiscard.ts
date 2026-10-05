import type { GitRequestContext } from '../Types/Types.ts'
import * as FileStateType from '../FileStateType/FileStateType.ts'
import { GitError } from '../GitError/GitError.ts'
import { getModifiedFiles } from '../GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.ts'

const partitionFiles = (files: readonly string[], untracked: readonly string[]): { toDelete: string[]; toRestore: string[] } => {
  const toDelete: string[] = []
  const toRestore: string[] = []
  for (const file of files) {
    if (untracked.includes(file)) {
      toDelete.push(file)
    } else {
      toRestore.push(file)
    }
  }
  return {
    toDelete,
    toRestore,
  }
}

export const discard = async ({
  confirm,
  cwd,
  exec,
  file,
  gitPath,
  refresh,
  remove,
}: GitRequestContext & {
  readonly confirm: (message: string) => boolean | Promise<boolean>
  readonly file: string
  readonly refresh?: () => void | Promise<void>
  readonly remove: (path: string) => void | Promise<void>
}): Promise<void> => {
  try {
    const confirmResult = await confirm(`Are you sure you want to discard ${file}`)
    if (!confirmResult) {
      return
    }
    const status = await getModifiedFiles({
      cwd,
      exec,
      gitPath,
    })
    const untracked = status.index.filter((item) => item.status === FileStateType.Untracked).map((item) => item.file)

    const { toDelete, toRestore } = partitionFiles([file], untracked)

    // TODO could parallelize this
    if (toDelete.length > 0) {
      for (const item of toDelete) {
        await remove(`${cwd}/${item}`)
      }
    }

    for (const item of toRestore) {
      await exec({
        args: ['restore', '--', item],
        cwd,
        gitPath,
        name: 'discard',
      })
    }
    if (toRestore.length > 0 && refresh) {
      await refresh()
    }
  } catch (error) {
    throw new GitError(error, 'discard')
  }
}
