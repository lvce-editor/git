import type { GitRequestContext } from '../Types/Types.ts'

const getFileContent = async ({ cwd, exec, gitPath }: GitRequestContext, file: string): Promise<string> => {
  const result = await exec({
    args: ['diff', '--no-index', '--no-ext-diff', '--no-color', '--unified=0', '--', '/dev/null', file],
    cwd,
    gitPath,
    name: 'getDefaultCommitMessage',
    throwError: false,
  })
  if (result.exitCode !== 1) {
    return ''
  }
  const lines = result.stdout
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .map((line) => line.slice(1))
  return lines.join('\n')
}

export const getDefaultCommitMessage = async (context: GitRequestContext): Promise<string> => {
  const { cwd, exec, gitPath } = context
  const mergeHead = await exec({
    args: ['rev-parse', '--verify', 'MERGE_HEAD'],
    cwd,
    gitPath,
    name: 'getDefaultCommitMessage',
    throwError: false,
  })
  if (mergeHead.exitCode !== 0) {
    return ''
  }
  const mergeMessagePath = await exec({
    args: ['rev-parse', '--git-path', 'MERGE_MSG'],
    cwd,
    gitPath,
    name: 'getDefaultCommitMessage',
    throwError: false,
  })
  if (mergeMessagePath.exitCode !== 0) {
    return ''
  }
  const content = await getFileContent(context, mergeMessagePath.stdout.trim())
  return (
    content
      .split('\n')
      .find((line) => line.trim() && !line.trimStart().startsWith('#'))
      ?.trim() || ''
  )
}
