import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Creates a mock exec function from git command fixtures
 * @param {string} fixtureName - Name of the git command fixture to use
 * @returns {Promise<Function>}
 */
export const createMockExec = async (fixtureName) => {
  // Load the git command fixtures
  const fixturePath = join(__dirname, '../../fixtures/git-commands', `${fixtureName}.js`)
  const { gitFixtures } = await import(fixturePath)
  
  return (command, args, options) => {
    if (command !== 'git') {
      throw new Error(`Unexpected command: ${command}`)
    }
    
    const subCommand = args[0]
    const fixture = gitFixtures[subCommand]
    
    if (!fixture) {
      throw new Error(`No fixture found for git command: ${subCommand}`)
    }
    
    // Handle errors
    if (fixture.error) {
      throw new Error(fixture.error)
    }
    
    // Return a promise to handle async behavior
    return new Promise((resolve) => {
      const delay = fixture.delay || 0
      setTimeout(() => {
        resolve({
          stdout: fixture.stdout || '',
          stderr: fixture.stderr || '',
          exitCode: fixture.exitCode || 0
        })
      }, delay)
    })
  }
}

/**
 * Creates a mockRpc object for git e2e tests
 * @param {string} fixtureName - Name of the git command fixture to use
 * @returns {Promise<object>}
 */
export const createGitMockRpc = async (fixtureName) => {
  const mockExec = await createMockExec(fixtureName)
  
  return {
    name: 'Git',
    commands: {
      'Exec.exec': mockExec
    }
  }
}