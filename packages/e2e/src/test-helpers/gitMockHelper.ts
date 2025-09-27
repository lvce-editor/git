import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface GitFixture {
  stdout?: string
  stderr?: string
  exitCode?: number
  error?: string
  delay?: number
}

export interface GitFixtures {
  [command: string]: GitFixture
}

interface ExecResult {
  stdout: string
  stderr: string
  exitCode: number
}

type MockExecFunction = (command: string, args: string[], options: any) => Promise<ExecResult>

interface MockRpc {
  name: string
  commands: {
    'Exec.exec': MockExecFunction
  }
}

/**
 * Creates a mock exec function from git command fixtures
 */
export const createMockExec = async (fixtureName: string): Promise<MockExecFunction> => {
  // Load the git command fixtures
  const fixturePath = join(__dirname, '../../fixtures/git-commands', `${fixtureName}.js`)
  const { gitFixtures }: { gitFixtures: GitFixtures } = await import(fixturePath)
  
  return (command: string, args: string[], options: any): Promise<ExecResult> => {
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
 */
export const createGitMockRpc = async (fixtureName: string): Promise<MockRpc> => {
  const mockExec = await createMockExec(fixtureName)
  
  return {
    name: 'Git',
    commands: {
      'Exec.exec': mockExec
    }
  }
}