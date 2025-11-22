import * as Git from '../Git/Git.ts'
import * as Repositories from '../GitRepositories/GitRepositories.ts'
import * as GitRepositoriesRequests from '../GitRepositoriesRequests/GitRepositoriesRequests.ts'
import * as GitRequests from '../GitRequests/GitRequests.ts'

const parseDecorations = (stdout: string): readonly any[] => {
  if (!stdout) {
    return []
  }
  const decorations: any[] = []
  const items = stdout.split('\0')
  for (let i = 0; i < items.length; i += 4) {
    const pattern = items[i + 2]
    const path = items[i + 3]
    if (pattern && !pattern.startsWith('!')) {
      decorations.push({
        decoration: 'ignore',
        uri: path,
      })
    }
  }
  return decorations
}

export const getFileDecorations = async (uris: readonly string[]): Promise<readonly any[]> => {
  const repository = await Repositories.getCurrent()
  const gitResult = await GitRepositoriesRequests.execute({
    id: 'decorations',
    fn: GitRequests.getDecorations,
    args: {
      cwd: repository.path,
      gitPath: repository.gitPath,
      exec: Git.exec,
      uris,
    },
  })
  const parsed = parseDecorations(gitResult.stdout)
  return parsed
}
