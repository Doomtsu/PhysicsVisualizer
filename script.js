const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pulleyRadius = 30;
const massSize = 40;
const ropeWidth = 2;
const pulleyY = 100;
const gravity = 9.81;
const themeToggleButton = document.getElementById('themeToggle');


let mass1 = 10;
let mass2 = 5;
let position1, position2;
let velocity = 0;
let acceleration = 0;
let angle = 0;
let animationId;
let isPlaying = false;
let speedFactor = 9.81;


function drawPulley() {
    ctx.save();
    ctx.translate(canvas.width / 2, pulleyY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, pulleyRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#4a90e2';
    ctx.fill();
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(pulleyRadius, 0);
    ctx.strokeStyle = '#2c3e50';
    ctx.stroke();
    ctx.restore();
}

function drawRope() {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - pulleyRadius, pulleyY);
    ctx.lineTo(canvas.width / 4, position1);
    ctx.moveTo(canvas.width / 2 + pulleyRadius, pulleyY);
    ctx.lineTo(3 * canvas.width / 4, position2);
    ctx.strokeStyle = '#8e44ad';
    ctx.lineWidth = ropeWidth;
    ctx.stroke();
}

function drawMass(x, y, mass, label) {
    ctx.beginPath();
    ctx.rect(x - massSize / 2, y - massSize / 2, massSize, massSize);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRope();
    drawPulley();
    drawMass(canvas.width / 4, position1, mass1, 'm1');
    drawMass(3 * canvas.width / 4, position2, mass2, 'm2');
}

function updatePhysics() {
    acceleration = ((mass2 - mass1) / (mass1 + mass2)) * speedFactor;
    velocity += acceleration * 0.001 * speedFactor; // Assuming 60 FPS
    const displacement = velocity * 0.001 * speedFactor;
    position1 -= displacement;
    position2 += displacement;
    angle -= displacement / pulleyRadius;

    // Stop if either mass reaches the pulley
    if (position1 <= pulleyY + massSize / 2 || position2 <= pulleyY + massSize / 2) {
        isPlaying = false;
    }
}

function updatePhysicsInfo() {
    
    const tension = (2 * mass1 * mass2 * speedFactor) / (mass1 + mass2);
    const infoElement = document.getElementById('physicsInfo');
    infoElement.innerHTML = `
        <h4>Physics Information:</h4>
        <p>Gravity: ${speedFactor.toFixed(2)} m/s²</p>
        <p>|Acceleration|: ${Math.abs(acceleration.toFixed(2))} m/s²</p>
        <p>|Velocity|: ${Math.abs(velocity.toFixed(2))} m/s</p>
        <p>Tension: ${tension.toFixed(2)} N</p>
    `;
}

function animate() {
    if (!isPlaying) return;

    updatePhysics();
    drawScene();
    updatePhysicsInfo();

    animationId = requestAnimationFrame(animate);
}

function toggleAnimation() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        animate();
    } else {
        cancelAnimationFrame(animationId);
    }
}

function resetSimulation() {
    mass1 = parseFloat(document.getElementById('mass1').value);
    mass2 = parseFloat(document.getElementById('mass2').value);
    position1 = canvas.height - massSize / 2;
    position2 = canvas.height - massSize / 2;
    velocity = 0;
    acceleration = 0;
    angle = 0;
    isPlaying = false;
    cancelAnimationFrame(animationId);
    drawScene();
    updatePhysicsInfo();
}

document.getElementById('playPause').addEventListener('click', toggleAnimation);
document.getElementById('reset').addEventListener('click', resetSimulation);
document.getElementById('speedControl').addEventListener('input', (e) => {
    speedFactor = parseFloat(e.target.value);
});
document.getElementById('mass1').addEventListener('input', resetSimulation);
document.getElementById('mass2').addEventListener('input', resetSimulation);

// Initial setup
resetSimulation();