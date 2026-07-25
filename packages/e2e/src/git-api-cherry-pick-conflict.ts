import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'git.cherry-pick-conflict'

export const test: Test = async ({ FileSystem, Git, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const fileName = 'file.txt'
  const filePath = `${tmpDir}/${fileName}`

  await Workspace.setPath(tmpDir)
  await Git.init({ initialBranch: 'main' })
  await Git.setConfig('user.name', 'Test User')
  await Git.setConfig('user.email', 'test@example.com')
  await FileSystem.writeFile(filePath, 'base\n')
  await Git.add(fileName)
  await Git.commit('base')
  await Git.branch('feature')
  await Git.checkout('feature')
  await FileSystem.writeFile(filePath, 'feature\n')
  await Git.add(fileName)
  await Git.commit('feature change')
  const featureRefRaw = await FileSystem.readFile(`${tmpDir}/.git/refs/heads/feature`)
  const featureRef = featureRefRaw.trim()
  await Git.checkout('main')
  await FileSystem.writeFile(filePath, 'main\n')
  await Git.add(fileName)
  await Git.commit('main change')

  let cherryPickError: unknown
  try {
    await Git.cherryPick(featureRef)
  } catch (error) {
    cherryPickError = error
  }

  if (!cherryPickError) {
    throw new Error('expected cherry-pick to fail with a conflict')
  }
  const conflictedContent = await FileSystem.readFile(filePath)
  if (!conflictedContent.includes('<<<<<<< HEAD') || !conflictedContent.includes('=======') || !conflictedContent.includes('>>>>>>>')) {
    throw new Error(`expected cherry-pick conflict markers, got ${conflictedContent}`)
  }
  await FileSystem.shouldHaveFile(`${tmpDir}/.git/CHERRY_PICK_HEAD`, `${featureRef}\n`)
}
