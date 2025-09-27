export const name = 'git.show-changed-files-in-side-bar'

const gitVersion = () => {
  return {
    stdout: '0.0.0',
    stderr: '',
    exitCode: 0,
  }
}

const gitRevParse = () => {
  return {
    stdout: '',
    stderr: ``,
    exitCode: 0,
  }
}

const gitStatus = () => {
  return {
    stdout: ` M test/file-1.txt
 M test/file-2.txt
`,
    stderr: ``,
    exitCode: 0,
  }
}

const exec = (command, args, options) => {
  if (command !== 'git') {
    throw new Error(`unexpected command ${command}`)
  }
  const subCommand = args[0]
  switch (subCommand) {
    case '--version':
      return gitVersion()
    case 'rev-parse':
      return gitRevParse()
    case 'status':
      return gitStatus()
    default:
      throw new Error(`unexpected command ${subCommand}`)
  }
}

export const mockRpc = {
  name: 'Git',
  commands: {
    'Exec.exec': exec,
  },
}

export const test = async ({ FileSystem, Workspace, Settings, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await SideBar.open('Source Control')

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(3)
  await expect(treeItems.nth(0).locator('.Label')).toHaveText('Changes')
  await expect(treeItems.nth(1).locator('.Label')).toHaveText('file-1.txttest')
  await expect(treeItems.nth(2).locator('.Label')).toHaveText('file-2.txttest')
}
