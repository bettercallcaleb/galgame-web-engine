from pathlib import Path
import json,re,sys
from collections import defaultdict,deque
root=Path(__file__).resolve().parents[1]
story=json.loads((root/'story/story.json').read_text())
nodes=story['nodes']
refs=[]
for nid,node in nodes.items():
    for key in ('next','else'):
        if node.get(key):refs.append((nid,key,node[key]))
    for c in node.get('choice',[]):
        if c.get('next'):refs.append((nid,'choice',c['next']))
    for b in node.get('branches',[]):
        if b.get('next'):refs.append((nid,'branch',b['next']))
broken=[x for x in refs if x[2] not in nodes]
adj=defaultdict(list)
for a,_,b in refs:adj[a].append(b)
roots={story['meta']['start']}|{c['start'] for c in story['meta'].get('chapters',[]) if c.get('start') in nodes}
seen=set(roots);q=deque(roots)
while q:
    a=q.popleft()
    for b in adj[a]:
        if b not in seen:seen.add(b);q.append(b)
engine='\n'.join(p.read_text() for p in sorted((root/'js').glob('engine*.js')))
assets_block=re.search(r'const ASSETS = \{(.*?)\n\};',engine,re.S).group(1)
sprites_block=re.search(r'const SPRITES = \{(.*?)\n\};',engine,re.S).group(1)
bgkeys=set(re.findall(r'([a-zA-Z0-9_]+)\s*:',assets_block))
spritekeys=set(re.findall(r'([a-zA-Z0-9_]+)\s*:',sprites_block))
missing_bg=[];missing_sprite=[];missing_files=[]
for nid,node in nodes.items():
    bg=node.get('bg')
    if bg and bg not in bgkeys and not str(bg).startswith('assets/'):missing_bg.append((nid,bg))
    sp=node.get('sprite')
    if sp and sp not in spritekeys:missing_sprite.append((nid,sp))
    if node.get('type')=='cg' and node.get('asset') and ('/' in str(node['asset'])) and not (root/node['asset']).exists():missing_files.append((nid,node['asset']))
endings=[(k,v) for k,v in nodes.items() if v.get('type')=='ending']
cgs=[(k,v) for k,v in nodes.items() if v.get('type')=='cg']
choices=sum(len(v.get('choice',[])) for v in nodes.values())
print(f'nodes: {len(nodes)}')
print(f'references: {len(refs)}')
print(f'choice options: {choices}')
print(f'endings: {len(endings)}')
print(f'CG nodes: {len(cgs)}')
print(f'chapter roots: {len(roots)}')
print(f'broken refs: {len(broken)}')
print(f'unreachable from game/chapter roots: {len(nodes)-len(seen)}')
print(f'missing background keys: {len(missing_bg)}')
print(f'missing sprite keys: {len(missing_sprite)}')
print(f'missing CG files: {len(missing_files)}')
if broken:print('BROKEN',broken[:20])
if len(nodes)-len(seen):print('UNREACHABLE',sorted(set(nodes)-seen)[:30])
if missing_bg:print('MISSING_BG',missing_bg[:20])
if missing_sprite:print('MISSING_SPRITE',missing_sprite[:20])
if missing_files:print('MISSING_FILE',missing_files[:20])
if broken or len(nodes)-len(seen) or missing_bg or missing_sprite or missing_files:sys.exit(2)
