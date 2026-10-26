// Game state
let currentPlate = 0;
let plateCorrect = 0;
const plates = [
  { number: 74, options: [74, 21, 47, "看不到"] },
  { number: 8, options: [8, 3, 6, "看不到"] },
  { number: 42, options: [42, 24, 12, "看不到"] }
];

let hueOrder = [];
let selectedHueIndex = null;
const correctHueSequence = [
  '#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00',
  '#ffff00', '#ccff00', '#99ff00', '#66ff00', '#33ff00'
];

let selectedFaces = new Set();
const facesData = [
  { id: 0, isFake: false, img: 'images/person_normal_m.jpg', label: '受試者 A' },
  { id: 1, isFake: true,  img: 'images/person_fake_m.jpg',   label: '受試者 B' },
  { id: 2, isFake: false, img: 'images/person_normal_f.jpg', label: '受試者 C' },
  { id: 3, isFake: true,  img: 'images/person_fake_f.jpg',   label: '受試者 D' },
  { id: 4, isFake: false, img: 'images/balloon_normal_rect.jpg', label: '先前影像（正常）' },
  { id: 5, isFake: true,  img: 'images/balloon_horror_rect.jpg', label: '先前影像（異常）' }
];

// Screens
const screens = {
  title: document.getElementById('screen-title'),
  intro: document.getElementById('screen-intro'),
  plates: document.getElementById('screen-plates'),
  hue: document.getElementById('screen-hue'),
  vision: document.getElementById('screen-vision'),
  acuity: document.getElementById('screen-acuity'),
  fakes: document.getElementById('screen-fakes'),
  ending: document.getElementById('screen-ending')
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// Start
document.getElementById('btn-start').onclick = () => showScreen('intro');
document.getElementById('btn-to-plates').onclick = () => {
  currentPlate = 0;
  plateCorrect = 0;
  showScreen('plates');
  drawPlate();
};

// === Plate Generation (proper Ishihara-like with readable numbers) ===
function drawPlate() {
  const canvas = document.getElementById('plate-canvas');
  const ctx = canvas.getContext('2d');
  const plate = plates[currentPlate];
  ctx.clearRect(0, 0, 400, 400);

  // Create an offscreen canvas to use as a text mask
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = 400;
  maskCanvas.height = 400;
  const maskCtx = maskCanvas.getContext('2d');
  maskCtx.fillStyle = '#000';
  maskCtx.fillRect(0, 0, 400, 400);
  maskCtx.fillStyle = '#fff';
  maskCtx.font = 'bold 180px Arial';
  maskCtx.textAlign = 'center';
  maskCtx.textBaseline = 'middle';
  maskCtx.fillText(String(plate.number), 200, 200);

  const maskData = maskCtx.getImageData(0, 0, 400, 400).data;

  // Draw random dots, color based on whether the point is inside the number
  for (let i = 0; i < 1200; i++) {
    const x = 200 + (Math.random() - 0.5) * 370;
    const y = 200 + (Math.random() - 0.5) * 370;
    if (Math.hypot(x - 200, y - 200) > 185) continue;

    const r = 2.5 + Math.random() * 5.5;
    const px = Math.floor(x);
    const py = Math.floor(y);
    const idx = (py * 400 + px) * 4;
    const isFigure = maskData[idx] > 128; // white = inside the number

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (isFigure) {
      // Reddish tones for the figure
      ctx.fillStyle = Math.random() > 0.4 ? '#e74c3c' : '#c0392b';
    } else {
      // Greenish tones for the background
      ctx.fillStyle = Math.random() > 0.4 ? '#2ecc71' : '#27ae60';
    }
    ctx.fill();
  }

  // Options
  const optionsDiv = document.getElementById('plate-options');
  optionsDiv.innerHTML = '';
  plate.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => checkPlate(opt, plate.number);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('plate-feedback').textContent = '';
}

function checkPlate(choice, correct) {
  const fb = document.getElementById('plate-feedback');
  if (choice == correct) {
    fb.textContent = '正確。你還是人類。';
    fb.style.color = '#00ff00';
    plateCorrect++;
  } else {
    fb.textContent = '……錯誤。他們正在看著你。';
    fb.style.color = '#ff3333';
    document.body.classList.add('flicker');
    setTimeout(() => document.body.classList.remove('flicker'), 1500);
  }
  setTimeout(() => {
    currentPlate++;
    if (currentPlate < plates.length) {
      drawPlate();
    } else {
      if (plateCorrect >= 2) {
        showScreen('hue');
        initHue();
      } else {
        endGame(false, '你的色彩感知不合格。偽人已經確認你的位置。');
      }
    }
  }, 1200);
}

// === Hue Test ===
function initHue() {
  hueOrder = [...correctHueSequence].sort(() => Math.random() - 0.5);
  renderHue();
  document.getElementById('hue-feedback').textContent = '';
}

function renderHue() {
  const cont = document.getElementById('hue-container');
  cont.innerHTML = '';
  hueOrder.forEach((color, i) => {
    const div = document.createElement('div');
    div.className = 'hue-block';
    div.style.background = color;
    div.onclick = () => selectHue(i);
    cont.appendChild(div);
  });
}

function selectHue(index) {
  if (selectedHueIndex === null) {
    selectedHueIndex = index;
    document.querySelectorAll('.hue-block')[index].classList.add('selected');
  } else {
    // Swap
    [hueOrder[selectedHueIndex], hueOrder[index]] = [hueOrder[index], hueOrder[selectedHueIndex]];
    selectedHueIndex = null;
    renderHue();
  }
}

document.getElementById('btn-check-hue').onclick = () => {
  const correct = hueOrder.every((c, i) => c === correctHueSequence[i]);
  const fb = document.getElementById('hue-feedback');
  if (correct) {
    fb.textContent = '色相排序完美。你的視覺正常。';
    fb.style.color = '#00ff00';
    setTimeout(() => {
      showScreen('vision');
      startVisionTest();
    }, 1000);
  } else {
    fb.textContent = '排序錯誤。偽人的色彩缺陷正在影響你……';
    fb.style.color = '#ff3333';
    document.body.classList.add('flicker');
    setTimeout(() => {
      document.body.classList.remove('flicker');
      endGame(false, '你沒能通過色相測試。檢測中心已將你標記為潛在偽人。');
    }, 1500);
  }
};

// === Vision / Astigmatism Test ===
let visionStep = 0;
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
    instruction: '它在看著你。',
    options: ['正常小屋', '廢棄的房子', '有東西在窗戶裡', '快關掉'],
    correct: '有東西在窗戶裡'
  }
];

function startVisionTest() {
  visionStep = 0;
  showVisionStep();
}

function showVisionStep() {
  if (visionStep >= visionSteps.length) {
    // After balloon/house, go to acuity chart
    showScreen('acuity');
    startAcuityTest();
    return;
  }
  const step = visionSteps[visionStep];
  document.getElementById('vision-img').src = step.img;
  document.getElementById('vision-instruction').textContent = step.instruction;
  const optionsDiv = document.getElementById('vision-options');
  optionsDiv.innerHTML = '';
  step.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => checkVision(opt, step.correct);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('vision-feedback').textContent = '';
}

function checkVision(choice, correct) {
  const fb = document.getElementById('vision-feedback');
  if (choice === correct) {
    fb.textContent = visionStep < 2 ? '正確。' : '……你還看得到嗎？';
    fb.style.color = visionStep < 2 ? '#00ff00' : '#ffaa00';
  } else {
    fb.textContent = '不對……';
    fb.style.color = '#ff3333';
    document.body.classList.add('flicker');
    setTimeout(() => document.body.classList.remove('flicker'), 800);
  }
  setTimeout(() => {
    visionStep++;
    showVisionStep();
  }, 1000);
}

function triggerJumpScare(callback) {
  const scare = document.getElementById('jumpscare');
  scare.style.display = 'flex';
  setTimeout(() => {
    scare.style.display = 'none';
    if (callback) callback();
  }, 1800);
}

// === Acuity Chart Test ===
let acuityStep = 0;
const acuitySteps = [
  {
    img: 'images/chart_normal.jpg',
    instruction: '這是標準視力表。請選擇最下面一排符號的開口方向。',
    options: ['向右', '向左', '向上', '向下'],
    correct: '向右'
  },
  {
    img: 'images/chart_normal.jpg',
    instruction: '請再確認一次中間幾排。一切看起來正常嗎？',
    options: ['正常', '有點模糊', '符號在動', '我看不太清楚'],
    correct: '正常'
  },
  {
    img: 'images/chart_horror.jpg',
    instruction: '……下面的符號怎麼了？',
    options: ['還是E', '變成臉了', '在看我', '關掉它'],
    correct: '變成臉了'
  },
  {
    img: 'images/chart_extreme.jpg',
    instruction: '它們都在看著你。',
    options: ['只是圖表', '很多眼睛', '我不想看了', '它們在笑'],
    correct: '很多眼睛'
  }
];

function startAcuityTest() {
  acuityStep = 0;
  showAcuityStep();
}

function showAcuityStep() {
  if (acuityStep >= acuitySteps.length) {
    triggerJumpScare(() => {
      showScreen('fakes');
      initFaces();
    });
    return;
  }
  const step = acuitySteps[acuityStep];
  document.getElementById('acuity-img').src = step.img;
  document.getElementById('acuity-instruction').textContent = step.instruction;
  const optionsDiv = document.getElementById('acuity-options');
  optionsDiv.innerHTML = '';
  step.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.onclick = () => checkAcuity(opt, step.correct);
    optionsDiv.appendChild(btn);
  });
  document.getElementById('acuity-feedback').textContent = '';
}

function checkAcuity(choice, correct) {
  const fb = document.getElementById('acuity-feedback');
  if (choice === correct) {
    fb.textContent = acuityStep < 2 ? '正確。' : '……';
    fb.style.color = acuityStep < 2 ? '#00ff00' : '#ffaa00';
  } else {
    fb.textContent = '再看一次。';
    fb.style.color = '#ff3333';
    document.body.classList.add('flicker');
    setTimeout(() => document.body.classList.remove('flicker'), 600);
  }
  setTimeout(() => {
    acuityStep++;
    showAcuityStep();
  }, 900);
}

// === Fake Identification ===
function initFaces() {
  const cont = document.getElementById('faces-container');
  cont.innerHTML = '';
  selectedFaces.clear();
  facesData.forEach(face => {
    const card = document.createElement('div');
    card.className = 'face-card';
    card.innerHTML = `
      <img src="${face.img}" alt="${face.label}" style="width:120px;height:160px;object-fit:cover;border-radius:4px;">
      <p style="font-size:0.75em;margin-top:6px;">${face.label}</p>
    `;
    card.onclick = () => toggleFace(face.id, card);
    cont.appendChild(card);
  });
  document.getElementById('fakes-feedback').textContent = '根據你剛才的視力檢測結果，點選所有異常／偽人的對象（可多選）';
}

function toggleFace(id, card) {
  if (selectedFaces.has(id)) {
    selectedFaces.delete(id);
    card.classList.remove('selected');
  } else {
    selectedFaces.add(id);
    card.classList.add('selected');
  }
}

document.getElementById('btn-submit-fakes').onclick = () => {
  const correctFakes = facesData.filter(f => f.isFake).map(f => f.id);
  const isCorrect = correctFakes.every(id => selectedFaces.has(id)) && 
                    selectedFaces.size === correctFakes.length;
  const fb = document.getElementById('fakes-feedback');
  if (isCorrect) {
    fb.textContent = '正確辨識。你還是人類。';
    fb.style.color = '#00ff00';
    setTimeout(() => endGame(true, '檢測完成。你成功辨識出所有偽人，並通過了色彩測試。檢測中心的門為你打開了。'), 1000);
  } else {
    fb.textContent = '判斷錯誤。';
    fb.style.color = '#ff3333';
    setTimeout(() => endGame(false, '你選錯了。那些被你放行的偽人已經混入人群。而那些被你誤判的人類……'), 1200);
  }
};

// === Endings ===
function endGame(success, message) {
  showScreen('ending');
  const title = document.getElementById('ending-title');
  const text = document.getElementById('ending-text');
  if (success) {
    title.textContent = '檢測通過';
    title.style.color = '#00ff00';
    text.innerHTML = `<p>${message}</p><p class="creepy">但請記住……下次再來的時候，你可能已經不是人類了。</p>`;
  } else {
    title.textContent = '檢測失敗';
    title.style.color = '#ff3333';
    text.innerHTML = `<p>${message}</p><p class="creepy">黑暗中，有東西在笑。</p>`;
    document.body.classList.add('scare');
    setTimeout(() => document.body.classList.remove('scare'), 2000);
  }
}

document.getElementById('btn-restart').onclick = () => {
  document.body.classList.remove('scare', 'flicker');
  showScreen('title');
};

// Initial
showScreen('title');
