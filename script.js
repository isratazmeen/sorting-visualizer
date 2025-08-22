// DOM Elements
const visualizer = document.getElementById('visualizer');
const generateBtn = document.getElementById('generateArray');
const startBtn = document.getElementById('startSort');
const algorithmSelect = document.getElementById('algorithmSelect');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const resetBtn = document.getElementById('resetSort');
const statusMessage = document.getElementById('statusMessage');
const stopBtn = document.getElementById('stopSort');
const sortBadge = document.getElementById('sortBadge');

// 🌙 Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

let isSorting = false;
let selectedAlgorithm = 'bubble'; // default
let array = [];
let stepCount = 0;
const stepCounter = document.getElementById('stepCounter');

// 🛠️ Utility Functions
function getSpeed() {
  const turbo = document.getElementById('turbo').checked;
  return turbo ? 1 : parseInt(speedSlider.value);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clearColors() {
  document.querySelectorAll('.bar').forEach(bar => {
    bar.classList.remove('active', 'sorted');
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function disableControls() {
  startBtn.disabled = true;
  generateBtn.disabled = true;
  resetBtn.disabled = true;
  stopBtn.disabled = false;
}

function enableControls() {
  startBtn.disabled = false;
  generateBtn.disabled = false;
  resetBtn.disabled = false;
  stopBtn.disabled = true;
}

// 🔢 Array Logic
function generateArray(size = 30) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
  renderBars();
}

function resetBars() {
  array = Array.from({ length: 50 }, () => Math.floor(Math.random() * 100));
  renderBars();
}

function renderBars() {
  visualizer.innerHTML = '';
  array.forEach((value, i) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.setAttribute('data-value', value);

    setTimeout(() => {
      bar.style.height = `${value * 3}px`;
    }, i * 20);

    const label = document.createElement('span');
    label.textContent = value;
    label.style.position = 'absolute';
    label.style.bottom = `${value * 3 + 5}px`;
    label.style.fontSize = '0.7rem';
    label.style.color = '#555';
    bar.appendChild(label);

    visualizer.appendChild(bar);
  });
}

// 🎚️ Speed Controls
speedSlider.addEventListener('input', () => {
  speedValue.textContent = `${speedSlider.value}ms`;
});
document.getElementById('turbo').addEventListener('change', () => {
  speedSlider.disabled = document.getElementById('turbo').checked;
});

// 🧠 Sorting Algorithms
async function selectionSort() {
  clearColors();
  stepCount = 0;  
  stepCounter.textContent = `Steps: ${stepCount}`;
  isSorting = true;
  disableControls();
  sortBadge.textContent = `${capitalize(selectedAlgorithm)} Sort`;
  const bars = document.querySelectorAll('.bar');
  statusMessage.classList.add('sorting');

  for (let i = 0; i < array.length && isSorting; i++) {
    let minIndex = i;
    bars[minIndex].classList.add('active');

    for (let j = i + 1; j < array.length && isSorting; j++) {
      bars[j].classList.add('active');
      await sleep(getSpeed());

      if (!isSorting) break;
      stepCount++;
stepCounter.textContent = `Steps: ${stepCount}`;
      if (array[j] < array[minIndex]) {
        bars[minIndex].classList.remove('active');
        minIndex = j;
        bars[minIndex].classList.add('active');
      } else {
        bars[j].classList.remove('active');
      }
    }

    if (!isSorting) break;

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      bars[i].style.height = `${array[i] * 3}px`;
      bars[minIndex].style.height = `${array[minIndex] * 3}px`;
    }

    bars[minIndex].classList.remove('active');
    bars[i].classList.add('sorted');
  }

  isSorting = false;
  statusMessage.classList.remove('sorting');
  statusMessage.textContent = '✅ Sort Complete!';
  enableControls();
  celeberate();
}

async function bubbleSort() {
  clearColors();
  stepCount = 0;
stepCounter.textContent = `Steps: ${stepCount}`;
  isSorting = true;
  disableControls();
  sortBadge.textContent = `${capitalize(selectedAlgorithm)} Sort`;
  const bars = document.querySelectorAll('.bar');
  statusMessage.classList.add('sorting');

  for (let i = 0; i < array.length && isSorting; i++) {
    for (let j = 0; j < array.length - i - 1 && isSorting; j++) {
      bars[j].classList.add('active');
      bars[j + 1].classList.add('active');

      await sleep(getSpeed());

      if (!isSorting) break;
      stepCount++;
stepCounter.textContent = `Steps: ${stepCount}`;

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        bars[j].style.height = `${array[j] * 3}px`;
        bars[j + 1].style.height = `${array[j + 1] * 3}px`;
      }

      bars[j].classList.remove('active');
      bars[j + 1].classList.remove('active');
    }

    if (!isSorting) break;

    bars[array.length - i - 1].classList.add('sorted');
  }

  isSorting = false;
  statusMessage.classList.remove('sorting');
  statusMessage.textContent = '✅ Sort Complete!';
  enableControls();
  celeberate();
}

async function insertionSort() {
  clearColors();
  stepCount = 0;
stepCounter.textContent = `Steps: ${stepCount}`;
  isSorting = true;
  disableControls();
  sortBadge.textContent = `${capitalize(selectedAlgorithm)} Sort`;
  const bars = document.querySelectorAll('.bar');
  statusMessage.classList.add('sorting');

  for (let i = 1; i < array.length && isSorting; i++) {
    let key = array[i];
    let j = i - 1;

    bars[i].classList.add('active');
    await sleep(getSpeed());

    while (j >= 0 && array[j] > key && isSorting) {
      bars[j].classList.add('active');
      array[j + 1] = array[j];
      bars[j + 1].style.height = `${array[j + 1] * 3}px`;
      await sleep(getSpeed());
      bars[j].classList.remove('active');
      j--;
      stepCount++;
stepCounter.textContent = `Steps: ${stepCount}`;
    }

    if (!isSorting) break;

    array[j + 1] = key;
    bars[j + 1].style.height = `${key * 3}px`;
    bars[i].classList.remove('active');
  }

  if (isSorting) {
    for (let k = 0; k < array.length; k++) {
      bars[k].classList.add('sorted');
      await sleep(20);
    }
  }

  isSorting = false;
  statusMessage.classList.remove('sorting');
  statusMessage.textContent = '✅ Sort Complete!';
  enableControls();
  celeberate();
}
function celebrate() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}
 let isOn = false;
  function toggleSwitch() {
    const knob = document.getElementById('knob');
    knob.setAttribute('cx', isOn ? '15' : '45');
    isOn = !isOn;
  }


// 🎬 Event Listeners
generateBtn.addEventListener('click', () => generateArray());
resetBtn.addEventListener('click', () => {
  statusMessage.textContent = '';
  statusMessage.classList.remove('sorting');
  generateArray();
});
stopBtn.addEventListener('click', () => {
  isSorting = false;
  statusMessage.classList.remove('sorting');
  statusMessage.textContent = '⏹️ Sorting Stopped';
  enableControls();
});
startBtn.addEventListener('click', () => {
  switch (selectedAlgorithm) {
    case 'bubble':
      bubbleSort();
      break;
    case 'selection':
      selectionSort();
      break;
    case 'insertion':
      insertionSort();
      break;
    default:
      console.warn('Unknown algorithm:', selectedAlgorithm);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.sort-buttons button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.sort-buttons button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      selectedAlgorithm = button.getAttribute('data-sort');
      console.log('Selected:', selectedAlgorithm);
    });
  });
});

// 🚀 Initial Render
generateArray();
resetBars();