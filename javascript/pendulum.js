class PendulumSimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.length = 1; // m
        this.angle = Math.PI / 6; // radians
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.gravity = 9.8; // m/s²
        this.pivotX = canvas.width / 2;
        this.pivotY = 50;
        this.isSimulating = false;
        this.pixelsPerMeter = 100;

        this.initializeControls();
        this.draw();
    }

    initializeControls() {
        const lengthInput = document.getElementById('lengthInput');
        const angleInput = document.getElementById('angleInput');
        const gravityInput = document.getElementById('gravityInput');
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');

        lengthInput.addEventListener('input', () => {
            this.length = parseFloat(lengthInput.value);
        });

        angleInput.addEventListener('input', () => {
            this.angle = (parseFloat(angleInput.value) * Math.PI) / 180;
        });

        gravityInput.addEventListener('input', () => {
            this.gravity = parseFloat(gravityInput.value);
        });

        startBtn.addEventListener('click', () => {
            this.isSimulating = true;
        });

        resetBtn.addEventListener('click', () => {
            this.isSimulating = false;
            this.angle = Math.PI / 6;
            this.angleVelocity = 0;
            this.angleAcceleration = 0;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw pivot point
        this.ctx.beginPath();
        this.ctx.arc(this.pivotX, this.pivotY, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();

        // Draw pendulum string
        this.ctx.beginPath();
        this.ctx.moveTo(this.pivotX, this.pivotY);
        this.ctx.lineTo(this.pivotX + Math.sin(this.angle) * this.length * this.pixelsPerMeter, this.pivotY - Math.cos(this.angle) * this.length * this.pixelsPerMeter);
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw pendulum bob
        this.ctx.beginPath();
        this.ctx.arc(this.pivotX + Math.sin(this.angle) * this.length * this.pixelsPerMeter, this.pivotY - Math.cos(this.angle) * this.length * this.pixelsPerMeter, 10, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'black';
        this.ctx.fill();

        if (this.isSimulating) {
            this.update();
        }

        requestAnimationFrame(() => {
            this.draw();
        });
    }

    update() {
        this.angleAcceleration = (-this.gravity / this.length) * Math.sin(this.angle);
        this.angleVelocity += this.angleAcceleration;
        this.angle += this.angleVelocity;

        const pendulumInfo = document.getElementById('pendulumInfo');
        pendulumInfo.innerHTML = `Angle: ${Math.round(this.angle * 180 / Math.PI)}°, Velocity: ${Math.round(this.angleVelocity * 180 / Math.PI)}°/s`;
    }
}

const canvas = document.getElementById('pendulumCanvas');
const simulator = new PendulumSimulator(canvas);