export const commandLoadFixture = async (fixtureUrl: string): Promise<void> => {
  console.log('load fixture', fixtureUrl)
  const importUrl = `${fixtureUrl}/git.js`
  const module = await import(importUrl)
  console.log({ module })
}
