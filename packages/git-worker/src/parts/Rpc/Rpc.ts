export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  const result = await globalThis.rpc.invoke(method, ...params)
  return result
}
