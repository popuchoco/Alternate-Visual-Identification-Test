// Hue of the Fake — a short, escalating browser horror game.
// Everything is local/static so it can be hosted directly on GitHub Pages.

const $ = (id) => document.getElementById(id);
const DEFAULT_PAGE_TITLE = document.title;

const screens = {
  title: $('screen-title'), intro: $('screen-intro'), plates: $('screen-plates'),
  hue: $('screen-hue'), interlude: $('screen-interlude'), vision: $('screen-vision'),
  acuity: $('screen-acuity'), records: $('screen-records'), fakes: $('screen-fakes'), ending: $('screen-ending')
};

const plates = [
  { number: 74, options: [74, 21, 47, '看不到'], label: '明顯色差', figureHue: 20, fieldHue: 150, hueJitter: 5 },
  { number: 8, options: [8, 3, 6, '看不到'], label: '基礎紅綠辨讀', figureHue: 17, fieldHue: 125, hueJitter: 6 },
  { number: 42, options: [42, 24, 12, '看不到'], label: '中等色差', figureHue: 18, fieldHue: 96, hueJitter: 7 },
  { number: 35, options: [35, 53, 3, '看不到'], label: '近似色辨讀', figureHue: 21, fieldHue: 70, hueJitter: 7 },
  { number: 16, options: [16, 18, 76, '看不到'], label: '高度近似色', figureHue: 25, fieldHue: 49, hueJitter: 6 },
  { number: 6, options: [6, 9, 5, '看不到'], label: '極近色辨讀', figureHue: 29, fieldHue: 40, hueJitter: 4 }
];

const hueRounds = [
  { name: '青玻璃', count: 6, start: 163, end: 194, saturation: 61, lightness: 60 },
  { name: '晴空藍', count: 7, start: 198, end: 230, saturation: 64, lightness: 62 },
  { name: '莓果紫', count: 8, start: 309, end: 342, saturation: 58, lightness: 62 },
  { name: '柑橘珊瑚', count: 10, start: 18, end: 51, saturation: 68, lightness: 62 }
];

const facesData = [
  { id: 0, isFake: false, img: 'images/person_normal_m.jpg', label: '受試者 A' },
  { id: 1, isFake: true, img: 'images/person_fake_m.jpg', label: '受試者 B' },
  { id: 2, isFake: false, img: 'images/person_normal_f.jpg', label: '受試者 C' },
  { id: 3, isFake: true, img: 'images/person_fake_f.jpg', label: '受試者 D' },
  { id: 4, isFake: false, img: 'images/balloon_normal_rect.jpg', label: '影像紀錄 E' },
  { id: 5, isFake: true, img: 'images/balloon_horror_rect.jpg', label: '影像紀錄 F' }
];

const visionSteps = [
  {
    img: 'images/balloon_normal.jpg',
    instruction: '請選擇你在圓形影像中看到的東西。',
    options: ['熱氣球', '小房子', '教堂', '什麼都沒有'],
    correct: '熱氣球'
  },
  {
    img: 'images/house_normal.jpg',
    instruction: '繼續。這次你看到的是？',
    options: ['熱氣球', '鄉村小屋', '紅屋頂教堂', '道路'],
    correct: '鄉村小屋'
  },
  {
    img: 'images/balloon_horror.jpg',
    instruction: '影像開始變得不穩定……你看到什麼？',
    options: ['正常熱氣球', '扭曲的東西', '一張臉', '我看不清'],
    correct: '扭曲的東西'
  },
  {
    img: 'images/house_horror.jpg',
    instruction: '它在看著你。窗戶裡有什麼？',
    options: ['正常小屋', '廢棄的房子', '有東西在窗戶裡', '快關掉'],
    correct: '有東西在窗戶裡'
  }
];

const acuitySteps = [
  {
    img: 'images/chart_normal.jpg',
    instruction: '這是示意用方向視標圖（非標準視力檢查）。請看最上方最大的一個 E，判斷它的開口方向。',
    options: ['向右', '向左', '向上', '向下'], correct: '向右'
  },
  {
    img: 'images/chart_normal.jpg',
    instruction: '請再確認一次中間幾排。一切看起來正常嗎？',
    options: ['正常', '有點模糊', '符號在動', '我看不太清楚'], correct: '正常'
  },
  {
    img: 'images/chart_horror.jpg',
    instruction: '……下面的符號怎麼了？',
    options: ['還是 E', '變成臉了', '在看我', '關掉它'], correct: '變成臉了'
  },
  {
    img: 'images/chart_extreme.jpg',
    instruction: '它們都在看著你。',
    options: ['只是圖表', '很多眼睛', '我不想看了', '它們在笑'], correct: '很多眼睛'
  }
];

const recordsData = [
  { label: '受試者 A / 第一次拍攝', normal: 'images/person_normal_m.jpg', altered: 'images/person_fake_m.jpg' },
  { label: '物件 14 / 熱氣球影像', normal: 'images/balloon_normal.jpg', altered: 'images/balloon_horror.jpg' },
  { label: '受試者 C / 第二次拍攝', normal: 'images/person_normal_f.jpg', altered: 'images/person_fake_f.jpg' },
  { label: '物件 22 / 小屋影像', normal: 'images/house_normal.jpg', altered: 'images/house_horror.jpg' },
  { label: '視力表 / 封存底片', normal: 'images/chart_normal.jpg', altered: 'images/chart_horror.jpg' }
];

let currentPlate = 0;
let plateCorrect = 0;
let plateAnswers = [];
let hueOrder = [];
let selectedHueIndex = null;
let hueAttempts = 0;
let currentHueRound = 0;
let hueCorrectRounds = 0;
let visionStep = 0;
let acuityStep = 0;
let recordStep = 0;
let recordsCorrect = 0;
let recordNormalSide = 'left';
let selectedFaces = new Set();
let distortion = 0;
let hasReportedAnomaly = false;
let sawEyes = false;
let actionLocked = false;
let anomalyRevealed = false;
let hasSwitchedAway = false;
let hasReturnedAfterAnomaly = false;
let attentionTimer = null;
let ambientContext = null;
let ambientGain = null;

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateMonitor(stage, level = distortion) {
  const header = $('facility-header');
  header.hidden = false;
  $('stage-label').textContent = stage;
  const displayedLevel = anomalyRevealed ? Math.round(level) : 100;
  $('signal-label').textContent = anomalyRevealed
    ? `影像殘差 ${displayedLevel}%`
    : '顯示穩定 100%';
  $('signal-meter').style.setProperty('--signal', `${displayedLevel}%`);
  $('signal-meter').style.width = `${displayedLevel}%`;

  const state = $('facility-state');
  if (!anomalyRevealed) {
    state.textContent = '顯示穩定';
    state.classList.remove('alert');
    return;
  }
  if (level < 28) {
    state.textContent = '校對中';
    state.classList.remove('alert');
  } else if (level < 65) {
    state.textContent = '色彩偏移';
    state.classList.remove('alert');
  } else {
    state.textContent = '樣本不一致';
    state.classList.add('alert');
  }
}

function addDistortion(amount) {
  distortion = Math.min(96, distortion + amount);
  updateMonitor($('stage-label').textContent, distortion);
}

function flicker(duration = 850) {
  if (!$('motion-toggle').checked) return;
  document.body.classList.add('flicker');
  window.setTimeout(() => document.body.classList.remove('flicker'), duration);
}

function setFeedback(id, message, tone = 'amber') {
  const colors = { green: 'var(--green)', amber: 'var(--amber)', red: 'var(--red)' };
  $(id).textContent = message;
  $(id).style.color = colors[tone] || colors.amber;
}

function lockOptions(id, locked = true) {
  $(id).querySelectorAll('button').forEach((button) => { button.disabled = locked; });
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function startAmbient() {
  if (!$('sound-toggle').checked || !window.AudioContext) return;
  if (!ambientContext) {
    ambientContext = new AudioContext();
    const first = ambientContext.createOscillator();
    const second = ambientContext.createOscillator();
    ambientGain = ambientContext.createGain();
    first.type = 'sine';
    second.type = 'sine';
    first.frequency.value = 47;
    second.frequency.value = 49;
    ambientGain.gain.value = 0;
    first.connect(ambientGain);
    second.connect(ambientGain);
    ambientGain.connect(ambientContext.destination);
    first.start();
    second.start();
  }
  if (ambientContext.state === 'suspended') ambientContext.resume();
  ambientGain.gain.setTargetAtTime(.018, ambientContext.currentTime, .5);
}

function stopAmbient() {
  if (ambientContext && ambientGain) {
    ambientGain.gain.setTargetAtTime(0, ambientContext.currentTime, .2);
  }
}

function showAttentionNote(message) {
  const note = $('attention-note');
  note.textContent = message;
  note.hidden = false;
  window.clearTimeout(attentionTimer);
  attentionTimer = window.setTimeout(() => { note.hidden = true; }, 5200);
}

function createHueSequence(round) {
  return Array.from({ length: round.count }, (_, index) => {
    const hue = round.start + ((round.end - round.start) * index) / (round.count - 1);
    return `hsl(${hue.toFixed(1)} ${round.saturation}% ${round.lightness}%)`;
  });
}

function revealAnomaly() {
  anomalyRevealed = true;
  distortion = Math.max(distortion, 22);
  document.body.classList.add('unsettled');
  updateMonitor('封存紀錄校對', distortion);
  showInterlude();
}

document.addEventListener('visibilitychange', () => {
  if (!anomalyRevealed) return;
  if (document.hidden) {
    hasSwitchedAway = true;
    document.title = '你把它留在這裡了｜虹膜色彩校準';
    return;
  }
  if (hasSwitchedAway && !hasReturnedAfterAnomaly) {
    hasReturnedAfterAnomaly = true;
    document.title = '你回來得很快｜虹膜色彩校準';
    showAttentionNote('你回來了。你的答案沒有被清除。');
    window.setTimeout(() => {
      if (!document.hidden) document.title = DEFAULT_PAGE_TITLE;
    }, 6500);
  }
});

function sting() {
  if (!$('sound-toggle').checked || !window.AudioContext) return;
  const context = ambientContext || new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(155, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(42, context.currentTime + .45);
  gain.gain.setValueAtTime(.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(.12, context.currentTime + .02);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .55);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + .6);
}

function resetGame() {
  currentPlate = 0;
  plateCorrect = 0;
  plateAnswers = [];
  hueOrder = [];
  selectedHueIndex = null;
  hueAttempts = 0;
  currentHueRound = 0;
  hueCorrectRounds = 0;
  visionStep = 0;
  acuityStep = 0;
  recordStep = 0;
  recordsCorrect = 0;
  recordNormalSide = 'left';
  selectedFaces = new Set();
  distortion = 3;
  hasReportedAnomaly = false;
  sawEyes = false;
  actionLocked = false;
  anomalyRevealed = false;
  hasSwitchedAway = false;
  hasReturnedAfterAnomaly = false;
  window.clearTimeout(attentionTimer);
  $('attention-note').hidden = true;
  document.title = DEFAULT_PAGE_TITLE;
  document.body.classList.remove('unsettled');
  document.body.classList.remove('scare', 'flicker');
  screens.ending.classList.remove('false-pass', 'false-pass-revealed');
  $('jumpscare').style.display = 'none';
}

// Start and calibration
$('btn-start').addEventListener('click', () => {
  startAmbient();
  showScreen('intro');
});
$('sound-toggle').addEventListener('change', () => {
  if ($('sound-toggle').checked) startAmbient();
  else stopAmbient();
});
$('motion-toggle').addEventListener('change', () => {
  document.body.classList.toggle('quiet-motion', !$('motion-toggle').checked);
});
$('btn-to-plates').addEventListener('click', () => {
  resetGame();
  updateMonitor('階段一 / 色彩校準', 3);
  showScreen('plates');
  drawPlate();
});

function drawPlate() {
  const canvas = $('plate-canvas');
  const ctx = canvas.getContext('2d');
  const plate = plates[currentPlate];
  $('plate-progress').textContent = `色點校準 ${currentPlate + 1} / ${plates.length}　｜　${plate.label}`;
  const size = canvas.width;
  ctx.clearRect(0, 0, size, size);

  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = size;
  maskCanvas.height = size;
  const maskCtx = maskCanvas.getContext('2d');
  maskCtx.fillStyle = '#000';
  maskCtx.fillRect(0, 0, size, size);
  maskCtx.fillStyle = '#fff';
  maskCtx.font = 'bold 180px Arial';
  maskCtx.textAlign = 'center';
  maskCtx.textBaseline = 'middle';
  maskCtx.fillText(String(plate.number), size / 2, size / 2);
  const maskData = maskCtx.getImageData(0, 0, size, size).data;

  for (let i = 0; i < 1250; i += 1) {
    const x = size / 2 + (Math.random() - .5) * (size - 30);
    const y = size / 2 + (Math.random() - .5) * (size - 30);
    if (Math.hypot(x - size / 2, y - size / 2) > size / 2 - 16) continue;
    const radius = 2.5 + Math.random() * 5;
    const pixel = (Math.floor(y) * size + Math.floor(x)) * 4;
    const isFigure = maskData[pixel] > 128;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    const hue = isFigure ? plate.figureHue : plate.fieldHue;
    const hueOffset = (Math.random() - .5) * plate.hueJitter * 2;
    const saturation = 56 + (Math.random() - .5) * 12;
    const lightness = 58 + (Math.random() - .5) * 12;
    ctx.fillStyle = `hsl(${(hue + hueOffset + 360) % 360} ${saturation}% ${lightness}%)`;
    ctx.fill();
  }

  const options = $('plate-options');
  options.replaceChildren();
  plate.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => checkPlate(option));
    options.appendChild(button);
  });
  setFeedback('plate-feedback', '');
}

function checkPlate(choice) {
  if (actionLocked) return;
  actionLocked = true;
  plateAnswers[currentPlate] = choice;
  lockOptions('plate-options');
  if (choice === plates[currentPlate].number) {
    plateCorrect += 1;
    setFeedback('plate-feedback', '答案已記錄。請繼續下一張。', 'green');
  } else {
    addDistortion(7);
    setFeedback('plate-feedback', '答案已記錄。請繼續下一張。');
  }
  window.setTimeout(() => {
    currentPlate += 1;
    actionLocked = false;
    if (currentPlate < plates.length) {
      drawPlate();
      return;
    }
    if (plateCorrect < 3) {
      addDistortion(16);
    }
    distortion = Math.max(distortion, plateCorrect < 3 ? 28 : 16);
    if (plateCorrect < 3) setFeedback('plate-feedback', '色點辨讀已完成。結果已記錄。');
    updateMonitor('階段二 / 色相排序', distortion);
    showScreen('hue');
    initHue();
  }, 1050);
}

// Hue sorting starts as a calm four-part calibration; the story changes only after it.
function initHue() {
  const round = hueRounds[currentHueRound];
  const correctSequence = createHueSequence(round);
  // The first swatch is a fixed anchor, like a familiar hue-grid test.
  hueOrder = [correctSequence[0], ...shuffle(correctSequence.slice(1))];
  selectedHueIndex = null;
  hueAttempts = 0;
  $('hue-progress').textContent = `色相排列 ${currentHueRound + 1} / ${hueRounds.length}　｜　${round.name}`;
  $('hue-instruction').textContent = `點選兩個色塊即可交換，排成由左至右連續的色彩漸層。最左側色塊為參照。本組共 ${round.count} 格。`;
  renderHue();
  setFeedback('hue-feedback', '校準中。');
}

function renderHue() {
  const container = $('hue-container');
  container.replaceChildren();
  hueOrder.forEach((color, index) => {
    const block = document.createElement('button');
    block.type = 'button';
    block.className = 'hue-block';
    block.style.background = color;
    block.setAttribute('aria-label', `色塊 ${index + 1}`);
    block.setAttribute('aria-pressed', String(selectedHueIndex === index));
    if (selectedHueIndex === index) block.classList.add('selected');
    block.addEventListener('click', () => selectHue(index));
    container.appendChild(block);
  });
}

function selectHue(index) {
  if (selectedHueIndex === null) {
    selectedHueIndex = index;
    renderHue();
    return;
  }
  if (selectedHueIndex === index) {
    selectedHueIndex = null;
    renderHue();
    return;
  }
  [hueOrder[selectedHueIndex], hueOrder[index]] = [hueOrder[index], hueOrder[selectedHueIndex]];
  selectedHueIndex = null;
  renderHue();
}

function checkHue() {
  if (actionLocked) return;
  actionLocked = true;
  hueAttempts += 1;
  const correctSequence = createHueSequence(hueRounds[currentHueRound]);
  const correct = hueOrder.every((color, index) => color === correctSequence[index]);
  if (correct) {
    hueCorrectRounds += 1;
    setFeedback('hue-feedback', '排列完成。本組校準已記錄。', 'green');
    window.setTimeout(() => {
      actionLocked = false;
      currentHueRound += 1;
      if (currentHueRound < hueRounds.length) {
        initHue();
      } else {
        revealAnomaly();
      }
    }, 700);
  } else if (hueAttempts === 1) {
    actionLocked = false;
    addDistortion(10);
    setFeedback('hue-feedback', '色差未通過。請再檢視本組色階。', 'amber');
  } else {
    addDistortion(15);
    setFeedback('hue-feedback', '本組結果已記錄，將繼續下一組。');
    window.setTimeout(() => {
      actionLocked = false;
      currentHueRound += 1;
      if (currentHueRound < hueRounds.length) {
        initHue();
      } else {
        revealAnomaly();
      }
    }, 850);
  }
}

$('btn-check-hue').addEventListener('click', checkHue);

function showInterlude() {
  $('interlude-title').textContent = '值班室呼叫';
  const firstAnswer = plateAnswers[0] ?? '未作答';
  $('interlude-message').textContent = `我剛才也看著你的選擇。第一張色板，你按的是「${firstAnswer}」。封存副本卻記著 71。你不需要回去確認——只要想想，你剛才記得的是哪一個。`;
  $('interlude-signature').textContent = '— 夜班操作員 / 內線 03';
  $('interlude-question').textContent = '你要將這段訊息寫入檢測紀錄嗎？';
  $('btn-report').textContent = '回報：我記得剛才的答案';
  $('btn-ignore').textContent = '照封存紀錄繼續';
  showScreen('interlude');
}

function continueToVision() {
  distortion = Math.max(distortion, 43);
  updateMonitor('階段三 / 影像確認', distortion);
  visionStep = 0;
  showScreen('vision');
  showVisionStep();
}

$('btn-report').addEventListener('click', () => {
  hasReportedAnomaly = true;
  setFeedback('interlude-question', '異常已寫入。你的工號現在也出現在回報者欄位。', 'green');
  $('btn-report').disabled = true;
  $('btn-ignore').disabled = true;
  window.setTimeout(continueToVision, 900);
});
$('btn-ignore').addEventListener('click', () => {
  addDistortion(9);
  $('interlude-message').textContent = '「明智的選擇。繼續看著前方。」訊息的時間戳記，比現在早了 17 分鐘。';
  $('btn-report').disabled = true;
  $('btn-ignore').disabled = true;
  window.setTimeout(continueToVision, 1200);
});

// Familiar images return with subtle differences, then stop pretending to be tests.
function showVisionStep() {
  if (visionStep >= visionSteps.length) {
    distortion = Math.max(distortion, 63);
    updateMonitor('階段四 / 視力複核', distortion);
    acuityStep = 0;
    showScreen('acuity');
    showAcuityStep();
    return;
  }
  const step = visionSteps[visionStep];
  $('vision-img').src = step.img;
  $('vision-instruction').textContent = step.instruction;
  const options = $('vision-options');
  options.replaceChildren();
  step.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => checkVision(option, step));
    options.appendChild(button);
  });
  setFeedback('vision-feedback', '');
}

function checkVision(choice, step) {
  if (actionLocked) return;
  actionLocked = true;
  lockOptions('vision-options');
  const correct = choice === step.correct;
  if (correct) {
    const message = visionStep < 2 ? '判讀相符。請勿回頭查看上一張影像。' : '判讀已保存。它知道你看見了。';
    setFeedback('vision-feedback', message, visionStep < 2 ? 'green' : 'amber');
  } else {
    addDistortion(5);
    setFeedback('vision-feedback', '判讀不一致。影像已被覆寫，原始檔不存在。', 'red');
    flicker(700);
  }
  window.setTimeout(() => {
    visionStep += 1;
    actionLocked = false;
    showVisionStep();
  }, visionStep > 1 ? 1250 : 950);
}

function showAcuityStep() {
  if (acuityStep >= acuitySteps.length) {
    startRecords();
    return;
  }
  const step = acuitySteps[acuityStep];
  $('acuity-img').src = step.img;
  $('acuity-instruction').textContent = step.instruction;
  const options = $('acuity-options');
  options.replaceChildren();
  step.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => checkAcuity(option, step));
    options.appendChild(button);
  });
  setFeedback('acuity-feedback', '');
}

function checkAcuity(choice, step) {
  if (actionLocked) return;
  actionLocked = true;
  lockOptions('acuity-options');
  const correct = choice === step.correct;
  if (acuityStep === acuitySteps.length - 1) sawEyes = choice === '很多眼睛';
  if (correct) {
    setFeedback('acuity-feedback', acuityStep < 2 ? '判讀相符。' : '記錄成功。請不要看向螢幕外。', acuityStep < 2 ? 'green' : 'amber');
  } else {
    addDistortion(5);
    setFeedback('acuity-feedback', '再看一次。它們剛才眨眼了。', 'red');
    flicker(600);
  }
  window.setTimeout(() => {
    acuityStep += 1;
    actionLocked = false;
    showAcuityStep();
  }, acuityStep > 1 ? 1200 : 900);
}

// Retinal-memory archive: test the same color clues across ordinary people and things.
function startRecords() {
  recordStep = 0;
  recordsCorrect = 0;
  distortion = Math.max(distortion, 70);
  updateMonitor('階段五 / 視網膜殘像', distortion);
  showScreen('records');
  renderRecordStep();
}

function renderRecordStep() {
  if (recordStep >= recordsData.length) {
    setFeedback('records-feedback', `五份紀錄已封存。色彩輪廓吻合 ${recordsCorrect} / ${recordsData.length}。`, 'amber');
    actionLocked = true;
    window.setTimeout(() => {
      distortion = Math.max(distortion, 86);
      updateMonitor('最後階段 / 替換者辨識', distortion);
      triggerJumpScare(() => {
        showScreen('fakes');
        initFaces();
      });
    }, 1100);
    return;
  }

  const record = recordsData[recordStep];
  const normalOnLeft = Math.random() < .5;
  recordNormalSide = normalOnLeft ? 'left' : 'right';
  $('records-progress').textContent = `記憶封存 ${String(recordStep + 1).padStart(2, '0')} / ${recordsData.length}　｜　${record.label}`;
  const container = $('records-container');
  container.replaceChildren();
  const samples = normalOnLeft
    ? [{ image: record.normal, name: '樣本 A', side: 'left' }, { image: record.altered, name: '樣本 B', side: 'right' }]
    : [{ image: record.altered, name: '樣本 A', side: 'left' }, { image: record.normal, name: '樣本 B', side: 'right' }];

  samples.forEach((sample) => {
    const frame = document.createElement('figure');
    frame.className = `record-frame record-${sample.side}`;
    const image = document.createElement('img');
    image.src = sample.image;
    image.alt = `${record.label}，${sample.name}`;
    const caption = document.createElement('figcaption');
    caption.textContent = `${sample.name} / 封存色彩截圖`;
    frame.append(image, caption);
    container.appendChild(frame);
  });

  const options = $('record-options');
  options.replaceChildren();
  ['left', 'right'].forEach((side, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `樣本 ${index === 0 ? 'A' : 'B'} 保留了原始色彩`;
    button.addEventListener('click', () => checkRecord(side));
    options.appendChild(button);
  });
  actionLocked = false;
  setFeedback('records-feedback', '兩份備份標示為相同時間。你記得的是哪一份？');
  distortion = Math.max(distortion, 70 + recordStep * 3);
  updateMonitor('階段五 / 視網膜殘像', distortion);
}

function checkRecord(side) {
  if (actionLocked) return;
  actionLocked = true;
  lockOptions('record-options');
  if (side === recordNormalSide) {
    recordsCorrect += 1;
    setFeedback('records-feedback', '色彩輪廓吻合。這個人／物件，還記得自己原本的樣子。', 'green');
  } else {
    addDistortion(6);
    setFeedback('records-feedback', '記憶與備份不一致。檔案卻顯示你剛才選的才是原始版本。', 'red');
    flicker(500);
  }
  window.setTimeout(() => {
    recordStep += 1;
    renderRecordStep();
  }, 1050);
}

function triggerJumpScare(callback) {
  $('jumpscare').style.display = 'flex';
  sting();
  window.setTimeout(() => {
    $('jumpscare').style.display = 'none';
    callback();
  }, 2600);
}

// The final classification is deliberately a single, irreversible decision.
function initFaces() {
  const container = $('faces-container');
  container.replaceChildren();
  selectedFaces.clear();
  actionLocked = false;
  shuffle(facesData).forEach((face) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'face-card';
    card.setAttribute('aria-pressed', 'false');
    const image = document.createElement('img');
    image.src = face.img;
    image.alt = face.label;
    const label = document.createElement('span');
    label.className = 'face-label';
    label.textContent = face.label;
    card.append(image, label);
    card.addEventListener('click', () => toggleFace(face.id, card));
    container.appendChild(card);
  });
  setFeedback('fakes-feedback', '點選所有已被替換的影像。你只能提交一次。');
}

function toggleFace(id, card) {
  if (actionLocked) return;
  if (selectedFaces.has(id)) selectedFaces.delete(id);
  else selectedFaces.add(id);
  const selected = selectedFaces.has(id);
  card.classList.toggle('selected', selected);
  card.setAttribute('aria-pressed', String(selected));
}

$('btn-submit-fakes').addEventListener('click', () => {
  if (actionLocked) return;
  actionLocked = true;
  $('btn-submit-fakes').disabled = true;
  $('faces-container').querySelectorAll('button').forEach((button) => { button.disabled = true; });
  const correctFakes = facesData.filter((face) => face.isFake).map((face) => face.id);
  const isCorrect = correctFakes.every((id) => selectedFaces.has(id)) && selectedFaces.size === correctFakes.length;

  if (isCorrect && (plateCorrect < 3 || hueCorrectRounds < 2 || recordsCorrect < 3)) {
    setFeedback('fakes-feedback', '身份判讀相符，但前幾段校準紀錄互相矛盾。門鎖拒絕了你的工號。', 'red');
    window.setTimeout(() => endGame(false, '你辨識出了名單上的替換者。可惜，檢測中心認為真正異常的是你。', 'reclassified'), 1500);
  } else if (isCorrect && hasReportedAnomaly) {
    setFeedback('fakes-feedback', '身份判讀相符。但回報紀錄上的操作員，正是你剛剛選出的那張臉。', 'amber');
    window.setTimeout(() => endGame(true, '出口解鎖了。走廊盡頭的監視器仍顯示：你還坐在檢測室裡。', 'witness'), 1500);
  } else if (isCorrect) {
    setFeedback('fakes-feedback', '身份判讀相符。系統已替你簽署離場紀錄。', 'green');
    window.setTimeout(() => endGame(true, '檢測通過。走廊空無一人，只有控制室的電話正在響。', 'passed'), 1300);
  } else {
    setFeedback('fakes-feedback', '判讀已封存。受試者名單中，你的名字被移到了另一欄。', 'red');
    window.setTimeout(() => endGame(false, '那些被你放行的替換者已經離開。你指認的那幾個人，從來沒有離開過檢測室。', 'misidentified'), 1500);
  }
});

function endGame(success, message, ending) {
  showScreen('ending');
  screens.ending.classList.remove('false-pass', 'false-pass-revealed');
  $('facility-header').hidden = true;
  const title = $('ending-title');
  const text = $('ending-text');
  title.textContent = success ? (ending === 'witness' ? '回報已受理' : '檢測通過') : '檢測失敗';
  title.style.color = success ? 'var(--green)' : 'var(--red)';
  text.replaceChildren();
  const result = document.createElement('p');
  result.textContent = message;
  const lastLine = document.createElement('p');
  lastLine.className = 'creepy';
  if (ending === 'witness') {
    lastLine.textContent = sawEyes
      ? '電話接通了。電話那頭的你，正在問：「你有看到我嗎？」'
      : '回報紀錄多了一張簽名照。照片裡的操作員，和你一模一樣。';
  } else if (ending === 'passed') {
    lastLine.textContent = recordsCorrect === recordsData.length
      ? '五份紀錄都與你記得的一樣。那為什麼門外的走廊，少了一面牆？'
      : sawEyes
      ? '你選出的眼睛，全都出現在離場紀錄的簽名欄裡。'
      : '身後傳來一聲輕輕的敲門聲。你的離場紀錄顯示：尚未入場。';
  } else if (ending === 'reclassified') {
    lastLine.textContent = '監視器裡的你，比現在慢了半秒才眨眼。';
  } else if (ending === 'rejected') {
    lastLine.textContent = '黑暗中，有東西在笑。它記得你的答案。';
  } else {
    lastLine.textContent = '黑暗中，有東西在笑。它現在知道你的名字了。';
  }
  text.append(result, lastLine);
  if (ending === 'passed') {
    // Let the green result feel safe for a beat, then make the exit record contradict it.
    window.setTimeout(() => {
      if (!screens.ending.classList.contains('active')) return;
      screens.ending.classList.add('false-pass');
      title.textContent = '離場核對中';
      title.style.color = 'var(--amber)';
      result.textContent = '測驗結果：通過。出口影像：未確認。';
      lastLine.textContent = '等等——螢幕裡的受試者還坐在椅子上。她的眼睛正跟著你移動。';
      document.title = '你還沒有離場｜虹膜色彩校準';
      sting();
      flicker(900);
      triggerJumpScare(() => {
        if (!screens.ending.classList.contains('active')) return;
        screens.ending.classList.add('false-pass-revealed');
        title.textContent = '離場紀錄已封存';
        title.style.color = 'var(--red)';
        result.textContent = '檢測通過。離場確認失敗。';
        lastLine.textContent = '走廊裡的人剛才回答了你的名字。監視器裡，椅子上的你也在回答。';
        document.title = '有兩個你｜虹膜色彩校準';
      });
    }, 1400);
  }
  if (!success) {
    document.body.classList.add('scare');
    window.setTimeout(() => document.body.classList.remove('scare'), 1800);
  }
}

$('btn-restart').addEventListener('click', () => {
  resetGame();
  $('facility-header').hidden = true;
  $('btn-report').disabled = false;
  $('btn-ignore').disabled = false;
  $('btn-submit-fakes').disabled = false;
  stopAmbient();
  showScreen('title');
});

showScreen('title');
