from pathlib import Path
paths=list(Path('node_modules/@lvce-editor/static-server/static').glob('*/packages/status-bar-worker/dist/statusBarWorkerMain.js'))
assert len(paths)==1,paths
p=paths[0]
s=p.read_text()
def replace(a,b):
 global s
 assert s.count(a)==1,(a[:80],s.count(a))
 s=s.replace(a,b)
s += "\nfunction traceStatus(event, data) { void invoke('Viewlet.sendMultiple', [], { diagnostic: 'status-refresh', event, data }).catch(() => {}); }\n"
replace('const handleExtensionManagementChange = async () => {', "const handleExtensionManagementChange = async () => {\n  traceStatus('notification', { keys: getKeys() });")
replace('    const newerState = await handleItemsChanged(newState);', "    const newerState = await handleItemsChanged(newState);\n    traceStatus('notification-result', {uid, initial: newerState.initial, same: newerState === newState, items: newerState.statusBarItemsLeft});")
replace('  if (newState.initial) {', "  traceStatus('render-out-of-band', { uid, initial: newState.initial, items: newState.statusBarItemsLeft });\n  if (newState.initial) {")
replace('  refreshVersions[uid] = refreshVersion;', "  refreshVersions[uid] = refreshVersion;\n  traceStatus('query-start', {uid, refreshVersion, initial: state.initial});")
replace('  if (refreshVersions[uid] !== refreshVersion) {', "  traceStatus('query-result', {uid, refreshVersion, currentVersion: refreshVersions[uid], items: statusBarItems});\n  if (refreshVersions[uid] !== refreshVersion) {")
replace('    if (current.statusBarItemsLeft !== statusBarItemsLeft) {', "    traceStatus('serial-update', {sameItems: current.statusBarItemsLeft === statusBarItemsLeft, uid: current.uid, initial: current.initial, items: updated.statusBarItemsLeft});\n    if (current.statusBarItemsLeft !== statusBarItemsLeft) {")
p.write_text(s)
print('Patched',p)
