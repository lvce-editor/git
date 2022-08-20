const createFakeGitBinary = async (content) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const nodePath = await Platform.getNodePath()
  const gitPath = `${tmpDir}/git`
  await FileSystem.writeFile(
    gitPath,
    `#!${nodePath}
${content}`
  )
  await FileSystem.chmod(gitPath, '755')
  return gitPath
}

test('git.push-error-server', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(tmpDir)
  const gitPath = await createFakeGitBinary(`
console.info(\`Enumerating objects: 23, done.
Counting objects: 100% (23/23), done.
Delta compression using up to 8 threads
Compressing objects: 100% (13/13), done.
Writing objects: 100% (13/13), 5.33 KiB | 780.00 KiB/s, done.
Total 13 (delta 8), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (8/8), completed with 8 local objects.\`)
console.error(\`remote: Internal Server Error
To github.com:user/repo.git
 ! [remote rejected]           main -> main (Internal Server Error)
error: failed to push some refs to 'github.com:user/repo.git\`)
process.exit(128)
`)
  await Settings.update({
    'git.path': gitPath,
  })

  // act
  await QuickPick.open()
  await QuickPick.setValue('>Git: Push')
  await QuickPick.selectItem('Git: Push')
  // assert
  // if (useElectron) {
  //   // TODO
  // } else {
  //   const dialogErrorMessage = page.locator('#DialogBodyErrorMessage')
  //   await expect(dialogErrorMessage).toBeVisible()
  //   // TODO error message could be improved, vscode has very good/short git error messages
  //   await expect(dialogErrorMessage).toHaveText(
  //     'Error: Git: remote: Internal Server Error'
  //   )
  // }
})

export {}
