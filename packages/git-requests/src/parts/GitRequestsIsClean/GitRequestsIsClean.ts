import type { GitRequestContext } from '../Types/Types.ts'

export const isClean = async ({ cwd, exec, gitPath }: GitRequestContext): Promise<boolean> => {
  const { stdout } = await exec({
    args: ['status', '--porcelain', '-uall'],
    cwd,
    gitPath,
    name: 'isClean',
  })
  return stdout.trim() === ''
}
