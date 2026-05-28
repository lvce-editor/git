import { GitError } from '../GitError/GitError.ts'
import { getModifiedFiles } from '../GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.ts'
import * as FileStateType from '../FileStateType/FileStateType.ts'
import type { GitExec, GitRequestContext } from '../Types/Types.ts'

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
  cwd,
  gitPath,
  file,
  exec,
  confirm,
  remove,
}: GitRequestContext & {
  readonly file: string
  readonly confirm: (options: { readonly message: string }) => Promise<boolean>
  readonly remove: (path: string) => Promise<void>
}): Promise<void> => {
  try {
    const confirmResult = await confirm({
      message: `Are you sure you want to discard ${file}`,
    })
    if (!confirmResult) {
      return
    }
    const status = await getModifiedFiles({
      cwd,
      gitPath,
      exec,
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
      const gitResult = await exec({
        args: ['restore', '--', item],
        cwd,
        gitPath,
        name: 'discard',
      })
    }
  } catch (error) {
    throw new GitError(error, 'discard')
  }
}
