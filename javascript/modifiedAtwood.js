class ModifiedAtwoodMachine {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.scale = 100; // pixels per meter

        // Initialize parameters
        this.m1 = 1; // kg (mass on incline)
        this.m2 = 2; // kg (hanging mass)
        this.angle = 30; // degrees
        this.mu = 0.1; // coefficient of friction
        this.g = 9.81; // m/s^2

        // Simulation variables
        this.position = 0; // m
        this.velocity = 0; // m/s
        this.acceleration = 0; // m/s^2
        this.time = 0; // s
        this.isRunning = false;
        this.timeStep = 1 / 60; // s (60 FPS)

        this.bindControls();
        this.calculateAcceleration();
        this.draw();
    }

    calculateAcceleration() {
        const sinTheta = Math.sin(this.angle * Math.PI / 180);
        const cosTheta = Math.cos(this.angle * Math.PI / 180);
        
        // Calculate acceleration
        const numerator = this.m2 * this.g - this.m1 * this.g * (sinTheta - this.mu * cosTheta);
        const denominator = this.m1 + this.m2;
        
        this.acceleration = numerator / denominator;
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    reset() {
        this.isRunning = false;
        this.position = 0;
        this.velocity = 0;
        this.time = 0;
        this.calculateAcceleration();
        this.updateInfo();
        this.draw();
    }

    animate() {
        if (this.isRunning) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.animate());
        }
    }

    update() {
        this.velocity += this.acceleration * this.timeStep;
        this.position += this.velocity * this.timeStep;
        this.time += this.timeStep;

        // Check for simulation end conditions
        const maxInclineLength = 3; // 3 meters
        if (this.position <= 0 || this.position >= maxInclineLength) {
            this.isRunning = false;
            document.getElementById('startBtn').textContent = 'Start';
        }

        this.updateInfo();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const originX = 50;
        const originY = this.canvas.height - 100; // Raise the system higher
        const pulleyX = originX + 300;
        const pulleyY = originY - 300 * Math.tan(this.angle * Math.PI / 180);

        // Draw incline
        this.ctx.beginPath();
        this.ctx.moveTo(originX, originY);
        this.ctx.lineTo(pulleyX, pulleyY);
        this.ctx.lineTo(pulleyX, originY);
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();

        // Draw ramp fill (optional)
        this.ctx.fillStyle = '#0047ab';
        this.ctx.beginPath();
        this.ctx.moveTo(originX, originY);
        this.ctx.lineTo(pulleyX, pulleyY);
        this.ctx.lineTo(pulleyX, originY);
        this.ctx.fill();

        // Draw pulley
        this.ctx.beginPath();
        this.ctx.arc(pulleyX, pulleyY, 20, 0, 2 * Math.PI);
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();

        // Calculate positions of masses
        const pos = this.position * this.scale;
        const angleRad = this.angle * Math.PI / 180;
        
        // Draw mass on incline
        const mass1X = originX + pos * Math.cos(angleRad);
        const mass1Y = originY - pos * Math.sin(angleRad);
        
        // Draw hanging mass (moves in opposite direction)
        const mass2X = pulleyX;
        const mass2Y = pulleyY + pos;

        // Draw masses
        this.drawMass(mass1X, mass1Y, 'M1');
        this.drawMass(mass2X, mass2Y, 'M2');

        // Draw rope
        this.ctx.beginPath();
        this.ctx.moveTo(mass1X, mass1Y);
        this.ctx.lineTo(pulleyX, pulleyY);
        this.ctx.lineTo(mass2X, mass2Y);
        this.ctx.stroke ();
    }

    drawMass(x, y, label) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#f00';
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.stroke();
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(label, x, y);
    }

    updateInfo() {
        const infoElement = document.getElementById('simulationInfo');
        infoElement.innerHTML = `
            Time: ${this.time.toFixed(2)} s<br>
            Position: ${this.position.toFixed(2)} m<br>
            Velocity: ${this.velocity.toFixed(2)} m/s<br>
            Acceleration: ${this.acceleration.toFixed(2)} m/s²
        `;
    }

    bindControls() {
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');
        const mass1Input = document.getElementById('mass1');
        const mass2Input = document.getElementById('mass2');
        const angleInput = document.getElementById('angle');
        const frictionInput = document.getElementById('friction');

        startBtn.addEventListener('click', () => {
            if (this.isRunning) {
                this.isRunning = false;
                startBtn.textContent = 'Start';
            } else {
                this.start();
                startBtn.textContent = 'Pause';
            }
        });

        resetBtn.addEventListener('click', () => this.reset());

        const recalculateAcceleration = () => {
            this.calculateAcceleration();
            this.updateInfo();
            this.draw();
        };

        mass1Input.addEventListener('change', (e) => {
            this.m1 = parseFloat(e.target.value);
            recalculateAcceleration();
        });

        mass2Input.addEventListener('change', (e) => {
            this.m2 = parseFloat(e.target.value);
            recalculateAcceleration();
        });

        angleInput.addEventListener('change', (e) => {
            this.angle = parseFloat(e.target.value);
            recalculateAcceleration();
        });

        frictionInput.addEventListener('change', (e) => {
            this.mu = parseFloat(e.target.value);
            recalculateAcceleration();
        });
    }
}

// Initialize the simulator when the window loads
window.addEventListener('load', () => {
    new ModifiedAtwoodMachine();
});