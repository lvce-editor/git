/**
 * Detects the scheme of a given path/URI
 */
export const detectScheme = (path: string): 'file' | 'web' | 'other' => {
  if (typeof path !== 'string') {
    return 'other'
  }

  // Check for file:// scheme
  if (path.startsWith('file://')) {
    return 'file'
  }

  // Check for web schemes
  if (path.startsWith('web://') ||
      path.startsWith('vscode://') ||
      path.startsWith('https://') ||
      path.startsWith('http://')) {
    return 'web'
  }

  // Check if it's a local file path (no scheme)
  if (path.startsWith('/') ||
      path.match(/^[A-Za-z]:/) || // Windows drive letter
      !path.includes('://')) {
    return 'file'
  }

  // Default to other for unknown schemes
  return 'other'
}

/**
 * Checks if the current environment supports native git
 */
export const supportsNativeGit = (): boolean => {
  // In a real implementation, this would check if we're in a Node.js environment
  // vs a browser environment, or check for specific capabilities
  return typeof process !== 'undefined' && process.versions?.node
}
