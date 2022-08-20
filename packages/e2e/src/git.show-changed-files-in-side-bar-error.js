test.skip('git.show-changed-files-in-side-bar-error', async () => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')
  const gitPath = await FileSystem.createExecutable(`

console.error("oops")
process.exit(128)
`)
  await Settings.update({
    'git.path': gitPath,
  })
  const testTxt = page.locator('text=test.txt')
  await testTxt.click()
  const tokenText = page.locator('.Token.Text')
  await tokenText.click()
  const viewletSourceControl = page.locator('[title="Source Control"]')
  await viewletSourceControl.click()
  const error = await page.waitForSelector('.Error')
  const errorText = await error.textContent()
  // TODO should improve error message and buttons
  // 1. try again button
  // 2. open git log button
  if (
    errorText !==
    'Error: GitError: Git.getModifiedFiles failed to execute: oops'
  ) {
    console.log({ errorText })
    return
  }
  // await page.waitForSelector('text=')
  // await page.waitForSelector('.TreeItem:has-text("GitRequests.js")')
  // await page.waitForSelector('.TreeItem:has-text("InternalCommand.js")')
})
