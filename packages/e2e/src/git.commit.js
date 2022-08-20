test.skip('git.commit', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  const gitPath = await FileSystem.createExecutable(`

const handleGitStatus = () => {
  console.info('')
}

const handleGitAdd = () => {
  process.exit(0)
}

const handleGitCommit = () => {
  process.exit(0)
}

const handleGitPush = () => {
  process.exit(0)
}

switch(process.argv[2]){
  case 'status':
    handleGitStatus()
    break
  case 'add':
    handleGitAdd()
    break
  case 'commit':
    handleGitCommit()
    break
  case 'push':
    handleGitPush()
    break
  default:
    throw new Error(\`unexpected invocation \${process.argv[1]}\`)

}
`)
  await Settings.update({
    'git.path': gitPath,
  })
  await SideBar.open('Source Control')
  const sourceControlInput = Locator('[aria-label="Source Control Input"]')
  await sourceControlInput.focus()
  await sourceControlInput.type('test message')

  // act
  // TODO should also test loading indicator
  await KeyBoard.press('Control+Enter')
  await expect(sourceControlInput).toHaveText('')
})

export {}
