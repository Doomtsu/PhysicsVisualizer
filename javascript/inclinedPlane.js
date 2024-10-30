const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const angleSlider = document.getElementById("angleSlider");
const angleValue = document.getElementById("angleValue");
const massInput = document.getElementById("massInput");
const frictionInput = document.getElementById("frictionInput");
const simulateBtn = document.getElementById("simulateBtn");
const forceInfo = document.getElementById("forceInfo");

let angle = 30;
let mass = 1;
let friction = 0.3;
const FIXED_DISTANCE_FROM_TOP = 100;

function init() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  const angleSlider = document.getElementById("angleSlider");
  angleSlider.addEventListener("input", function () {
    angle = parseInt(this.value);
    drawScene();
  });

  drawScene();
}

function drawScene() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const angleRad = (angle * Math.PI) / 180;
  const padding = 50;
  const maxHeight = canvas.height - 2 * padding;
  const maxWidth = canvas.width - 2 * padding;

  let rampHeight = maxWidth * Math.tan(angleRad);
  let rampWidth = maxWidth;

  if (rampHeight > maxHeight) {
    rampHeight = maxHeight;
    rampWidth = maxHeight / Math.tan(angleRad);
  }

  const startX = padding;
  const startY = canvas.height - padding;
  const endX = startX + rampWidth;
  const endY = startY - rampHeight;

  ctx.beginPath();
  ctx.fillStyle = "#6e2e4a";
  ctx.strokeStyle = "#6e2e4a";
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.lineTo(endX, startY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.save();

  const rampLength = Math.sqrt(
    rampWidth * rampWidth + rampHeight * rampHeight
  );

  const scaledDistance = (FIXED_DISTANCE_FROM_TOP / 800) * rampLength;
  const topX = endX;
  const topY = endY;
  const blockX = topX - scaledDistance * Math.cos(angleRad);
  const blockY = topY + scaledDistance * Math.sin(angleRad);

  ctx.translate(blockX, blockY);
  ctx.rotate(-angleRad);
  ctx.beginPath();
  ctx.fillStyle = "#61b4c7";
  ctx.strokeStyle = "#61b4c7";

  const blockWidth = 40;
  const blockHeight = 30;
  ctx.rect(-blockWidth / 2, -blockHeight / 2, blockWidth, blockHeight);

  ctx.fill();
  ctx.stroke();

  ctx.restore();

  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Angle: ${angle}°`, 10, 30);
}
window.onload = init;

function calculateForces() {
  const g = 9.81;
  const weightForce = mass * g;
  const normalForce = weightForce * Math.cos((angle * Math.PI) / 180);
  const parallelForce = weightForce * Math.sin((angle * Math.PI) / 180);
  const frictionForce = friction * normalForce;
  const netForce = parallelForce - frictionForce;

  forceInfo.innerHTML = `
              <h4>Forces:</h4>
              <p>Weight: ${weightForce.toFixed(2)} N</p>
              <p>Normal Force: ${normalForce.toFixed(2)} N</p>
              <p>Parallel Force: ${parallelForce.toFixed(2)} N</p>
              <p>Friction Force: ${frictionForce.toFixed(2)} N</p>
              <p>Net Force: ${netForce.toFixed(2)} N</p>
          `;
}

angleSlider.addEventListener("input", (e) => {
  angle = parseInt(e.target.value);
  angleValue.textContent = angle;
  drawScene();
});

simulateBtn.addEventListener("click", () => {
  mass = parseFloat(massInput.value);
  friction = parseFloat(frictionInput.value);
  drawScene();
  calculateForces();
});

drawScene();