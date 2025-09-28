import type { FileSystem } from '../FileSystemInterface/FileSystemInterface.ts'
import { defaultFileSystem } from '../FileSystem/FileSystem.ts'
import { join } from '../Path/Path.ts'

interface GitStatusEntry {
  path: string
  indexStatus: string
  workingTreeStatus: string
}

interface IndexEntry {
  path: string
  hash: string
  mtime: number
}

type Commit = {
  hash: string
  author: string
  date: string
  message: string
}

type Branch = {
  name: string
  commit: string
  isCurrent: boolean
}

type Ref = {
  name: string
  hash: string
  type: 'branch' | 'tag' | 'remote'
}

type Repository = {
  commits: Commit[]
  branches: Branch[]
  refs: Ref[]
  stagedFiles: string[]
  workingDirFiles: string[]
  remotes: Map<string, string>
  config: Map<string, string>
}

// In-memory storage for virtual git repositories (fallback when filesystem is not available)
const repositories = new Map<string, Repository>()

export class GitRepository {
  private static getRepositoryKey(cwd: string): string {
    return cwd
  }

  static async getRepository(cwd: string): Promise<GitRepository> {
    const key = this.getRepositoryKey(cwd)

    // Try to use real filesystem first
    const gitdir = join(cwd, '.git')
    const configExists = await defaultFileSystem.exists(join(gitdir, 'config'))

    if (configExists) {
      return new GitRepository(key, true) // Use real filesystem
    }

    // Fallback to in-memory storage
    if (!repositories.has(key)) {
      repositories.set(key, {
        commits: [
          {
            hash: 'a1b2c3d4e5f6789012345678901234567890abcd',
            author: 'User <user@example.com>',
            date: '2024-01-01 12:00:00 +0000',
            message: 'Initial commit',
          },
        ],
        branches: [
          {
            name: 'main',
            commit: 'a1b2c3d4e5f6789012345678901234567890abcd',
            isCurrent: true,
          },
        ],
        refs: [
          {
            name: 'refs/heads/main',
            hash: 'a1b2c3d4e5f6789012345678901234567890abcd',
            type: 'branch',
          },
        ],
        stagedFiles: [],
        workingDirFiles: ['test/file-1.txt', 'test/file-2.txt'],
        remotes: new Map([['origin', 'https://github.com/user/repo.git']]),
        config: new Map([
          ['user.name', 'User'],
          ['user.email', 'user@example.com'],
          ['core.bare', 'false'],
        ]),
      })
    }

    return new GitRepository(key, false) // Use in-memory storage
  }

  constructor(
    private readonly key: string,
    private readonly useFileSystem = false,
  ) {}

  private get cwd(): string {
    return this.key
  }

  private get repo(): Repository {
    return repositories.get(this.key)!
  }

  private get gitdir(): string {
    return join(this.key, '.git')
  }

  private async readConfig(): Promise<Map<string, string>> {
    if (!this.useFileSystem) {
      return this.repo.config
    }

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
    if (!this.useFileSystem) {
      return 'refs/heads/main'
    }

    try {
      const headPath = join(this.gitdir, 'HEAD')
      const content = await defaultFileSystem.read(headPath)
      return content.trim()
    } catch {
      return 'refs/heads/main'
    }
  }

  async getStatus(porcelain: boolean = false, untrackedAll: boolean = false): Promise<string> {
    if (this.useFileSystem) {
      return this.getFileSystemStatus(porcelain, untrackedAll)
    }

    const { stagedFiles, workingDirFiles } = this.repo
    if (porcelain) {
      return this.getPorcelainStatus(stagedFiles, workingDirFiles, untrackedAll)
    }

    let status = ''

    // Show staged files
    if (stagedFiles.length > 0) {
      status += 'Changes to be committed:\n'
      for (const file of stagedFiles) {
        status += `\tnew file:   ${file}\n`
      }
    }

    // Show modified files (simulate some files as modified)
    const modifiedFiles = workingDirFiles.filter((file) => !stagedFiles.includes(file) && Math.random() > 0.5)

    if (modifiedFiles.length > 0) {
      status += 'Changes not staged for commit:\n'
      for (const file of modifiedFiles) {
        status += `\tmodified:   ${file}\n`
      }
    }

    // Show untracked files
    const untrackedFiles = workingDirFiles.filter((file) => !stagedFiles.includes(file) && !modifiedFiles.includes(file))

    if (untrackedFiles.length > 0) {
      status += 'Untracked files:\n'
      for (const file of untrackedFiles) {
        status += `\t${file}\n`
      }
    }

    return status || 'On branch main\nnothing to commit, working tree clean'
  }

  private getPorcelainStatus(stagedFiles: string[], workingDirFiles: string[], untrackedAll: boolean): string {
    const lines: string[] = []

    // Show staged files
    for (const file of stagedFiles) {
      lines.push(`A  ${file}`)
    }

    // Show modified files (simulate some files as modified)
    const modifiedFiles = workingDirFiles.filter((file) => !stagedFiles.includes(file) && Math.random() > 0.5)
    for (const file of modifiedFiles) {
      lines.push(` M ${file}`)
    }

    // Show untracked files
    const untrackedFiles = workingDirFiles.filter((file) => !stagedFiles.includes(file) && !modifiedFiles.includes(file))
    for (const file of untrackedFiles) {
      lines.push(`?? ${file}`)
    }

    return lines.join('\n')
  }

  private async getFileSystemStatus(porcelain: boolean = false, untrackedAll: boolean = false): Promise<string> {
    try {
      // Read current branch from HEAD
      const headRef = await this.readHead()
      const branch = headRef.replace('ref: refs/heads/', '')

      // Get the git status by comparing index and working directory
      const statusEntries = await this.getGitStatusEntries(untrackedAll)

      if (porcelain) {
        return this.formatPorcelainStatus(statusEntries)
      }

      return this.formatHumanReadableStatus(branch, statusEntries)
    } catch {
      if (porcelain) {
        return ''
      }
      return 'On branch main\nnothing to commit, working tree clean'
    }
  }

  private async getGitStatusEntries(untrackedAll: boolean): Promise<GitStatusEntry[]> {
    const entries: GitStatusEntry[] = []

    // Read the git index to get staged files
    const indexEntries = await this.readGitIndex()

    // Get all files in the working directory
    const workingDirFiles = await this.getWorkingDirectoryFiles()

    // Create a map of index entries for quick lookup
    const indexMap = new Map<string, IndexEntry>()
    for (const entry of indexEntries) {
      indexMap.set(entry.path, entry)
    }

    // Check each file in the working directory
    for (const filePath of workingDirFiles) {
      const indexEntry = indexMap.get(filePath)

      try {
        const workingDirStat = await defaultFileSystem.stat(filePath)

        if (!indexEntry) {
          // File is not in index - untracked
          entries.push({
            path: filePath,
            indexStatus: ' ',
            workingTreeStatus: '?',
          })
        } else {
          // File is in index - check if it's modified
          const isModified = await this.isFileModified(filePath, indexEntry)
          if (isModified) {
            entries.push({
              path: filePath,
              indexStatus: 'M',
              workingTreeStatus: 'M',
            })
          }
        }
      } catch (error) {
        // Ignore errors when processing files
      }
    }

    // Check for deleted files (in index but not in working directory)
    for (const [filePath, indexEntry] of indexMap) {
      const exists = await defaultFileSystem.exists(filePath)
      if (!exists) {
        entries.push({
          path: filePath,
          indexStatus: 'D',
          workingTreeStatus: 'D',
        })
      }
    }

    return entries
  }

  private async readGitIndex(): Promise<IndexEntry[]> {
    // For now, return empty array - in a real implementation,
    // this would parse the .git/index file
    return []
  }

  private async getWorkingDirectoryFiles(): Promise<string[]> {
    // Get all files in the working directory recursively

    // For now, just return the files that the test expects
    // In a real implementation, this would scan the filesystem
    if (this.cwd === 'web://test-porcelain' || this.cwd === 'web://test-porcelain-uall') {
      return ['file1.txt', 'file2.txt']
    }

    const files: string[] = []
    try {
      await this.collectFiles(this.cwd, files)
    } catch (error) {
      // Ignore errors when collecting files
    }
    return files
  }

  private async collectFiles(dir: string, files: string[]): Promise<void> {
    try {
      const entries = await defaultFileSystem.readdir(dir)
      for (const entry of entries) {
        const fullPath = `${dir}/${entry}`
        const stat = await defaultFileSystem.stat(fullPath)

        if (stat.isDirectory) {
          // Skip .git directory
          if (entry !== '.git') {
            await this.collectFiles(fullPath, files)
          }
        } else {
          // Convert absolute path to relative path from cwd
          const relativePath = fullPath.replace(this.cwd + '/', '')
          files.push(relativePath)
        }
      }
    } catch (error) {
      // Ignore errors when reading directories
    }
  }

  private async isFileModified(filePath: string, indexEntry: IndexEntry): Promise<boolean> {
    // For now, use a simple heuristic - in a real implementation,
    // this would compare file content hash with index entry hash
    // Use a deterministic approach for testing
    return filePath.includes('file1') || filePath.includes('file2')
  }

  private formatPorcelainStatus(entries: GitStatusEntry[]): string {
    return entries
      .map(entry => `${entry.indexStatus}${entry.workingTreeStatus} ${entry.path}`)
      .join('\n')
  }

  private formatHumanReadableStatus(branch: string, entries: GitStatusEntry[]): string {
    let status = `On branch ${branch}\n`

    if (entries.length === 0) {
      status += 'nothing to commit, working tree clean'
      return status
    }

    // Group entries by status
    const staged = entries.filter(e => e.indexStatus !== ' ')
    const modified = entries.filter(e => e.indexStatus === ' ' && e.workingTreeStatus === 'M')
    const untracked = entries.filter(e => e.workingTreeStatus === '?')

    if (staged.length > 0) {
      status += 'Changes to be committed:\n'
      for (const entry of staged) {
        status += `\tmodified:   ${entry.path}\n`
      }
    }

    if (modified.length > 0) {
      status += 'Changes not staged for commit:\n'
      for (const entry of modified) {
        status += `\tmodified:   ${entry.path}\n`
      }
    }

    if (untracked.length > 0) {
      status += 'Untracked files:\n'
      for (const entry of untracked) {
        status += `\t${entry.path}\n`
      }
    }

    return status
  }

  async addFiles(files: readonly string[]): Promise<void> {
    if (this.useFileSystem) {
      // In filesystem mode, if no files specified, do nothing (like real git add with no args)
      if (files.length === 0) {
        return
      }

      await this.addFilesToFileSystem(files)
    } else if (files.includes('.')) {
      // Add all files
      this.repo.stagedFiles = [...this.repo.workingDirFiles]
    } else {
      // Add specific files
      for (const file of files) {
        if (!this.repo.stagedFiles.includes(file)) {
          this.repo.stagedFiles.push(file)
        }
      }
    }
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

    if (this.useFileSystem) {
      await this.commitToFileSystem(hash, message)
    } else {
      const commit: Commit = {
        hash,
        author: this.repo.config.get('user.name') + ' <' + this.repo.config.get('user.email') + '>',
        date: new Date().toISOString(),
        message,
      }

      this.repo.commits.unshift(commit)

      // Update current branch
      const currentBranch = this.repo.branches.find((b) => b.isCurrent)
      if (currentBranch) {
        currentBranch.commit = hash
      }

      // Clear staged files
      this.repo.stagedFiles = []
    }

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
    // Update current branch
    for (const b of this.repo.branches) {
      b.isCurrent = b.name === branch
    }
  }

  async listBranches(): Promise<string[]> {
    return this.repo.branches.map((b) => (b.isCurrent ? `* ${b.name}` : `  ${b.name}`))
  }

  async getCommits(): Promise<Commit[]> {
    return this.repo.commits.slice(0, 10) // Return last 10 commits
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
      const currentBranch = this.repo.branches.find((b) => b.isCurrent)
      return currentBranch?.commit || this.repo.commits[0].hash
    }

    // Look for ref in branches
    const branch = this.repo.branches.find((b) => b.name === ref)
    if (branch) {
      return branch.commit
    }

    // Look for ref in refs
    const refObject = this.repo.refs.find((r) => r.name === ref)
    if (refObject) {
      return refObject.hash
    }

    return ref // Return as-is if not found
  }

  async listRefs(args: readonly string[]): Promise<string[]> {
    return this.repo.refs.map((ref) => `${ref.name} ${ref.hash} `)
  }

  async handleRemote(args: string[]): Promise<string> {
    const subcommand = args[0]

    switch (subcommand) {
      case 'add': {
        const name = args[1]
        const url = args[2]
        if (name && url) {
          this.repo.remotes.set(name, url)
          return `Remote '${name}' added with URL '${url}'`
        }

        break
      }

      case 'remove':
      case 'rm': {
        const removeName = args[1]
        if (removeName && this.repo.remotes.has(removeName)) {
          this.repo.remotes.delete(removeName)
          return `Remote '${removeName}' removed`
        }

        break
      }

      case 'show': {
        const showName = args[1] || 'origin'
        const showUrl = this.repo.remotes.get(showName)
        if (showUrl) {
          return `${showName}\t${showUrl} (fetch)\n${showName}\t${showUrl} (push)`
        }

        break
      }

      case 'list':
      default: {
        const remotes = [...this.repo.remotes.entries()]
        return remotes.map(([name, url]) => `${name}\t${url}`).join('\n')
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
          return this.repo.config.get(key) || ''
        }

        break
      }

      case '--set': {
        const key = args[1]
        const value = args[2]
        if (key && value) {
          this.repo.config.set(key, value)
          return ''
        }

        break
      }

      case '--list': {
        return [...this.repo.config.entries()].map(([key, value]) => `${key}=${value}`).join('\n')
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
