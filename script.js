const startScreen = document.getElementById('pantalla-inicio');
const startButton = document.getElementById('btn-comenzar');
const grid = document.getElementById('grid');
const levelInfo = document.getElementById('level-info');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const juego = document.getElementById('juego');

const baseColors = ["#964B00", "#FFA500", "#228B22"]; // Marrón, naranja, verde
const intruderColors = [
  "#0000FF", "#FF00FF", "#FFC0CB", "#00FFFF", "#FFFF00", 
  "#8B4513", "#DAA520", "#006400", "#CD853F", "#BDB76B"
];

let level = 1;
const maxLevel = 10;

let totalTime = 10; 
let timeLeft = totalTime;
let timerInterval;

startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  juego.style.display = 'block';
  restartButton.style.display = 'none'; 
  startGame();
});

restartButton.addEventListener('click', () => {
  
  const fullscreenMsg = document.getElementById('fullscreen-message');
  if (fullscreenMsg) {
    fullscreenMsg.style.display = 'none';
  }
  levelInfo.style.display = 'block';
  restartButton.style.display = 'none'; 
  message.style.display = 'block';
  message.textContent = '';
  timeLeft = totalTime;
  startGame();
});

function startGame() {
  level = 1;
  message.textContent = '';
  timeLeft = totalTime;
  generateLevel();
  startTimer();
}

function generateLevel() {
  levelInfo.textContent = `Nivel: ${level} - Tiempo restante: ${timeLeft.toFixed(1)}s`;
  message.textContent = '';
  grid.innerHTML = '';

  const size = 2;  // 2x2 fijo
  const totalSquares = size * size;
  const baseColor = baseColors[Math.floor(Math.random() * baseColors.length)];

  let intruderColor;
  if (level <= intruderColors.length) {
    intruderColor = intruderColors[level - 1];
  } else {
    intruderColor = generateSimilarColor(baseColor, 5);
  }

  const intruderIndex = Math.floor(Math.random() * totalSquares);

  for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.backgroundColor = i === intruderIndex ? intruderColor : baseColor;
    square.addEventListener('click', () => handleClick(i === intruderIndex));
    grid.appendChild(square);
  }
}

function handleClick(isCorrect) {
  if (isCorrect) {
    if (level === maxLevel) {
      endGame(true);
    } else {
      level++;
      generateLevel();
    }
  } else {
    message.textContent = '¡Fallaste! Intenta de nuevo.';
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      clearInterval(timerInterval);
      endGame(false);
    } else {
      updateLevelInfo();
    }
  }, 100);
}

function updateLevelInfo() {
  levelInfo.textContent = `Nivel: ${level} - Tiempo restante: ${timeLeft.toFixed(1)}s`;
}

function endGame(won) {
  clearInterval(timerInterval);
  grid.innerHTML = '';
  levelInfo.style.display = 'none';
  message.style.display = 'none';
  restartButton.style.display = 'none'; 


  let fullscreenMsg = document.getElementById('fullscreen-message');
  if (!fullscreenMsg) {
    fullscreenMsg = document.createElement('div');
    fullscreenMsg.id = 'fullscreen-message';
    fullscreenMsg.className = 'fullscreen-message';

    
    const textDiv = document.createElement('div');
    textDiv.id = 'final-text';
    fullscreenMsg.appendChild(textDiv);


    const finalRestartBtn = document.createElement('button');
    finalRestartBtn.id = 'final-restart';
    finalRestartBtn.textContent = 'Reiniciar';
    finalRestartBtn.addEventListener('click', () => {
      fullscreenMsg.style.display = 'none';
      startScreen.style.display = 'flex'; 
      juego.style.display = 'none';
    });
    fullscreenMsg.appendChild(finalRestartBtn);

    document.body.appendChild(fullscreenMsg);
  }

 
  document.getElementById('final-text').textContent = won
    ? '¡Ganaste! Has completado todos los niveles.'
    : '¡Se acabó el tiempo! Intenta de nuevo.';

  fullscreenMsg.style.display = 'flex';

  
  juego.style.display = 'none';
}

function generateSimilarColor(baseHex, difficulty) {
  let rgb = hexToRgb(baseHex);
  let variation = difficulty * 4;
  let channel = Math.floor(Math.random() * 3);
  rgb[channel] = Math.min(255, Math.max(0, rgb[channel] + (Math.random() < 0.5 ? -1 : 1) * variation));
  return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
}

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
