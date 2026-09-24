from pathlib import Path
paths=list(Path('node_modules/@lvce-editor/static-server/static').glob('*/packages/renderer-worker/dist/rendererWorkerMain.js'))
assert len(paths)==1,paths
p=paths[0]
s=p.read_text()
def replace(a,b):
 global s
 assert s.count(a)==1,(a[:80],s.count(a))
 s=s.replace(a,b)
replace('  const result = await fn(oldState, ...args);\n  if (getByUid(id) !== instance)', '''  const result = await fn(oldState, ...args);
  void state$A.rpc.invoke('Viewlet.sendMultiple', [], { diagnostic: 'effect-result', id, key, current: getByUid(id) === instance, commands: result?.commands });
  if (getByUid(id) !== instance)''')
replace('const callGlobalEvent = async (state, eventName, ...args) => {', '''const callGlobalEvent = async (state, eventName, ...args) => {
  void state$A.rpc.invoke('Viewlet.sendMultiple', [], { diagnostic: 'global-start', eventName, uid: state.uid });''')
replace('  for (const {\n    oldState,\n    newState,\n    value\n  } of results) {', '''  void state$A.rpc.invoke('Viewlet.sendMultiple', [], { diagnostic: 'global-results', eventName, results: results.map(x => ({uid:x.value.state.uid, commands:x.newState?.commands})) });
  for (const {
    oldState,
    newState,
    value
  } of results) {''')
replace("const refreshSourceControlBadgeCount = async state => {", """const refreshSourceControlBadgeCount = async state => {
  void state$A.rpc.invoke('Viewlet.sendMultiple', [], { diagnostic: 'badge-start', uid: state.uid });""")
replace("    return setBadgeCount(state, SourceControl, badgeCount);", """    void state$A.rpc.invoke('Viewlet.sendMultiple', [], { diagnostic: 'badge-end', uid: state.uid, badgeCount });
    return setBadgeCount(state, SourceControl, badgeCount);""")
replace("    const newState = await value.factory.Commands[eventName](oldState, ...args);", """    const newState = await value.factory.Commands[eventName](oldState, ...args);
    void state$A.rpc.invoke('Viewlet.sendMultiple', [], { diagnostic: 'global-handler-result', eventName, uid: oldState.uid, commands: newState?.commands });""")
p.write_text(s)
