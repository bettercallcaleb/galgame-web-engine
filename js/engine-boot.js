$("newGameBtn").onclick=()=>startGame();
$("continueBtn").onclick=()=>{ensureAudio();if(!loadGame("auto")){const slots=["slot1","slot2","slot3"];for(const s of slots)if(loadGame(s))return}};
$("galleryBtn").onclick=openGallery;
if($("chapterBtn"))$("chapterBtn").onclick=openChapters;
if($("endingsBtn"))$("endingsBtn").onclick=openEndings;
if($("charactersBtn"))$("charactersBtn").onclick=openCharacters;
if($("achievementsBtn"))$("achievementsBtn").onclick=openAchievements;
if($("musicBtn"))$("musicBtn").onclick=openMusic;
$("routeBtn").onclick=openRouteMap;
if($("relationshipBtn"))$("relationshipBtn").onclick=openRouteMap;
if($("stats"))$("stats").onclick=openRouteMap;
$("settingsBtnTitle").onclick=openSettings;
$("settingsBtnGame").onclick=openSettings;
$("historyBtn").onclick=openHistory;
$("saveBtn").onclick=()=>openSaveLoad("save");
$("loadBtn").onclick=()=>openSaveLoad("load");
$("titleBtn").onclick=showTitle;
$("autoBtn").onclick=toggleAuto;
$("skipBtn").onclick=()=>toggleSkip();
$("rollbackBtn").onclick=rollback;
$("modalClose").onclick=closeModal;
$("modal").addEventListener("click",e=>{if(e.target.classList.contains("modalShade"))closeModal()});
$("endingTitleBtn").onclick=showTitle;
$("endingReplayBtn").onclick=replayLastChoice;

document.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&!b.classList.contains("choice"))playSfx("ui_click",.42)},true);

gameScreen.addEventListener("click",e=>{if(e.target.closest("button")||e.target.closest("#phoneCard")||!modal.classList.contains("hidden"))return;ensureAudio();advance()});
document.addEventListener("keydown",e=>{
  if(!modal.classList.contains("hidden")){if(e.key==="Escape")closeModal();return}
  if(e.key.toLowerCase()==="h"){document.body.classList.toggle("uiHidden");return}
  if(!gameScreen.classList.contains("active"))return;
  if(e.key==="Escape"){showTitle();return}
  if(e.key.toLowerCase()==="a"){toggleAuto();return}
  if(e.key.toLowerCase()==="s"){toggleSkip();return}
  if(e.key.toLowerCase()==="f"){toggleFullscreen();return}
  if(e.key==="Backspace"){e.preventDefault();rollback();return}
  if(e.key===" "||e.key==="Enter"){e.preventDefault();advance()}
});

if(window.matchMedia&&window.matchMedia("(pointer:fine)").matches){
  document.addEventListener("pointermove",e=>{
    const nx=e.clientX/innerWidth-.5, ny=e.clientY/innerHeight-.5;
    document.documentElement.style.setProperty("--bgpx",`${(-nx*5).toFixed(2)}px`);
    document.documentElement.style.setProperty("--bgpy",`${(-ny*3).toFixed(2)}px`);
    document.documentElement.style.setProperty("--spx",`${(nx*8).toFixed(2)}px`);
    document.documentElement.style.setProperty("--spy",`${(ny*5).toFixed(2)}px`);
  });
}

async function boot(){
  loadSettings();
  try{
    const r=await fetch(storyUrl,{cache:"no-store"});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    story=await r.json();nodes=story.nodes;
    setBg(ASSETS.title,{});refreshContinue();
    if($("progressLine"))$("progressLine").textContent=`v1.2.3-oss · ${seen.size}/${Object.keys(nodes).length} nodes · ${unlocks.endings.length}/${getEndingNodes().length} endings`;
  }catch(e){
    document.body.innerHTML=`<pre style="color:white;padding:24px">无法载入 story/story.json\n${escapeHtml(e.message)}\n\n请用 start.sh 启动，不要直接双击 index.html。</pre>`;
  }
}
boot();
