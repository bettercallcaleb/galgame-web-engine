const $ = id => document.getElementById(id);
const background = $("background");
const characterLayer = $("characterLayer");
const characterSprite = $("characterSprite");
const titleScreen = $("titleScreen");
const gameScreen = $("gameScreen");
const dialogueWrap = $("dialogueWrap");
const speaker = $("speaker");
const dialogue = $("dialogue");
const choices = $("choices");
const hint = $("hint");
const chapterMini = $("chapterMini");
const chapterCard = $("chapterCard");
const chapterNo = $("chapterNo");
const chapterName = $("chapterName");
const cinematic = $("cinematic");
const cinematicText = $("cinematicText");
const phoneCard = $("phoneCard");
const phoneFrom = $("phoneFrom");
const phoneText = $("phoneText");
const cgView = $("cgView");
const cgImage = $("cgImage");
const cgCaption = $("cgCaption");
const endingCard = $("endingCard");
const endingTitle = $("endingTitle");
const endingSub = $("endingSub");
const modal = $("modal");
const modalTitle = $("modalTitle");
const modalBody = $("modalBody");
const toast = $("toast");
const npcCard = $("npcCard");
const npcPortrait = $("npcPortrait");
const npcName = $("npcName");
const npcRole = $("npcRole");

let story = null;
let nodes = null;
let current = null;
let history = [];
let vars = {affection:0,courage:0,tease:0,trust:0,career:0,suqing:0,honesty:0,memory:0,ngplus:0,lx:0,sq:0,amy:0,gn:0,tension:0,secrecy:0,route_lx:0,route_sq:0,route_amy:0,route_gn:0,route_chaos:0,route_four:0};
let typing = false;
let typingTimer = null;
let fullText = "";
let afterTyping = null;
let busy = false;
let autoMode = false;
let autoTimer = null;
let lastChoiceCheckpoint = null;
let audioCtx = null;
let rainGain = null;
let rainSceneFactor = 0.25;
let bgmPlayer = null;
let currentBgmName = null;
const activeSfx = new Set();
let settings = {textSpeed:28,rainVolume:0.16,bgmVolume:0.22,sfxVolume:0.55};
let unlocks = {cg:[],endings:[]};
let currentSprite = null;
let currentSpritePosition = "center";
let currentSpriteShot = "medium";
let currentBgKey = null;
let skipMode = false;
let seen = new Set();
let stateStack = [];
let currentMotion = "";
let runtimeStats = {choices:0,rollbacks:0,starts:0,clears:0};

function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function clamp(v,min,max){return Math.max(min,Math.min(max,v))}

function setBg(key,node={}){
  const src = ASSETS[key] || key;
  const focus = node.bgPosition || "center";
  const zoom = node.bgZoom || "1.035";
  const stateKey = `${key}|${focus}|${zoom}`;
  if(currentBgKey===stateKey)return;
  currentBgKey=stateKey;
  background.classList.remove("kenburns","sceneChange");
  background.style.backgroundImage = `url("${src}")`;
  background.style.backgroundPosition = focus;
  background.style.setProperty("--bg-zoom",zoom);
  const rainFactors={porch:1,entry:.42,room:.22,sofa:.2,window:.48,kitchen:.18,morning:0,street_night:.18,breakfast_table:0,lamp_corner:.12,porch_morning:0,rain_glass:.55,car_rain:.75,city_night:0,office_day:0,office_night:.08,cafe_day:0,cafe_night:.05,airport_sunset:0,airport_morning:0,skyline_night:0,rain_drive:.7,kitchen_alt:.12,morning_alt:0};
  rainSceneFactor=rainFactors[key] ?? (String(key).includes("title")?.16:.22);
  $("rainLayer").style.opacity = rainSceneFactor>0 ? String(Math.min(.28,.08+rainSceneFactor*.18)) : "0";
  updateRainGain();
  void background.offsetWidth;
  background.classList.add("sceneChange");
  requestAnimationFrame(()=>requestAnimationFrame(()=>background.classList.add("kenburns")));
}

function clearCharacter(){
  currentSprite = null;
  characterLayer.classList.add("hidden");
}

function setCharacter(key,position="center",shot="medium",motion=""){
  if(!key||!SPRITES[key])return;
  currentSprite=key;
  currentSpritePosition=position||"center";
  currentSpriteShot=shot||"medium";
  currentMotion=motion||"";
  characterLayer.classList.remove("hidden","left","center","right","swap","shot-full","shot-medium","shot-close","motion-soft-in","motion-enter-right","motion-enter-left","motion-sway");
  characterLayer.classList.add(currentSpritePosition,`shot-${currentSpriteShot}`);
  if(currentMotion)characterLayer.classList.add(`motion-${currentMotion}`);
  if(characterSprite.getAttribute("src")!==SPRITES[key]){
    characterLayer.classList.add("swap");
    setTimeout(()=>{
      characterSprite.src=SPRITES[key];
      requestAnimationFrame(()=>characterLayer.classList.remove("swap"));
    },90);
  }
}

function renderCharacter(node){
  const defaultKey = DEFAULT_SPEAKER_SPRITES[node.speaker||""];
  if(node.hideSprite&&!defaultKey){clearCharacter();return}
  const shot=node.spriteShot||(defaultKey?"medium":currentSpriteShot||"medium");
  if(node.sprite){setCharacter(node.sprite,node.spritePosition||"center",shot,node.spriteMotion||"soft-in");return}
  if(defaultKey){setCharacter(defaultKey,node.spritePosition||"center",shot,node.spriteMotion||"soft-in");return}
}

function renderPortrait(node){
  if(!npcCard)return;
  const key=node.portrait||"";
  if(!key||!PORTRAITS[key]){npcCard.classList.add("hidden");return}
  const p=PORTRAITS[key];
  if(HEROINE_PORTRAIT_IDS.has(key)&&node.speaker===p.name){npcCard.classList.add("hidden");return}
  npcPortrait.src=p.src;npcName.textContent=node.portraitName||p.name;npcRole.textContent=node.portraitRole||p.role;
  npcCard.classList.remove("hidden","right","talking","large");
  if((node.portraitSide||"left")==="right")npcCard.classList.add("right");
  if(node.portraitLarge&&!HEROINE_PORTRAIT_IDS.has(key))npcCard.classList.add("large");
  if(node.speaker===p.name||node.portraitTalking)npcCard.classList.add("talking");
}

function setSceneMode(mode="") {
  document.body.classList.remove("scene-car");
  if(mode==="car")document.body.classList.add("scene-car");
}

function showToast(text){
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(()=>toast.classList.remove("show"),1100);
}

function loadSettings(){
  try{settings={...settings,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||"{}")} }catch{}
  try{unlocks={...unlocks,...JSON.parse(localStorage.getItem(UNLOCK_KEY)||"{}")} }catch{}
  try{seen=new Set(JSON.parse(localStorage.getItem(SEEN_KEY)||"[]"))}catch{seen=new Set()}
}

function saveUnlocks(){localStorage.setItem(UNLOCK_KEY,JSON.stringify(unlocks))}

function unlock(type,id){
  const arr = type === "cg" ? unlocks.cg : unlocks.endings;
  if(!arr.includes(id)){arr.push(id);saveUnlocks()}
}

function refreshStats(){
  if($("affectionValue"))$("affectionValue").textContent = vars.lx||vars.affection||0;
  if($("suqingValue"))$("suqingValue").textContent = vars.sq||vars.suqing||0;
  if($("amyValue"))$("amyValue").textContent = vars.amy||0;
  if($("guningValue"))$("guningValue").textContent = vars.gn||0;
  if($("trustValue"))$("trustValue").textContent = vars.trust||0;
  if($("courageValue"))$("courageValue").textContent = vars.courage||0;
}
