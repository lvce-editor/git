import * as Rpc from '../Rpc/Rpc.ts'

export const commandAddToGitignore = async (file: string): Promise<void> => {
  if (!file || file.startsWith('/') || /^[a-z]:/i.test(file) || /[\r\n\0]/.test(file) || file.split('/').includes('..')) {
    throw new Error('Expected a repository-relative file path')
  }
  const folder = await Rpc.invoke('Config.getWorkspaceFolder')
  if (!folder) {
    throw new Error('No workspace folder is open')
  }
  const uri = `${folder}/.gitignore`
  const exists = await Rpc.invoke('FileSystem.exists', uri)
  const content: string = exists ? await Rpc.invoke('FileSystem.readFile', uri) : ''
  const pattern = '/' + Array.from(file, (character) => ('\\*?[] !#'.includes(character) ? `\\${character}` : character)).join('')
  if (content.split(/\r?\n/).includes(pattern)) {
    return
  }
  const newline = content.includes('\r\n') ? '\r\n' : '\n'
  const separator = content && !content.endsWith('\n') ? newline : ''
  await Rpc.invoke('FileSystem.writeFile', uri, `${content}${separator}${pattern}${newline}`)
}
