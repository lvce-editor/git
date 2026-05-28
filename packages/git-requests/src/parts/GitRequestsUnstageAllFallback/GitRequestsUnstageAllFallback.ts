import type { GitRequestContext } from '../Types/Types.ts'

export const unstageAllFallback = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<void> => {
  const args = ['reset', '.']
  await exec({
    args,
    cwd,
    gitPath,
    name: 'unstageAll',
  })
}
