test('git.show-changed-files-in-side-bar', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/test.txt`, 'div')
  const gitPath = await createFakeGitBinary(`

console.log(\` M extensions/builtin.git/src/parts/GitRequests/GitRequests.js
 M packages/extension-host/src/parts/InternalCommand/InternalCommand.js
\`)
process.exit(0)
`)
  const configDir = await writeSettings({
    'git.path': gitPath,
  })
  const page = await runWithExtension({
    name: 'builtin.git',
    folder: tmpDir,
    env: {
      XDG_CONFIG_HOME: configDir,
    },
  })
  const testTxt = page.locator('text=test.txt')
  await testTxt.click()
  const tokenText = page.locator('.Token.Text')
  await tokenText.click()
  const activityBarItemSourceControl = page.locator('[title="Source Control"]')
  await activityBarItemSourceControl.click()
  await page.waitForSelector('.TreeItem:has-text("GitRequests.js")')
  await page.waitForSelector('.TreeItem:has-text("InternalCommand.js")')
})
