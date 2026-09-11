function refreshContinue(){$("continueBtn").disabled = !localStorage.getItem(SAVE_KEY)}

function stopTyping(){
  clearInterval(typingTimer);
  typingTimer=null;
  typing=false;
}

function finishTyping(){
  if(!typing)return false;
  stopTyping();
  dialogue.textContent=fullText;
  const cb=afterTyping;afterTyping=null;
  if(cb)cb();
  return true;
}

function typeText(text,done){
  stopTyping();
  clearTimeout(autoTimer);
  fullText=text||"";
  dialogue.textContent="";
  typing=true;
  afterTyping=done;
  let i=0;
  const speed=skipMode?1:Math.max(8,settings.textSpeed);
  typingTimer=setInterval(()=>{
    i++;
    dialogue.textContent=fullText.slice(0,i);
    if(i>=fullText.length){
      stopTyping();
      const cb=afterTyping;afterTyping=null;
      if(cb)cb();
    }
  },speed);
}

function applyEffects(effects={}){
  for(const [k,v] of Object.entries(effects))vars[k]=(vars[k]||0)+Number(v||0);
  vars.affection=clamp(vars.affection,-9,99);
  for(const k of ["courage","tease","trust","career","honesty","memory","lx","sq","amy","gn","tension","secrecy","route_lx","route_sq","route_amy","route_gn","route_chaos","route_four"]){
    vars[k]=clamp(Number(vars[k]||0),0,99);
  }
  refreshStats();
}

function evalWhen(expr){
  if(!expr)return true;
  expr=String(expr).trim();
  if(expr.includes("||"))return expr.split("||").some(x=>evalWhen(x.trim()));
  if(expr.includes("&&"))return expr.split("&&").every(x=>evalWhen(x.trim()));
  const m=expr.match(/^([a-zA-Z_][\w]*)\s*(>=|<=|==|!=|>|<)\s*(-?\d+)$/);
  if(!m)return false;
  const left=Number(vars[m[1]]||0),right=Number(m[3]);
  return ({">=":left>=right,"<=":left<=right,"==":left===right,"!=":left!==right,">":left>right,"<":left<right})[m[2]];
}

function addHistory(node){
  if(!node.speaker||!node.text)return;
  history.push({speaker:node.speaker,text:node.text});
  if(history.length>120)history.shift();
}

function captureState(){return {current,vars:{...vars},history:[...history],lastChoiceCheckpoint,bgmName:currentBgmName}}
function restoreState(s){
  current=s.current;
  vars={affection:0,courage:0,tease:0,trust:0,career:0,suqing:0,honesty:0,memory:0,ngplus:0,lx:0,sq:0,amy:0,gn:0,tension:0,secrecy:0,route_lx:0,route_sq:0,route_amy:0,route_gn:0,route_chaos:0,route_four:0,...s.vars};
  history=Array.isArray(s.history)?s.history:[];
  lastChoiceCheckpoint=s.lastChoiceCheckpoint||null;
  setBgm(s.bgmName||null);
  refreshStats();
}

function saveGame(slot="auto",silent=false){
  if(!current)return;
  let all={};
  try{all=JSON.parse(localStorage.getItem(SAVE_KEY)||"{}")||{}}catch{}
  all[slot]={...captureState(),savedAt:new Date().toISOString()};
  localStorage.setItem(SAVE_KEY,JSON.stringify(all));
  refreshContinue();
  if(!silent)showToast(slot==="auto"?"已自动保存":"已保存");
}

function getSave(slot="auto"){
  try{return JSON.parse(localStorage.getItem(SAVE_KEY)||"{}")[slot]||null}catch{return null}
}

function loadGame(slot="auto"){
  const s=getSave(slot);
  if(!s)return false;
  restoreState(s);
  showGame();
  go(current,false,true);
  showToast("已读取");
  return true;
}

function showTitle(){
  setSceneMode("");
  busy=false;autoMode=false;clearTimeout(autoTimer);stopTyping();
  $("autoBtn").classList.remove("active");
  endingCard.classList.add("hidden");
  cinematic.classList.add("hidden");
  cgView.classList.add("hidden");
  phoneCard.classList.add("hidden");
  chapterCard.classList.add("hidden");
  dialogueWrap.classList.remove("hidden");
  clearCharacter();
  setBgm(null);
  setBg(ASSETS.title,{});
  gameScreen.classList.remove("active");
  titleScreen.classList.add("active");
  refreshContinue();
  if($("progressLine")&&nodes)$("progressLine").textContent=`v1.2.3-oss · ${seen.size}/${Object.keys(nodes).length} nodes · ${unlocks.endings.length}/${getEndingNodes().length} endings`;
}

function showGame(){titleScreen.classList.remove("active");gameScreen.classList.add("active")}

function startGame(){
  current=null;history=[];vars={affection:0,courage:0,tease:0,direct:0,guarded:0,trust:0,career:0,suqing:0,honesty:0,memory:0,ngplus:unlocks.endings.length?1:0,lx:0,sq:0,amy:0,gn:0,tension:0,secrecy:0,route_lx:0,route_sq:0,route_amy:0,route_gn:0,route_chaos:0,route_four:0};lastChoiceCheckpoint=null;refreshStats();
  runtimeStats.starts=(runtimeStats.starts||0)+1;persistStats();
  showGame();ensureAudio();go(story.meta.start,true,true);
}

function renderChoices(items){
  choices.innerHTML="";lastChoiceCheckpoint=captureState();
  const eligible=(items||[]).filter(item=>!item.when||evalWhen(item.when));
  eligible.forEach(item=>{
    const b=document.createElement("button");b.className=`choice${item.primary?" primary":""}`;b.textContent=item.text;
    b.onclick=e=>{e.stopPropagation();playSfx("choice_confirm",.8);runtimeStats.choices=(runtimeStats.choices||0)+1;persistStats();applyEffects(item.effects);go(item.next)};
    choices.appendChild(b);
  });
  if(!eligible.length&&items?.length){
    const fallback=items.find(item=>item.next&&nodes[item.next])||items[0];
    const b=document.createElement("button");b.className="choice primary";b.textContent="继续";
    b.onclick=e=>{e.stopPropagation();showToast("已自动恢复剧情");applyEffects(fallback.effects);go(fallback.next)};
    choices.appendChild(b);
  }
  return choices.children.length;
}

function finishScene(node){
  if(node.choice){if(skipMode)toggleSkip(false);renderChoices(node.choice);hint.textContent="选择你的回答";return}
  hint.textContent=node.next?(skipMode?"SKIP · 已读":"点击继续  ·  Enter / Space"):"";
  if(skipMode&&node.next){clearTimeout(autoTimer);autoTimer=setTimeout(()=>advance(),85);return}
  if(autoMode&&node.next){clearTimeout(autoTimer);autoTimer=setTimeout(()=>advance(),900+Math.min(1400,(node.text||"").length*25))}
}

async function showChapterNode(node){
  busy=true;if(npcCard)npcCard.classList.add("hidden");dialogueWrap.classList.add("hidden");
  chapterNo.textContent=node.chapter||"";chapterName.textContent=node.title||"";
  chapterCard.classList.remove("hidden");
  chapterMini.textContent=`${node.chapter||""} · ${node.title||""}`;
  await wait(1700);chapterCard.classList.add("hidden");dialogueWrap.classList.remove("hidden");busy=false;go(node.next);
}

async function showCinematic(node){
  busy=true;if(npcCard)npcCard.classList.add("hidden");dialogueWrap.classList.add("hidden");clearCharacter();setBg(node.bg||"window",node);cinematicText.textContent=node.text||"";cinematic.classList.remove("hidden");
  await wait(1700);cinematic.classList.add("hidden");dialogueWrap.classList.remove("hidden");busy=false;go(node.next);
}

async function showPhone(node){
  busy=true;if(npcCard)npcCard.classList.add("hidden");phoneFrom.textContent=node.from||"";phoneText.textContent=node.text||"";phoneCard.classList.remove("hidden");
  await wait(1700);phoneCard.classList.add("hidden");busy=false;go(node.next);
}

function showCG(node){
  busy=true;if(npcCard)npcCard.classList.add("hidden");dialogueWrap.classList.add("hidden");clearCharacter();cgImage.src=node.asset==="sample_cg"?SAMPLE_ART.cg:node.asset;cgCaption.textContent=node.caption||"";cgView.classList.remove("hidden");
  if(node.unlock)unlock("cg",node.unlock);
  const proceed=()=>{cgView.removeEventListener("click",proceed);cgView.classList.add("hidden");dialogueWrap.classList.remove("hidden");busy=false;go(node.next)};
  cgView.addEventListener("click",proceed);
}

function showEnding(node){
  busy=true;if(npcCard)npcCard.classList.add("hidden");stopTyping();toggleSkip(false);dialogueWrap.classList.add("hidden");endingTitle.textContent=node.title;endingSub.textContent=node.subtitle||"";
  const er=$("endingReason");
  if(er){er.textContent=node.reason?`为什么会到这里：${node.reason}`:"";er.classList.toggle("hidden",!node.reason)}
  const em=$("endingMeta");
  if(em)em.innerHTML=`<span>${escapeHtml(node.route||"路线结局")}</span><span>林夏 ${vars.lx||vars.affection||0}</span><span>苏晴 ${vars.sq||0}</span><span>艾米 ${vars.amy||0}</span><span>顾宁 ${vars.gn||0}</span><span>诚实 ${vars.honesty||0}</span>`;
  endingCard.classList.remove("hidden");
  if(node.unlock){const was=unlocks.endings.includes(node.unlock);unlock("ending",node.unlock);if(!was){runtimeStats.clears=(runtimeStats.clears||0)+1;persistStats()}}
  saveGame("auto",true);
}

function go(id,doSave=true,rerender=false){
  if(!nodes[id])return;
  if(!rerender&&current&&current!==id&&nodes[current]?.type!=="branch"){
    stateStack.push(captureState());
    if(stateStack.length>80)stateStack.shift();
  }
  current=id;
  const node=nodes[id];
  setSceneMode(node.mode||"");
  const wasSeen=seen.has(id);
  if(!rerender){seen.add(id);localStorage.setItem(SEEN_KEY,JSON.stringify([...seen]));}
  if(skipMode&&!wasSeen&&!rerender)toggleSkip(false);
  if(node.flash)triggerFlash();
  applyAudioCue(node,!rerender);
  if(node.type==="chapter"){showChapterNode(node);return}
  if(node.type==="cinematic"){showCinematic(node);return}
  if(node.type==="phone"){showPhone(node);return}
  if(node.type==="cg"){showCG(node);return}
  if(node.type==="ending"){showEnding(node);return}
  if(node.type==="branch"){
    const match=(node.branches||[]).find(b=>evalWhen(b.when));
    go(match?match.next:node.else,doSave,rerender);return
  }
  busy=false;showGame();dialogueWrap.classList.remove("hidden");endingCard.classList.add("hidden");
  setBg(node.bg||"room",node);renderCharacter(node);renderPortrait(node);speaker.textContent=node.speaker||"";choices.innerHTML="";hint.textContent="";
  if(!rerender)addHistory(node);
  if(node.effects&&!rerender)applyEffects(node.effects);
  if(doSave)saveGame("auto",true);
  typeText(node.text||"",()=>finishScene(node));
}

function advance(){
  if(!gameScreen.classList.contains("active")||busy)return;
  const node=nodes[current];if(!node)return;
  if(finishTyping())return;
  if(node.choice){
    if(!choices.children.length){
      dialogue.textContent=node.text||"";
      renderChoices(node.choice);
      hint.textContent="选择你的回答";
      showToast("已恢复选择项");
    }
    return;
  }
  if(node.next){go(node.next);return}
  if(node.type!=="ending"){
    hint.textContent="剧情状态异常 · 点击恢复";
    const b=document.createElement("button");b.className="choice primary";b.textContent="恢复到上一个节点";
    b.onclick=e=>{e.stopPropagation();rollback()};choices.innerHTML="";choices.appendChild(b);
  }
}
