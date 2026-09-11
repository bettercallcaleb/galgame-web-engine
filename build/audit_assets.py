from pathlib import Path
from PIL import Image
import hashlib,sys
root=Path(__file__).resolve().parents[1]/"assets"
all_ext={".png",".webp",".jpg",".jpeg",".svg"}
raster_ext={".png",".webp",".jpg",".jpeg"}
files=[p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in all_ext]
by={}
for p in files: by.setdefault(hashlib.sha256(p.read_bytes()).hexdigest(),[]).append(p)
exact=[g for g in by.values() if len(g)>1]
def dhash(p,n=16):
    im=Image.open(p).convert("L").resize((n+1,n)); pix=list(im.getdata()); x=0
    for y in range(n):
        row=pix[y*(n+1):(y+1)*(n+1)]
        for i in range(n): x=(x<<1)|(row[i]>row[i+1])
    return x
raster=[p for p in files if p.suffix.lower() in raster_ext]
hs=[(p,dhash(p)) for p in raster]; near=[]
for i,(p,a) in enumerate(hs):
    for q,b in hs[i+1:]:
        d=(a^b).bit_count()
        if d<=2:near.append((d,p,q))
print(f"external art files: {len(files)}")
print(f"exact duplicate groups: {len(exact)}")
print(f"near-duplicate raster pairs (dHash<=2): {len(near)}")
if exact or near:sys.exit(2)
