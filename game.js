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
  { number: 74, options: [74, 21, 47, '看不到'], label: '明顯色差', figureHue: 20, fieldHue: 150, hueJitter: 5, warp: 0 },
  { number: 8, options: [8, 3, 6, '看不到'], label: '基礎紅綠辨讀', figureHue: 17, fieldHue: 125, hueJitter: 6, warp: 0 },
  { number: 42, options: [42, 24, 12, '看不到'], label: '中等色差', figureHue: 18, fieldHue: 96, hueJitter: 7, warp: 0 },
  { number: 35, options: [35, 53, 3, '看不到'], label: '近似色辨讀', figureHue: 21, fieldHue: 70, hueJitter: 7, warp: 0 },
  { number: 16, options: [16, 18, 76, '看不到'], label: '高度近似色', figureHue: 25, fieldHue: 49, hueJitter: 6, warp: 1.2 },
  { number: 6, options: [6, 9, 5, '看不到'], label: '極近色辨讀', figureHue: 29, fieldHue: 40, hueJitter: 4, warp: 2, faceEcho: true }
];

const hueRounds = [
  { name: '青玻璃', count: 6, start: 163, end: 194, saturation: 61, lightness: 60 },
  { name: '晴空藍', count: 7, start: 198, end: 230, saturation: 64, lightness: 62 },
  { name: '莓果紫', count: 8, start: 309, end: 342, saturation: 58, lightness: 62 },
  { name: '柑橘珊瑚', count: 10, start: 18, end: 51, saturation: 68, lightness: 62 }
];

const finalComparisons = [
  { id: 'person-a', label: '受試者 A / 臉部封存', clue: '比對眼距、嘴角與臉部輪廓。', normal: 'images/person_normal_m.jpg', altered: 'images/person_fake_m.jpg' },
  { id: 'person-c', label: '受試者 C / 第二次拍攝', clue: '比對表情與輪廓是否和最初影像連續。', normal: 'images/person_normal_f.jpg', altered: 'images/person_fake_f.jpg' },
  { id: 'balloon', label: '影像紀錄 14 / 熱氣球', clue: '回想色彩訊號、吊籃與繫索的位置。', normal: 'images/balloon_normal.jpg', altered: 'images/balloon_horror.jpg' },
  { id: 'house', label: '影像紀錄 22 / 小屋', clue: '回想窗格、屋頂線條與原本的光線。', normal: 'images/house_normal.jpg', altered: 'images/house_horror.jpg' }
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
let hueReference = null;
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
let finalSelections = Object.create(null);
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
  showAttentionNote($('sound-toggle').checked
    ? '提示：異常段落可能伴隨短促音效；可重新開始後關閉「環境音」。'
    : '提示：目前已關閉「環境音」，短促異常音效也會一併停用。');
  sting();
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
  hueReference = null;
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
  finalSelections = Object.create(null);
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
  // Leave the mask transparent so the last plate's face echo can be clipped
  // to the numeral rather than forming a separate full-field image.
  maskCtx.fillStyle = '#fff';
  maskCtx.font = 'bold 180px Arial';
  maskCtx.textAlign = 'center';
  maskCtx.textBaseline = 'middle';
  maskCtx.fillText(String(plate.number), size / 2, size / 2);
  const maskData = maskCtx.getImageData(0, 0, size, size).data;

  let faceEchoData = null;
  if (plate.faceEcho) {
    const echoCanvas = document.createElement('canvas');
    echoCanvas.width = size;
    echoCanvas.height = size;
    const echoCtx = echoCanvas.getContext('2d');
    echoCtx.strokeStyle = '#fff';
    echoCtx.fillStyle = '#fff';
    echoCtx.lineWidth = 10;
    echoCtx.lineCap = 'round';
    echoCtx.beginPath();
    echoCtx.ellipse(size / 2, size / 2 + 2, 58, 68, 0, 0, Math.PI * 2);
    echoCtx.stroke();
    echoCtx.beginPath();
    echoCtx.ellipse(size / 2 - 22, size / 2 - 12, 5, 8, 0, 0, Math.PI * 2);
    echoCtx.ellipse(size / 2 + 22, size / 2 - 12, 5, 8, 0, 0, Math.PI * 2);
    echoCtx.fill();
    echoCtx.beginPath();
    echoCtx.moveTo(size / 2, size / 2 - 3);
    echoCtx.lineTo(size / 2 - 5, size / 2 + 16);
    echoCtx.moveTo(size / 2 - 18, size / 2 + 34);
    echoCtx.quadraticCurveTo(size / 2, size / 2 + 43, size / 2 + 18, size / 2 + 32);
    echoCtx.stroke();
    echoCtx.globalCompositeOperation = 'destination-in';
    echoCtx.drawImage(maskCanvas, 0, 0);
    faceEchoData = echoCtx.getImageData(0, 0, size, size).data;
  }

  for (let i = 0; i < 1250; i += 1) {
    const x = size / 2 + (Math.random() - .5) * (size - 30);
    const y = size / 2 + (Math.random() - .5) * (size - 30);
    if (Math.hypot(x - size / 2, y - size / 2) > size / 2 - 16) continue;
    const radius = 2.5 + Math.random() * 5;
    const pixel = (Math.floor(y) * size + Math.floor(x)) * 4;
    const shiftedY = Math.max(0, Math.min(size - 1, Math.floor(y + Math.sin((x + y) / 22) * (plate.warp || 0))));
    const maskPixel = (shiftedY * size + Math.floor(x)) * 4;
    const isFigure = maskData[maskPixel] > 128 || Boolean(faceEchoData && faceEchoData[pixel] > 128);
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
  // Keep the anchor outside the sortable array so it cannot be exchanged.
  hueReference = correctSequence[0];
  hueOrder = shuffle(correctSequence.slice(1));
  selectedHueIndex = null;
  hueAttempts = 0;
  $('hue-progress').textContent = `色相排列 ${currentHueRound + 1} / ${hueRounds.length}　｜　${round.name}`;
  $('hue-instruction').textContent = `第一格是固定參照色（不可移動）。只交換後方色塊，從參照色開始，由左至右排出連續色階。本組共 ${round.count} 格。`;
  renderHue();
  setFeedback('hue-feedback', '校準中。');
}

function renderHue() {
  const container = $('hue-container');
  container.replaceChildren();
  const reference = document.createElement('div');
  reference.className = 'hue-block hue-reference';
  reference.style.background = hueReference;
  reference.setAttribute('role', 'img');
  reference.setAttribute('aria-label', '固定參照色，不可移動');
  reference.setAttribute('title', '固定參照色，不可移動');
  container.appendChild(reference);
  hueOrder.forEach((color, index) => {
    const block = document.createElement('button');
    block.type = 'button';
    block.className = 'hue-block';
    block.style.background = color;
    block.setAttribute('aria-label', `可排序色塊 ${index + 1}`);
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
  const submittedSequence = [hueReference, ...hueOrder];
  const correct = submittedSequence.length === correctSequence.length
    && submittedSequence.every((color, index) => color === correctSequence[index]);
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
  setFeedback('records-feedback', '這些是剛才視力檢測時封存的影像，請確認哪一張還保留原始色彩訊號。');
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

// The final classification compares the earlier face/object records side by side.
function initFaces() {
  const container = $('faces-container');
  container.replaceChildren();
  finalSelections = Object.create(null);
  actionLocked = false;
  shuffle(finalComparisons).forEach((comparison) => {
    const pair = document.createElement('section');
    pair.className = 'final-pair';
    pair.setAttribute('aria-label', comparison.label);
    const title = document.createElement('h3');
    title.className = 'final-pair-title';
    title.textContent = comparison.label;
    const clue = document.createElement('p');
    clue.className = 'final-pair-clue';
    clue.textContent = comparison.clue;
    const choices = document.createElement('div');
    choices.className = 'final-pair-choices';
    const versions = shuffle([
      { image: comparison.normal, kind: 'original' },
      { image: comparison.altered, kind: 'altered' }
    ]);
    versions.forEach((version, index) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'final-sample';
      card.setAttribute('aria-pressed', 'false');
      card.setAttribute('aria-label', `${comparison.label}，版本 ${index === 0 ? 'A' : 'B'}`);
      const image = document.createElement('img');
      image.src = version.image;
      image.alt = `${comparison.label}，比對版本 ${index === 0 ? 'A' : 'B'}`;
      const caption = document.createElement('span');
      caption.className = 'face-label';
      caption.textContent = `比對版本 ${index === 0 ? 'A' : 'B'}`;
      card.append(image, caption);
      card.addEventListener('click', () => selectFinalVersion(comparison.id, version.kind, choices, card));
      choices.appendChild(card);
    });
    pair.append(title, clue, choices);
    container.appendChild(pair);
  });
  updateFinalProgress();
  setFeedback('fakes-feedback', '每組選出仍保有最初記憶的一份。完成四組後提交，不能回頭修改。');
}

function updateFinalProgress() {
  const completed = Object.keys(finalSelections).length;
  $('final-progress').textContent = `原始影像核對 ${completed} / ${finalComparisons.length} 組`;
}

function selectFinalVersion(id, kind, choices, selectedCard) {
  if (actionLocked) return;
  finalSelections[id] = kind;
  choices.querySelectorAll('button').forEach((card) => {
    const isChosen = card === selectedCard;
    card.classList.toggle('selected', isChosen);
    card.setAttribute('aria-pressed', String(isChosen));
  });
  updateFinalProgress();
}

$('btn-submit-fakes').addEventListener('click', () => {
  if (actionLocked) return;
  if (Object.keys(finalSelections).length !== finalComparisons.length) {
    setFeedback('fakes-feedback', '尚有影像組未核對。每組都要留下你的判斷。', 'amber');
    return;
  }
  actionLocked = true;
  $('btn-submit-fakes').disabled = true;
  $('faces-container').querySelectorAll('button').forEach((button) => { button.disabled = true; });
  const isCorrect = finalComparisons.every((comparison) => finalSelections[comparison.id] === 'original');

  if (isCorrect && (plateCorrect < 3 || hueCorrectRounds < 2 || recordsCorrect < 3)) {
    setFeedback('fakes-feedback', '原始版本判讀相符，但前幾段校準紀錄互相矛盾。門鎖拒絕了你的工號。', 'red');
    window.setTimeout(() => endGame(false, '你找回了每組影像的原始版本。可惜，檢測中心認為真正異常的是你。', 'reclassified'), 1500);
  } else if (isCorrect && hasReportedAnomaly) {
    setFeedback('fakes-feedback', '原始版本判讀相符。但回報紀錄上的操作員，正是其中一張臉。', 'amber');
    window.setTimeout(() => endGame(true, '出口解鎖了。走廊盡頭的監視器仍顯示：你還坐在檢測室裡。', 'witness'), 1500);
  } else if (isCorrect) {
    setFeedback('fakes-feedback', '四組影像皆與最初留存一致。系統已替你簽署離場紀錄。', 'green');
    window.setTimeout(() => endGame(true, '檢測通過。走廊空無一人，只有控制室的電話正在響。', 'passed'), 1300);
  } else {
    setFeedback('fakes-feedback', '判讀已封存。至少一個原始版本被你留在了錯誤的一側。', 'red');
    window.setTimeout(() => endGame(false, '有些影像版本被放行了。受試者名單中，你的名字也被移到了另一欄。', 'misidentified'), 1500);
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
