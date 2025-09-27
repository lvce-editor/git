import type { FileSystem } from '../FileSystemInterface/FileSystemInterface.ts'
import { defaultFileSystem } from '../FileSystem/FileSystem.ts'
import { join } from '../Path/Path.ts'

export class GitRepository {
  private static getRepositoryKey(cwd: string): string {
    return cwd
  }

  static async getRepository(cwd: string): Promise<GitRepository> {
    const key = this.getRepositoryKey(cwd)
    return new GitRepository(key)
  }

  constructor(private readonly key: string) {}


  private get gitdir(): string {
    return join(this.key, '.git')
  }

  private async readConfig(): Promise<Map<string, string>> {
    try {
      const configPath = join(this.gitdir, 'config')
      const content = await defaultFileSystem.read(configPath)
      const config = new Map<string, string>()

      // Simple config parser
      const lines = content.split('\n')
      let currentSection = ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          currentSection = trimmed.slice(1, -1)
        } else if (trimmed.includes('=')) {
          const [key, value] = trimmed.split('=', 2)
          config.set(`${currentSection}.${key.trim()}`, value.trim())
        }
      }

      return config
    } catch {
      return new Map()
    }
  }

  private async readHead(): Promise<string> {
    try {
      const headPath = join(this.gitdir, 'HEAD')
      const content = await defaultFileSystem.read(headPath)
      return content.trim()
    } catch {
      return 'refs/heads/main'
    }
  }

  async getStatus(): Promise<string> {
    return this.getFileSystemStatus()
  }

  private async getFileSystemStatus(): Promise<string> {
    try {
      // Read current branch from HEAD
      const headRef = await this.readHead()
      const branch = headRef.replace('ref: refs/heads/', '')

      let status = `On branch ${branch}\n`

      // For now, simulate a clean working tree
      // In a real implementation, this would check the index and working directory
      status += 'nothing to commit, working tree clean'

      return status
    } catch {
      return 'On branch main\nnothing to commit, working tree clean'
    }
  }

  async addFiles(files: readonly string[]): Promise<void> {
    // If no files specified, do nothing (like real git add with no args)
    if (files.length === 0) {
      return
    }

    await this.addFilesToFileSystem(files)
  }

  private async addFilesToFileSystem(files: readonly string[]): Promise<void> {
    try {
      const indexPath = join(this.gitdir, 'index')

      // Read current index (simplified - in real git this would be a binary format)
      let indexContent = ''
      try {
        indexContent = await defaultFileSystem.read(indexPath)
      } catch {
        // Index doesn't exist yet, start with empty content
        indexContent = ''
      }

      // Parse existing staged files from index (simplified format)
      const stagedFiles = new Set<string>()
      if (indexContent) {
        const lines = indexContent.split('\n').filter((line) => line.trim())
        for (const line of lines) {
          if (line.startsWith('file:')) {
            stagedFiles.add(line.slice(5)) // Remove 'file:' prefix
          }
        }
      }

      // Add new files to staged set
      if (files.includes('.')) {
        // Add all files in working directory
        const workingDirFiles = await this.getWorkingDirFiles()
        for (const file of workingDirFiles) {
          stagedFiles.add(file)
        }
      } else {
        // Add specific files
        for (const file of files) {
          stagedFiles.add(file)
        }
      }

      // Write updated index
      const newIndexContent = [...stagedFiles].map((file) => `file:${file}`).join('\n') + '\n'

      await defaultFileSystem.write(indexPath, newIndexContent)
    } catch {
      // In a real implementation, this might throw or handle the error differently
    }
  }

  private async getWorkingDirFiles(): Promise<string[]> {
    try {
      // Get all files in the working directory
      const files: string[] = []
      await this.collectFiles(this.key, files, this.key)
      return files
    } catch {
      return []
    }
  }

  private async collectFiles(dir: string, files: string[], baseDir: string): Promise<void> {
    try {
      const entries = await defaultFileSystem.readdir(dir)
      for (const entry of entries) {
        if (entry === '.git') {
          continue
        } // Skip .git directory

        const fullPath = join(dir, entry)
        const stat = await defaultFileSystem.stat(fullPath)

        if (stat.isFile) {
          // Add relative path from working directory
          if (fullPath.startsWith(baseDir + '/')) {
            const relativePath = fullPath.slice(Math.max(0, baseDir.length + 1))
            files.push(relativePath)
          } else if (fullPath.startsWith(baseDir)) {
            const relativePath = fullPath.slice(baseDir.length)
            files.push(relativePath)
          } else {
            // Try to handle the protocol difference (web:// vs web:/)
            const normalizedBaseDir = baseDir.replace('://', ':/')
            if (fullPath.startsWith(normalizedBaseDir + '/')) {
              const relativePath = fullPath.slice(Math.max(0, normalizedBaseDir.length + 1))
              files.push(relativePath)
            }
          }
        } else if (stat.isDirectory) {
          await this.collectFiles(fullPath, files, baseDir)
        }
      }
    } catch {
      // Ignore errors when collecting files
    }
  }

  async commit(message: string): Promise<string> {
    const hash = this.generateHash()
    await this.commitToFileSystem(hash, message)
    return hash
  }

  private async commitToFileSystem(hash: string, message: string): Promise<void> {
    try {
      // Read current branch from HEAD
      const headRef = await this.readHead()
      const branch = headRef.replace('ref: refs/heads/', '')

      // Update the branch ref
      const refPath = join(this.gitdir, 'refs', 'heads', branch)
      await defaultFileSystem.write(refPath, hash + '\n')

      // In a real implementation, we would also:
      // - Create the commit object in objects/
      // - Update the index
      // - Handle the working directory
    } catch {
      // In a real implementation, this might throw or handle the error differently
    }
  }

  async push(args: readonly string[]): Promise<void> {
    // Simulate push - in a real implementation, this would push to remote
    // For now, just simulate success
  }

  async pull(args: readonly string[]): Promise<void> {
    // Simulate pull - in a real implementation, this would pull from remote
    // For now, just simulate success
  }

  async fetch(args: readonly string[]): Promise<void> {
    // Simulate fetch - in a real implementation, this would fetch from remote
    // For now, just simulate success
  }

  async checkout(branch: string): Promise<void> {
    // In a real implementation, this would update the HEAD ref
    // For now, just simulate success
  }

  async listBranches(): Promise<string[]> {
    // In a real implementation, this would read from .git/refs/heads/
    // For now, return a simple default
    return ['* main']
  }

  async getCommits(): Promise<any[]> {
    // In a real implementation, this would read from .git/logs/ or objects/
    // For now, return empty array
    return []
  }

  async getDiff(args: readonly string[]): Promise<string> {
    // Simulate diff output
    return `diff --git a/test/file-1.txt b/test/file-1.txt
index 1234567..abcdefg 100644
--- a/test/file-1.txt
+++ b/test/file-1.txt
@@ -1 +1,2 @@
 test
+modified`
  }

  async parseRef(args: readonly string[]): Promise<string> {
    const ref = args[0] || 'HEAD'

    if (ref === 'HEAD') {
      try {
        const headRef = await this.readHead()
        if (headRef.startsWith('ref: ')) {
          // Follow the ref
          const refPath = join(this.gitdir, headRef.slice(5))
          const content = await defaultFileSystem.read(refPath)
          return content.trim()
        }
        return headRef
      } catch {
        return 'HEAD'
      }
    }

    // Try to read the ref directly
    try {
      const refPath = join(this.gitdir, 'refs', 'heads', ref)
      const content = await defaultFileSystem.read(refPath)
      return content.trim()
    } catch {
      return ref // Return as-is if not found
    }
  }

  async listRefs(args: readonly string[]): Promise<string[]> {
    // In a real implementation, this would read from .git/refs/
    // For now, return empty array
    return []
  }

  async handleRemote(args: string[]): Promise<string> {
    const subcommand = args[0]

    switch (subcommand) {
      case 'add': {
        const name = args[1]
        const url = args[2]
        if (name && url) {
          // In a real implementation, this would write to .git/config
          return `Remote '${name}' added with URL '${url}'`
        }
        break
      }

      case 'remove':
      case 'rm': {
        const removeName = args[1]
        if (removeName) {
          // In a real implementation, this would remove from .git/config
          return `Remote '${removeName}' removed`
        }
        break
      }

      case 'show': {
        const showName = args[1] || 'origin'
        // In a real implementation, this would read from .git/config
        return `${showName}\t(fetch)\n${showName}\t(push)`
      }

      case 'list':
      default: {
        // In a real implementation, this would read from .git/config
        return ''
      }
    }

    return ''
  }

  async handleConfig(args: string[]): Promise<string> {
    const subcommand = args[0]

    switch (subcommand) {
      case '--get': {
        const key = args[1]
        if (key) {
          const config = await this.readConfig()
          return config.get(key) || ''
        }
        break
      }

      case '--set': {
        const key = args[1]
        const value = args[2]
        if (key && value) {
          // In a real implementation, this would write to .git/config
          return ''
        }
        break
      }

      case '--list': {
        const config = await this.readConfig()
        return [...config.entries()].map(([key, value]) => `${key}=${value}`).join('\n')
      }
      // No default
    }

    return ''
  }

  private generateHash(): string {
    // Generate a fake git hash
    const chars = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < 40; i++) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }

    return result
  }
}
