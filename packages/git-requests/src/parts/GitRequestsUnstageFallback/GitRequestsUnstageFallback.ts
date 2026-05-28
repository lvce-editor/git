import type { GitFileRequest } from '../Types/Types.ts'

export const unstageFallback = async ({ cwd, exec, file, gitPath }: GitFileRequest): Promise<void> => {
  const args = ['reset', '--', file]
  await exec({
    args,
    cwd,
    gitPath,
    name: 'unstage',
  })
}
