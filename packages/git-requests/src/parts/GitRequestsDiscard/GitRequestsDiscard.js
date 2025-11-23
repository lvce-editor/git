import { GitError } from '../GitError/GitError.js'
import { getModifiedFiles } from '../GitRequestsGetModifiedFiles/GitRequestsGetModifiedFiles.js'
import * as FileStateType from '../FileStateType/FileStateType.js'

const partitionFiles = (files, untracked) => {
  const toDelete = []
  const toRestore = []
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
/**
 * @param {{cwd:string,gitPath:string, file:string, exec:any, confirm:any, remove:any  }} options
 */
export const discard = async ({ cwd, gitPath, file, exec, confirm, remove }) => {
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
