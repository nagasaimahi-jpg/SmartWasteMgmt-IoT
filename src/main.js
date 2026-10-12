import './styles.css';

const wasteTypes = [
  { label: 'Plastic bottle', type: 'Plastic', points: 20 },
  { label: 'Paper box', type: 'Paper', points: 15 },
  { label: 'Aluminum can', type: 'Metal', points: 25 },
  { label: 'Fruit peel', type: 'Organic', points: 10 },
  { label: 'Broken charger', type: 'E-waste', points: 30 },
  { label: 'Glass jar', type: 'Glass', points: 18 }
];

const recentActivity = [
  { icon: '🧴', text: 'Plastic bottle sorted', pts: '+20 pts', time: '2 mins ago' },
  { icon: '📦', text: 'Paper box recycled', pts: '+15 pts', time: '1 hour ago' },
  { icon: '🥭', text: 'Organic waste disposed', pts: '+10 pts', time: 'Yesterday' }
];

const binData = [
  { id: 'Bin A1', fill: 42, status: 'Healthy', tone: 'green' },
  { id: 'Bin B2', fill: 61, status: 'Medium', tone: 'yellow' },
  { id: 'Bin C3', fill: 82, status: 'Alert', tone: 'red' }
];

const state = {
  points: 640,
  activeScreen: 'home-screen',
  currentWaste: wasteTypes[0]
};

const pointsTotal = document.getElementById('points-total');
const rewardPoints = document.getElementById('reward-points');
const binList = document.getElementById('bin-list');
const activityList = document.getElementById('activity-list');
const detectedType = document.getElementById('detected-type');
const identifyWasteBtn = document.getElementById('identify-waste-btn');
const confirmDisposalBtn = document.getElementById('confirm-disposal-btn');
const manualSelectBtn = document.getElementById('manual-select-btn');

function renderBins() {
  binList.innerHTML = '';
  binData.forEach((bin) => {
    const item = document.createElement('div');
    item.className = 'bin-item';
    item.innerHTML = `
      <div>
        <strong>${bin.id}</strong>
        <small>${bin.status}</small>
      </div>
      <div class="bin-level ${bin.tone}">
        <div class="fill-indicator" style="width: ${bin.fill}%"></div>
      </div>
      <span>${bin.fill}%</span>
    `;
    binList.appendChild(item);
  });
}

function renderActivity() {
  activityList.innerHTML = '';
  recentActivity.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'activity-item';
    row.innerHTML = `
      <span class="activity-icon">${item.icon}</span>
      <div>
        <strong>${item.text}</strong>
        <small>${item.time}</small>
      </div>
      <span class="activity-points">${item.pts}</span>
    `;
    activityList.appendChild(row);
  });
}

function renderPoints() {
  pointsTotal.textContent = state.points;
  rewardPoints.textContent = state.points;
}

function setScreen(screenId) {
  document.querySelectorAll('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });

  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.screen === screenId);
  });
}

document.querySelectorAll('[data-screen]').forEach((button) => {
  button.addEventListener('click', () => {
    const screenId = button.dataset.screen;
    if (screenId) setScreen(screenId);
  });
});

document.querySelectorAll('[data-back]').forEach((button) => {
  button.addEventListener('click', () => {
    setScreen(button.dataset.back);
  });
});

function randomWaste() {
  const randomItem = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
  state.currentWaste = randomItem;
  detectedType.textContent = randomItem.label;
  const box = document.getElementById('classification-box');
  box.innerHTML = `
    <p class="eyebrow">Detected item</p>
    <h3>${randomItem.label}</h3>
    <div class="meta-row">
      <span>Type: <strong>${randomItem.type}</strong></span>
      <span>Reward: +${randomItem.points} pts</span>
    </div>
  `;
}

identifyWasteBtn.addEventListener('click', randomWaste);
manualSelectBtn.addEventListener('click', () => {
  const selected = prompt(
    'Enter waste type (Plastic, Paper, Metal, Organic, E-waste, Glass):',
    'Plastic'
  );

  if (!selected) return;

  const normalized = selected.trim();
  const match = wasteTypes.find(
    (item) => item.type.toLowerCase() === normalized.toLowerCase()
  );

  if (!match) {
    alert('Type not found. Please enter one of: Plastic, Paper, Metal, Organic, E-waste, Glass.');
    return;
  }

  state.currentWaste = match;
  detectedType.textContent = match.label;
  document.getElementById('classification-box').innerHTML = `
    <p class="eyebrow">Detected item</p>
    <h3>${match.label}</h3>
    <div class="meta-row">
      <span>Type: <strong>${match.type}</strong></span>
      <span>Reward: +${match.points} pts</span>
    </div>
  `;
});

confirmDisposalBtn.addEventListener('click', () => {
  const reward = state.currentWaste.points;
  state.points += reward;
  renderPoints();

  const newEntry = {
    icon: '✅',
    text: `${state.currentWaste.label} successfully disposed`,
    pts: `+${reward} pts`,
    time: 'Just now'
  };

  recentActivity.unshift(newEntry);
  renderActivity();
  setScreen('home-screen');

  alert(`Disposal successful! You earned ${reward} points.`);
});

renderBins();
renderActivity();
renderPoints();
setScreen('home-screen');
