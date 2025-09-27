export interface FileSystem {
  exists(path: string): Promise<boolean>
  mkdir(path: string): Promise<void>
  write(path: string, content: string): Promise<void>
  read(path: string): Promise<string>
  readdir(path: string): Promise<string[]>
  stat(path: string): Promise<{ readonly isFile: boolean; readonly isDirectory: boolean; readonly size: number }>
  unlink(path: string): Promise<void>
  rmdir(path: string): Promise<void>
}
