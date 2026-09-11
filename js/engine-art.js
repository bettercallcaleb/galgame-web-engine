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
