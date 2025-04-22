
const clock = document.querySelector('.clock');
const timeDisplay = document.getElementById('time');
const startStopBtn = document.getElementById('startStop');
const resetBtn = document.getElementById('reset');
const toggleModeBtn = document.getElementById('toggleMode');
const toggleSettingsBtn = document.getElementById('toggleSettings');
const settingsPanel = document.getElementById('settings');
const modeIndicator = document.querySelector('.mode-indicator');
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const timeTrails = document.getElementById('timeTrails');

const depthLevel = document.getElementById('depthLevel');
const rotationSpeed = document.getElementById('rotationSpeed');
const trailIntensity = document.getElementById('trailIntensity');
const themeInputs = document.querySelectorAll('input[name="theme"]');

let mode = 'clock'; 
let isRunning = false;
let startTime = 0;
let elapsedTime = 0;
let intervalId;
let mouseX = 0;
let mouseY = 0;
let rotationX = 0;
let rotationY = 0;
let autoRotation = 0;
let trails = [];
let trailMaxCount = 5;
let currentTheme = 'cyan';

function initializeClockMarkers() {
    const layer1 = document.getElementById('layer1');
    for (let i = 0; i < 12; i++) {
        const marker = document.createElement('div');
        marker.className = 'marker';
        marker.style.height = i % 3 === 0 ? '30px' : '15px';
        marker.style.transform = `rotate(${i * 30}deg) translateY(-180px)`;
        layer1.appendChild(marker);
    }
}


function updateClockHands() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
    
    const hourDegrees = (hours * 30) + (minutes * 0.5);
    const minuteDegrees = (minutes * 6) + (seconds * 0.1);
    const secondDegrees = (seconds * 6) + (milliseconds * 0.006);
    
    hourHand.style.transform = `translateX(-50%) rotate(${hourDegrees}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minuteDegrees}deg)`;
    secondHand.style.transform = `translateX(-50%) rotate(${secondDegrees}deg)`;
    
  
}

function formatTime(timeInMs) {
    if (mode === 'clock') {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    } else {
        const totalSeconds = Math.floor(timeInMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((timeInMs % 1000) / 10);
        
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    }
}

function updateTimeDisplay() {
    if (mode === 'clock') {
        timeDisplay.textContent = formatTime();
        updateClockHands();
    } else {
        const currentTime = isRunning ? Date.now() - startTime + elapsedTime : elapsedTime;
        timeDisplay.textContent = formatTime(currentTime);
    }
}

function toggleStopwatch() {
    if (mode !== 'stopwatch') return;
    
    if (!isRunning) {
        startTime = Date.now();
        intervalId = setInterval(updateTimeDisplay, 10);
        startStopBtn.textContent = 'Stop';
    } else {
        elapsedTime += Date.now() - startTime;
        clearInterval(intervalId);
        startStopBtn.textContent = 'Start';
    }
    
    isRunning = !isRunning;
}

function resetStopwatch() {
    if (mode !== 'stopwatch') return;
    
    if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
        startStopBtn.textContent = 'Start';
    }
    
    elapsedTime = 0;
    updateTimeDisplay();
}

function toggleMode() {
    if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
    }
    
    mode = mode === 'clock' ? 'stopwatch' : 'clock';
    
    if (mode === 'clock') {
        toggleModeBtn.textContent = 'Switch to Stopwatch';
        startStopBtn.textContent = 'Start Stopwatch';
        startStopBtn.disabled = true;
        resetBtn.disabled = true;
        modeIndicator.textContent = 'Clock Mode';
        

        hourHand.style.display = 'block';
        minuteHand.style.display = 'block';
        secondHand.style.display = 'block';
        
        intervalId = setInterval(updateTimeDisplay, 1000);
    } else {
        toggleModeBtn.textContent = 'Switch to Clock';
        startStopBtn.textContent = 'Start';
        startStopBtn.disabled = false;
        resetBtn.disabled = false;
        elapsedTime = 0;
        modeIndicator.textContent = 'Stopwatch Mode';
        
    
        hourHand.style.display = 'none';
        minuteHand.style.display = 'none';
        secondHand.style.display = 'none';
        
        clearInterval(intervalId);
    }
    
    updateTimeDisplay();
}


function addTimeTail(degree) {
    const trail = document.createElement('div');
    trail.className = 'trail';
    
    const size = Math.random() * 20 + 10;
    const positionX = 185 * Math.cos(degree * Math.PI / 180);
    const positionY = 185 * Math.sin(degree * Math.PI / 180);
    
    trail.style.width = `${size}px`;
    trail.style.height = `${size}px`;
    trail.style.left = `${positionX + 200 - size/2}px`;
    trail.style.top = `${positionY + 200 - size/2}px`;
    trail.style.transform = `translateZ(${Math.random() * -200}px)`;
    
    timeTrails.appendChild(trail);
    trails.push(trail);
    
    if (trails.length > trailMaxCount * parseInt(trailIntensity.value)) {
        const oldestTrail = trails.shift();
        if (oldestTrail) {
            oldestTrail.remove();
        }
    }
}


function apply3DRotation() {
    if (autoRotation > 0) {
        rotationY += autoRotation * 0.01;
    }
    
    clock.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    requestAnimationFrame(apply3DRotation);
}

function toggleSettings() {
    settingsPanel.classList.toggle('visible');
}

function updatePerspective() {
    document.querySelector('.container').style.perspective = `${depthLevel.value}px`;
}

function updateRotationSpeed() {
    autoRotation = parseFloat(rotationSpeed.value);
}

function updateTrailIntensity() {
    const value = parseInt(trailIntensity.value);
    trailMaxCount = value * 2;
    
    if (value === 0) {
        trails.forEach(trail => trail.remove());
        trails = [];
    }
}

function updateTheme(theme) {
    document.body.classList.remove(`theme-${currentTheme}`);
    currentTheme = theme;
    document.body.classList.add(`theme-${currentTheme}`);
}

startStopBtn.addEventListener('click', toggleStopwatch);
resetBtn.addEventListener('click', resetStopwatch);
toggleModeBtn.addEventListener('click', toggleMode);
toggleSettingsBtn.addEventListener('click', toggleSettings);
depthLevel.addEventListener('input', updatePerspective);
rotationSpeed.addEventListener('input', updateRotationSpeed);
trailIntensity.addEventListener('input', updateTrailIntensity);

themeInputs.forEach(input => {
    input.addEventListener('change', function() {
        if (this.checked) {
            updateTheme(this.value);
        }
    });
});

document.addEventListener('mousemove', (e) => {
    if (autoRotation > 0) return;
    
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    rotationX = (e.clientY - windowHeight / 2) * 0.02;
    rotationY = (e.clientX - windowWidth / 2) * 0.02;
});

initializeClockMarkers();
apply3DRotation();
updatePerspective();
toggleMode(); 
updateTheme('cyan');