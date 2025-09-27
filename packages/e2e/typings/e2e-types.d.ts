// Type definitions for e2e test framework

interface FileSystem {
  getTmpDir(options?: { scheme?: string }): Promise<string>
  writeFile(uri: string, content: string): Promise<void>
  mkdir(uri: string): Promise<void>
  chmod(uri: string, permissions: string): Promise<void>
  createExecutable(content: string): Promise<void>
  createExecutableFrom(path: string): Promise<void>
}

interface Workspace {
  setPath(uri: string): Promise<void>
}

interface SideBar {
  open(id: string): Promise<void>
}

interface Settings {
  update(settings: Record<string, any>): Promise<void>
}

interface Locator {
  (selector: string): Locator
  toBeVisible(): Promise<void>
  toHaveCount(count: number): Promise<void>
  toHaveText(text: string): Promise<void>
  toHaveAttribute(key: string, value: string | null): Promise<void>
  toHaveClass(className: string): Promise<void>
  toBeFocused(): Promise<void>
  toHaveCSS(key: string, value: string): Promise<void>
  toBeHidden(): Promise<void>
  nth(index: number): Locator
  locator(selector: string): Locator
  click(): Promise<void>
  type(text: string): Promise<void>
}

interface QuickPick {
  open(): Promise<void>
  setValue(value: string): Promise<void>
  selectItem(value: string): Promise<void>
  focusNext(): Promise<void>
}

interface Editor {
  copyLineDown(): Promise<void>
  cursorCharacterLeft(): Promise<void>
  cursorCharacterRight(): Promise<void>
  cursorDown(): Promise<void>
  cursorUp(): Promise<void>
  cursorWordLeft(): Promise<void>
  cursorWordRight(): Promise<void>
  executeBraceCompletion(brace: string): Promise<void>
  executeTabCompletion(): Promise<void>
  findAllReferences(): Promise<void>
  goToDefinition(): Promise<void>
  goToTypeDefinition(): Promise<void>
  openCompletion(): Promise<void>
  openEditorContextMenu(): Promise<void>
  setCursor(rowIndex: number, columnIndex: number): Promise<void>
  type(text: string): Promise<void>
}

interface Explorer {
  openContextMenu(index: number): Promise<void>
  removeDirent(): Promise<void>
  focusFirst(): Promise<void>
  focusLast(): Promise<void>
  focusNext(): Promise<void>
  clickCurrent(): Promise<void>
  expandRecursively(): Promise<void>
  handleArrowLeft(): Promise<void>
}

interface Command {
  execute(id: string, ...args: any[]): Promise<void>
}

interface ContextMenu {
  selectItem(name: string): Promise<void>
}

interface Extension {
  addWebExtension(uri: string): Promise<void>
}

interface KeyBoard {
  press(key: string): Promise<void>
}

interface Platform {
  getNodePath(): Promise<string>
}

interface Search {
  setValue(value: string): Promise<void>
}

interface Main {
  openUri(uri: string): Promise<void>
}

interface TestContext {
  FileSystem: FileSystem
  Workspace: Workspace
  SideBar: SideBar
  Settings: Settings
  Locator: Locator
  QuickPick: QuickPick
  Editor: Editor
  Explorer: Explorer
  Command: Command
  ContextMenu: ContextMenu
  Extension: Extension
  KeyBoard: KeyBoard
  Platform: Platform
  Search: Search
  Main: Main
  expect: (locator: Locator) => {
    toBeVisible(): Promise<void>
    toHaveCount(count: number): Promise<void>
    toHaveText(text: string): Promise<void>
    toHaveAttribute(key: string, value: string | null): Promise<void>
    toHaveClass(className: string): Promise<void>
    toBeFocused(): Promise<void>
    toHaveCSS(key: string, value: string): Promise<void>
    toBeHidden(): Promise<void>
  }
}

type TestFunction = (context: TestContext) => Promise<void>

interface MockRpc {
  name: string
  commands: Record<string, (...args: any[]) => any>
}

declare const test: TestFunction
declare const mockRpc: MockRpc
