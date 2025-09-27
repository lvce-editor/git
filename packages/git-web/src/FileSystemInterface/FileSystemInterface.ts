export interface FileSystem {
  exists(path: string): Promise<boolean>
  mkdir(path: string): Promise<void>
  write(path: string, content: string): Promise<void>
  read(path: string): Promise<string>
  readdir(path: string): Promise<string[]>
  stat(path: string): Promise<{ isFile: boolean; isDirectory: boolean; size: number }>
  unlink(path: string): Promise<void>
  rmdir(path: string): Promise<void>
}
