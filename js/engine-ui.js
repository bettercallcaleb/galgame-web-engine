function updateRainGain(){
  if(!rainGain||!audioCtx)return;
  const target=clamp(settings.rainVolume*rainSceneFactor,0,1);
  const now=audioCtx.currentTime;
  try{
    rainGain.gain.cancelScheduledValues(now);
    rainGain.gain.setValueAtTime(rainGain.gain.value,now);
    rainGain.gain.linearRampToValueAtTime(target,now+.55);
  }catch{rainGain.gain.value=target}
}

function fadeAudio(audio,to,duration=650,stopAfter=false){
  if(!audio)return;
  const from=Number.isFinite(audio.volume)?audio.volume:0;
  const steps=Math.max(1,Math.round(duration/40));
  let i=0;
  const timer=setInterval(()=>{
    i++;
    audio.volume=clamp(from+(to-from)*(i/steps),0,1);
    if(i>=steps){
      clearInterval(timer);
      if(stopAfter){try{audio.pause();audio.currentTime=0}catch{}}
    }
  },duration/steps);
}

function setBgm(name){
  if(name===currentBgmName){
    if(bgmPlayer&&bgmPlayer.paused)bgmPlayer.play().catch(()=>{});
    if(bgmPlayer)fadeAudio(bgmPlayer,settings.bgmVolume,220,false);
    return;
  }
  const old=bgmPlayer;
  currentBgmName=name||null;
  bgmPlayer=null;
  if(old)fadeAudio(old,0,650,true);
  if(!name||!BGM[name])return;
  const a=new Audio(BGM[name]);
  a.loop=true;
  a.preload="auto";
  a.volume=0;
  bgmPlayer=a;
  a.play().then(()=>fadeAudio(a,settings.bgmVolume,850,false)).catch(()=>{});
}

function playSfx(name,volume=1,duck=0){
  if(!SFX[name]||settings.sfxVolume<=0)return;
  if(duck&&bgmPlayer){const restore=settings.bgmVolume;fadeAudio(bgmPlayer,Math.max(0,restore*(1-duck)),120,false);setTimeout(()=>{if(bgmPlayer)fadeAudio(bgmPlayer,restore,360,false)},520)}
  const a=new Audio(SFX[name]);
  a.preload="auto";
  a.volume=clamp(settings.sfxVolume*Number(volume||1),0,1);
  activeSfx.add(a);
  const done=()=>activeSfx.delete(a);
  a.addEventListener("ended",done,{once:true});
  a.addEventListener("error",done,{once:true});
  a.play().catch(done);
}

function playSfxCue(cue){
  if(!cue)return;
  if(typeof cue==="string"){playSfx(cue);return}
  if(Array.isArray(cue)){cue.forEach(playSfxCue);return}
  if(typeof cue==="object"&&cue.name){
    const run=()=>playSfx(cue.name,cue.volume??1,cue.duck??0);
    if(cue.delay)setTimeout(run,Number(cue.delay));else run();
  }
}

function applyAudioCue(node,playOneShot=true){
  if(node.bgm!==undefined)setBgm(node.bgm);
  if(playOneShot&&node.sfx)playSfxCue(node.sfx);
}

function ensureAudio(){
  if(audioCtx){
    if(audioCtx.state==="suspended")audioCtx.resume();
    updateRainGain();
    if(bgmPlayer&&bgmPlayer.paused)bgmPlayer.play().then(()=>fadeAudio(bgmPlayer,settings.bgmVolume,250,false)).catch(()=>{});
    return;
  }
  try{
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const len=audioCtx.sampleRate*2;
    const buffer=audioCtx.createBuffer(1,len,audioCtx.sampleRate);
    const data=buffer.getChannelData(0);
    let last=0;
    for(let i=0;i<len;i++){const white=Math.random()*2-1;last=(last*.96)+(white*.04);data[i]=last*2.2}
    const src=audioCtx.createBufferSource();src.buffer=buffer;src.loop=true;
    const filter=audioCtx.createBiquadFilter();filter.type="lowpass";filter.frequency.value=1300;
    rainGain=audioCtx.createGain();rainGain.gain.value=0;
    src.connect(filter).connect(rainGain).connect(audioCtx.destination);src.start();
    updateRainGain();
    if(currentBgmName&&!bgmPlayer)setBgm(currentBgmName);
  }catch{}
}

function openModal(title,html){modalTitle.textContent=title;modalBody.innerHTML=html;modal.classList.remove("hidden")}
function closeModal(){modal.classList.add("hidden")}

function openHistory(){
  const body=history.length?`<div class="historyList">${history.map(h=>`<div class="historyItem"><div class="historyWho">${escapeHtml(h.speaker)}</div><div>${escapeHtml(h.text)}</div></div>`).join("")}</div>`:`<div>还没有对话记录。</div>`;
  openModal("对话记录",body);
}

function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[c])}

function openGallery(){
  const base=[
    {type:"free",id:"title",label:"Starter visual",src:SAMPLE_ART.title},
    {type:"free",id:"fourhearts",label:"Four Hearts demo",src:SAMPLE_ART.fourHearts}
  ];
  const cgMap=new Map();
  for(const [id,node] of Object.entries(nodes||{})){
    if(node.type==="cg"&&node.asset){
      const key=node.unlock||id;
      if(!cgMap.has(key))cgMap.set(key,{type:"cg",id:key,label:`CG · ${node.caption||key}`,src:node.asset==="sample_cg"?SAMPLE_ART.cg:node.asset});
    }
  }
  const items=[...base,...cgMap.values()];
  const html=`<div class="routeSummary"><b>CG ${unlocks.cg.length}/${cgMap.size}</b><span>完整版回想</span></div><div class="galleryGrid">${items.map(x=>{
    const ok=x.type==="free"||unlocks.cg.includes(x.id);
    return `<div class="galleryItem ${ok?"":"locked"}">${x.src&&ok?`<img src="${x.src}" alt="">`:"<div>🔒</div>"}<div class="galleryLabel">${ok?escapeHtml(x.label):"未解锁"}</div></div>`
  }).join("")}</div>`;
  openModal("CG 回想",html);
}

function openRouteMap(){
  const hearts=[
    ["林夏","lx","v11_lx_chapter","雨夜之后最深的旧故事"],
    ["苏晴","sq","v11_sq_chapter","友情、保护与越界"],
    ["艾米","amy","v11_amy_chapter","没有过去的新开始"],
    ["顾宁","gn","v11_gn_chapter","职业、距离与边界"]
  ];
  const rows=hearts.map(([name,key,id,desc])=>`<div class="heartRow"><div><b>${name}</b><small>${desc}</small></div><div class="heartMeter"><i style="width:${Math.min(100,(vars[key]||0)*8)}%"></i></div><strong>${vars[key]||0}</strong></div>`).join("");
  const crosses=[
    ["林夏 × 苏晴","v11_ls_triangle_chapter"],["艾米 × 顾宁","v11_ag_triangle_chapter"],["林夏 × 艾米","v11_la_triangle_chapter"],["苏晴 × 顾宁","v11_sg_triangle_chapter"],["四重隐藏线","v11_four_chapter"]
  ].map(([n,id])=>`<span class="routeBadge">${seen.has(id)?"✓":"?"} ${n}</span>`).join("");
  openModal("四线关系",`<div class="relationshipPanel">${rows}</div><div class="relationshipMeta"><span>诚实 <b>${vars.honesty||0}</b></span><span>隐瞒 <b>${vars.secrecy||0}</b></span><span>张力 <b>${vars.tension||0}</b></span></div><div class="crossRoutes">${crosses}</div><div class="routeTip">这不是“好感度最高就赢”的系统。诚实、隐瞒、交叉选择和二周目状态会改变可进入的关系结构。</div>`);
}

function openSettings(){
  const html=`
    <div class="settingsRow"><div>文字速度</div><input id="speedRange" type="range" min="8" max="60" value="${settings.textSpeed}"><div id="speedVal">${settings.textSpeed}</div></div>
    <div class="settingsRow"><div>环境雨声</div><input id="rainRange" type="range" min="0" max="40" value="${Math.round(settings.rainVolume*100)}"><div id="rainVal">${Math.round(settings.rainVolume*100)}</div></div>
    <div class="settingsRow"><div>BGM</div><input id="bgmRange" type="range" min="0" max="60" value="${Math.round(settings.bgmVolume*100)}"><div id="bgmVal">${Math.round(settings.bgmVolume*100)}</div></div>
    <div class="settingsRow"><div>音效</div><input id="sfxRange" type="range" min="0" max="100" value="${Math.round(settings.sfxVolume*100)}"><div id="sfxVal">${Math.round(settings.sfxVolume*100)}</div></div>
    <button id="resetProgress" class="menu">清除全部存档与解锁</button>`;
  openModal("设定",html);
  const speed=$("speedRange"),rain=$("rainRange"),bgm=$("bgmRange"),sfx=$("sfxRange");
  const persist=()=>localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));
  speed.oninput=()=>{$("speedVal").textContent=speed.value;settings.textSpeed=Number(speed.value);persist()};
  rain.oninput=()=>{$("rainVal").textContent=rain.value;settings.rainVolume=Number(rain.value)/100;persist();ensureAudio();updateRainGain()};
  bgm.oninput=()=>{$("bgmVal").textContent=bgm.value;settings.bgmVolume=Number(bgm.value)/100;persist();ensureAudio();if(bgmPlayer)bgmPlayer.volume=settings.bgmVolume};
  sfx.oninput=()=>{$("sfxVal").textContent=sfx.value;settings.sfxVolume=Number(sfx.value)/100;persist();ensureAudio()};
  $("resetProgress").onclick=()=>{if(confirm("清除全部存档、CG 和结局解锁？")){localStorage.removeItem(SAVE_KEY);localStorage.removeItem(UNLOCK_KEY);localStorage.removeItem(SEEN_KEY);localStorage.removeItem(STATS_KEY);seen=new Set();unlocks={cg:[],endings:[]};runtimeStats={choices:0,rollbacks:0,starts:0,clears:0};refreshContinue();showToast("已清除");closeModal()}};
}

function openSaveLoad(mode){
  let all={};try{all=JSON.parse(localStorage.getItem(SAVE_KEY)||"{}")||{}}catch{}
  const slots=["slot1","slot2","slot3"];
  const html=`<div class="saveGrid">${slots.map((s,i)=>{
    const d=all[s];
    const stamp=d?.savedAt?new Date(d.savedAt).toLocaleString():"空";
    return `<div class="saveSlot"><div><b>存档 ${i+1}</b><br><small>${escapeHtml(stamp)}</small></div><button class="menu slotAction" data-slot="${s}">${mode==="save"?"保存":"读取"}</button>${d?`<button class="menu slotDelete" data-slot="${s}">删除</button>`:"<span></span>"}</div>`
  }).join("")}</div>`;
  openModal(mode==="save"?"保存游戏":"读取游戏",html);
  document.querySelectorAll(".slotAction").forEach(b=>b.onclick=()=>{const s=b.dataset.slot;if(mode==="save"){saveGame(s);closeModal()}else if(loadGame(s)){closeModal()}});
  document.querySelectorAll(".slotDelete").forEach(b=>b.onclick=()=>{const s=b.dataset.slot;delete all[s];localStorage.setItem(SAVE_KEY,JSON.stringify(all));openSaveLoad(mode)});
}

function toggleAuto(){autoMode=!autoMode;$("autoBtn").classList.toggle("active",autoMode);showToast(autoMode?"自动播放 开":"自动播放 关");if(autoMode&&!typing){const n=nodes[current];if(n?.next&&!n.choice)autoTimer=setTimeout(()=>advance(),900)}}

function toggleSkip(force){
  const before=skipMode;
  skipMode=typeof force==="boolean"?force:!skipMode;
  const b=$("skipBtn");if(b)b.classList.toggle("active",skipMode);
  if(skipMode)autoMode=false;
  $("autoBtn").classList.toggle("active",autoMode);
  clearTimeout(autoTimer);
  if(before!==skipMode)showToast(skipMode?"跳过已读 开":"跳过已读 关");
  if(skipMode&&!typing){const node=nodes[current];if(node?.next&&!node.choice&&seen.has(current))autoTimer=setTimeout(()=>advance(),70)}
}

function rollback(){
  if(busy||!stateStack.length){showToast("没有更早的画面");return}
  runtimeStats.rollbacks=(runtimeStats.rollbacks||0)+1;persistStats();
  const s=stateStack.pop();
  stopTyping();clearTimeout(autoTimer);autoMode=false;skipMode=false;
  $("autoBtn").classList.remove("active");$("skipBtn").classList.remove("active");
  restoreState(s);go(current,false,true);showToast("回退一幕");
}

function triggerFlash(){
  const f=$("flashLayer");if(!f)return;
  f.classList.remove("flash");void f.offsetWidth;f.classList.add("flash");
}

function toggleFullscreen(){
  if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();
}

function replayLastChoice(){
  if(!lastChoiceCheckpoint){showTitle();return}
  endingCard.classList.add("hidden");dialogueWrap.classList.remove("hidden");busy=false;restoreState(lastChoiceCheckpoint);go(current,false,true);
}

function persistStats(){localStorage.setItem(STATS_KEY,JSON.stringify(runtimeStats))}

function getEndingNodes(){return Object.entries(nodes||{}).filter(([,n])=>n.type==="ending"&&n.unlock)}

function openEndings(){
  const ends=getEndingNodes();
  const html=`<div class="statsPanel"><div><b>${unlocks.endings.length}/${ends.length}</b><small>结局</small></div><div><b>${seen.size}</b><small>已读节点</small></div><div><b>${runtimeStats.choices||0}</b><small>选择次数</small></div></div><div class="endingGrid">${ends.map(([id,n])=>{const ok=unlocks.endings.includes(n.unlock);return `<div class="endingTile ${ok?"done":"locked"}"><b>${ok?escapeHtml(n.title):"？？？"}</b><small>${ok?escapeHtml(n.route||"已解锁"):"尚未抵达"}</small></div>`}).join("")}</div>`;
  openModal("结局一览",html);
}

function openCharacters(){
  const chars=story.meta.characters||[];
  const html=`<div class="profileGrid">${chars.map(c=>{const ok=!c.unlockSeen||seen.has(c.unlockSeen)||c.id==="linxia";return `<div class="profileCard ${ok?"":"locked"}">${ok?`<img src="${PORTRAITS[c.id]?.src||c.portrait||""}" alt="">`:""}<h3>${ok?escapeHtml(c.name):"？？？"}</h3><p>${ok?escapeHtml(c.bio):"继续游戏解锁人物资料。"}</p></div>`}).join("")}</div>`;
  openModal("人物资料",html);
}

function achievementState(a){
  if(a.kind==="ending")return unlocks.endings.includes(a.target);
  if(a.kind==="cg")return unlocks.cg.includes(a.target);
  if(a.kind==="seen")return seen.has(a.target);
  if(a.kind==="seenCount")return seen.size>=a.count;
  if(a.kind==="choices")return (runtimeStats.choices||0)>=a.count;
  if(a.kind==="clears")return (runtimeStats.clears||0)>=a.count;
  return false;
}

function openAchievements(){
  const list=story.meta.achievements||[];
  const done=list.filter(achievementState).length;
  openModal("成就",`<div class="routeSummary"><b>${done}/${list.length}</b><span>完成</span></div><div class="achievementGrid">${list.map(a=>{const ok=achievementState(a);return `<div class="achievement ${ok?"done":""}"><div class="icon">${ok?"◆":"◇"}</div><b>${escapeHtml(a.name)}</b><small>${escapeHtml(ok?a.desc:(a.hidden?"隐藏成就":"尚未完成"))}</small></div>`}).join("")}</div>`);
}

function startChapter(ch){
  if(ch.unlockSeen&&!seen.has(ch.unlockSeen)&&!unlocks.endings.length){showToast("该章节尚未解锁");return}
  closeModal();current=null;history=[];lastChoiceCheckpoint=null;stateStack=[];
  vars={affection:0,courage:0,tease:0,direct:0,guarded:0,trust:0,career:0,suqing:0,honesty:0,memory:0,ngplus:unlocks.endings.length?1:0,lx:0,sq:0,amy:0,gn:0,tension:0,secrecy:0,route_lx:0,route_sq:0,route_amy:0,route_gn:0,route_chaos:0,route_four:0,...(ch.preset||{})};
  refreshStats();showGame();ensureAudio();go(ch.start,true,true);
}

function openChapters(){
  const chapters=story.meta.chapters||[];
  const html=`<div class="chapterGrid">${chapters.map((c,i)=>{const ok=!c.unlockSeen||seen.has(c.unlockSeen)||i===0||unlocks.endings.length;return `<button class="chapterTile ${ok?"":"locked"}" data-ch="${i}" ${ok?"":"disabled"}><b>${escapeHtml(c.label)}</b><small>${escapeHtml(ok?c.desc:"继续游戏后解锁")}</small></button>`}).join("")}</div>`;
  openModal("章节选择",html);document.querySelectorAll(".chapterTile:not(.locked)").forEach(b=>b.onclick=()=>startChapter(chapters[Number(b.dataset.ch)]));
}

function openMusic(){
  const labels={rainy_night:"雨夜的街道",warm_room:"温暖的室内",tender:"心跳的距离",confession:"终于说出口",morning:"雨后的早晨",goodbye:"分别之前",after_rain:"雨后的，还有你",city_evening:"城市夜色",office_day:"周一办公室",cafe_date:"没有 deadline 的咖啡",airport_future:"出发层",weekend_light:"周末不是加班"};
  const html=`<div class="musicList">${Object.keys(BGM).map(k=>`<div class="musicRow"><div><b>${escapeHtml(labels[k]||k)}</b><br><small>${k}</small></div><div class="musicActions"><button class="miniBtn musicPlay" data-music="${k}">播放</button></div></div>`).join("")}<div class="musicRow"><div><b>停止播放</b></div><div class="musicActions"><button id="musicStop" class="miniBtn">停止</button></div></div></div>`;
  openModal("音乐室",html);document.querySelectorAll(".musicPlay").forEach(b=>b.onclick=()=>{ensureAudio();setBgm(b.dataset.music)});$("musicStop").onclick=()=>{if(bgmPlayer){fadeAudio(bgmPlayer,0,300,true);bgmPlayer=null;currentBgmName=null}};
}
