export const name = 'git.show-changed-files-in-side-bar-error'

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
  throw new Error(`oops`)
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
export const test = async ({
  FileSystem,
  Workspace,
  SideBar,
  Locator,
  expect,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)

  // act
  await SideBar.open('Source Control')

  //  assert
  const error = await Locator('.Error')
  await expect(error).toBeVisible()
  await expect(error).toHaveText('Error: Git: oops')
  // TODO should improve error message and buttons
  // 1. try again button
  // 2. open git log button
}
