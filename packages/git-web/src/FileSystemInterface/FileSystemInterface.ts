export type FileStat = {
  readonly isFile: boolean
  readonly isDirectory: boolean
  readonly size: number
}

export type FileSystem = {
  readonly exists: (path: string) => Promise<boolean>
  readonly mkdir: (path: string) => Promise<void>
  readonly write: (path: string, content: string) => Promise<void>
  readonly read: (path: string) => Promise<string>
  readonly readdir: (path: string) => Promise<string[]>
  readonly stat: (path: string) => Promise<FileStat>
  readonly unlink: (path: string) => Promise<void>
  readonly rmdir: (path: string) => Promise<void>
}
