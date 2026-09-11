const SAVE_KEY = "galgame_web_engine_oss_save";
const SETTINGS_KEY = "galgame_web_engine_oss_settings";
const UNLOCK_KEY = "galgame_web_engine_oss_unlocks";
const storyUrl = "story/story.json";
const SEEN_KEY = "galgame_web_engine_oss_seen";
const STATS_KEY = "galgame_web_engine_oss_stats";

const svgData = svg => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const SAMPLE_ART = {
  title: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#17121c"/><stop offset=".55" stop-color="#493247"/><stop offset="1" stop-color="#9b6682"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><circle cx="1180" cy="350" r="180" fill="#edbfd4" opacity=".6"/><text x="120" y="315" fill="#fff" font-family="system-ui" font-size="92" font-weight="700">Your Visual Novel</text><text x="125" y="390" fill="#eadce4" font-family="system-ui" font-size="36">Galgame Web Engine starter scene</text></svg>`),
  room: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#281e2b"/><stop offset="1" stop-color="#75546b"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><rect x="110" y="140" width="520" height="460" rx="20" fill="#15131a" opacity=".75"/><rect x="825" y="500" width="560" height="175" rx="55" fill="#402e3b"/><text x="112" y="790" fill="#eadce5" font-family="system-ui" font-size="32">sample room · replace in ASSETS</text></svg>`),
  office: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#14202a"/><stop offset="1" stop-color="#304657"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><rect x="70" y="80" width="1460" height="410" rx="30" fill="#9fc8df" opacity=".18"/><rect x="260" y="590" width="1080" height="80" rx="24" fill="#1e2b34"/><text x="88" y="820" fill="#d5e2eb" font-family="system-ui" font-size="32">sample office</text></svg>`),
  cafe: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#43312f"/><stop offset="1" stop-color="#9b6b58"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><circle cx="280" cy="160" r="70" fill="#ffd59e" opacity=".65"/><circle cx="790" cy="130" r="60" fill="#ffd59e" opacity=".55"/><rect x="220" y="540" width="1160" height="85" rx="28" fill="#3a2927"/><text x="82" y="820" fill="#f4dfd3" font-family="system-ui" font-size="32">sample café</text></svg>`),
  rain: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#111923"/><stop offset="1" stop-color="#253f53"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><g stroke="#cbe5f4" opacity=".25" stroke-width="3"><path d="M130 0L30 330"/><path d="M430 0L330 330"/><path d="M730 0L630 330"/><path d="M1030 0L930 330"/><path d="M1330 0L1230 330"/></g><rect y="610" width="1600" height="290" fill="#0b1016" opacity=".6"/><text x="80" y="820" fill="#d9e8f0" font-family="system-ui" font-size="32">sample rainy street</text></svg>`),
  airport: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c48a74"/><stop offset=".45" stop-color="#664e5d"/><stop offset="1" stop-color="#20212b"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><rect x="80" y="70" width="1440" height="470" rx="18" fill="#f8d9c5" opacity=".12"/><rect x="170" y="625" width="1260" height="100" rx="36" fill="#242531"/><text x="80" y="820" fill="#f0dfdc" font-family="system-ui" font-size="32">sample airport</text></svg>`),
  linxia: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1200"><circle cx="350" cy="255" r="155" fill="#f0d3c7"/><path d="M190 265c0-150 82-230 165-230 115 0 170 93 158 242-58-90-115-130-214-120-55 6-88 45-109 108z" fill="#2a2227"/><path d="M185 1080c24-430 103-600 165-600 72 0 149 170 170 600z" fill="#c88eaa"/><circle cx="300" cy="255" r="11"/><circle cx="400" cy="255" r="11"/></svg>`),
  suqing: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1200"><circle cx="350" cy="255" r="155" fill="#efd2c4"/><path d="M185 270c0-160 86-235 170-235 115 0 170 88 158 250-60-96-134-142-230-110-42 14-73 48-98 95z" fill="#5b352b"/><path d="M185 1080c20-410 92-600 165-600 80 0 155 190 170 600z" fill="#d9b3c6"/><circle cx="300" cy="255" r="11"/><circle cx="400" cy="255" r="11"/></svg>`),
  amy: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1200"><circle cx="350" cy="255" r="155" fill="#eed1c4"/><path d="M180 280c0-165 80-245 173-245 114 0 170 96 165 245-65-92-135-127-239-94-42 14-71 45-99 94z" fill="#56382f"/><path d="M185 1080c18-420 95-600 165-600 75 0 150 180 170 600z" fill="#c9b0aa"/><circle cx="300" cy="255" r="11"/><circle cx="400" cy="255" r="11"/></svg>`),
  guning: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1200"><circle cx="350" cy="255" r="155" fill="#edd0c3"/><path d="M195 265c0-155 75-230 160-230 113 0 168 90 155 235-46-68-97-108-181-112-60-3-102 29-134 107z" fill="#25262c"/><path d="M175 1080c20-420 96-600 175-600 76 0 154 180 175 600z" fill="#31455e"/><circle cx="300" cy="255" r="11"/><circle cx="400" cy="255" r="11"/></svg>`),
  chenmo: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="1200"><rect width="700" height="1200" fill="#28313b"/><circle cx="350" cy="290" r="150" fill="#d2b4a6"/><path d="M190 290c15-165 90-235 172-235 112 0 163 92 150 215-66-78-184-108-322 20z" fill="#20252c"/><path d="M160 1200c35-460 110-650 190-650 86 0 165 190 195 650z" fill="#374658"/></svg>`),
  cg: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1f1722"/><stop offset="1" stop-color="#9b6682"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><circle cx="800" cy="370" r="180" fill="#efd0dc" opacity=".75"/><path d="M480 900c50-320 160-470 320-470s270 150 320 470z" fill="#c189a6"/><text x="800" y="780" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="38">Sample CG · replace me</text></svg>`),
  fourHearts: svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><rect width="1600" height="900" fill="#241724"/><g transform="translate(220 170)"><circle cx="170" cy="170" r="150" fill="#d99bb8"/><circle cx="500" cy="170" r="150" fill="#e1b3c6"/><circle cx="830" cy="170" r="150" fill="#c6a7a2"/><circle cx="1160" cy="170" r="150" fill="#637a96"/></g><text x="800" y="650" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="76" font-weight="700">Four Hearts Demo</text></svg>`)
};

const ASSETS = {
  title:SAMPLE_ART.title, promo:SAMPLE_ART.fourHearts,
  room:SAMPLE_ART.room, sofa:SAMPLE_ART.room, window:SAMPLE_ART.rain, entry:SAMPLE_ART.room,
  kitchen:SAMPLE_ART.room, porch:SAMPLE_ART.rain, morning:SAMPLE_ART.room,
  street_night:SAMPLE_ART.rain, breakfast_table:SAMPLE_ART.cafe, lamp_corner:SAMPLE_ART.cafe,
  porch_morning:SAMPLE_ART.rain, rain_glass:SAMPLE_ART.rain, car_rain:SAMPLE_ART.rain,
  city_night:SAMPLE_ART.rain, office_day:SAMPLE_ART.office, office_night:SAMPLE_ART.office,
  cafe_day:SAMPLE_ART.cafe, cafe_night:SAMPLE_ART.cafe, airport_sunset:SAMPLE_ART.airport,
  airport_morning:SAMPLE_ART.airport, skyline_night:SAMPLE_ART.rain, rain_drive:SAMPLE_ART.rain,
  kitchen_alt:SAMPLE_ART.room, morning_alt:SAMPLE_ART.room
};

const SPRITES = {
  neutral:SAMPLE_ART.linxia, blush:SAMPLE_ART.linxia, tea:SAMPLE_ART.linxia,
  tease:SAMPLE_ART.linxia, surprise:SAMPLE_ART.linxia, thoughtful:SAMPLE_ART.linxia,
  laugh:SAMPLE_ART.linxia, vulnerable:SAMPLE_ART.linxia, close:SAMPLE_ART.linxia,
  wave:SAMPLE_ART.linxia, suqing:SAMPLE_ART.suqing, amy:SAMPLE_ART.amy, guning:SAMPLE_ART.guning
};

const PORTRAITS = {
  linxia:{src:SAMPLE_ART.linxia,name:"林夏",role:"Heroine 1"},
  suqing:{src:SAMPLE_ART.suqing,name:"苏晴",role:"Heroine 2"},
  amy:{src:SAMPLE_ART.amy,name:"艾米",role:"Heroine 3"},
  guning:{src:SAMPLE_ART.guning,name:"顾宁",role:"Heroine 4"},
  chenmo:{src:SAMPLE_ART.chenmo,name:"陈默",role:"Supporting character"}
};

const DEFAULT_SPEAKER_SPRITES = {"林夏":"neutral","苏晴":"suqing","艾米":"amy","顾宁":"guning"};
const HEROINE_PORTRAIT_IDS = new Set(["linxia","suqing","amy","guning"]);

const BGM = {};
const SFX = {};

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
