class PendulumSimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.length = 1;
        this.angle = 0;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.gravity = 9.81;
        this.pivotX = canvas.width / 2;
        this.pivotY = 50;
        this.isSimulating = false;
        this.pixelsPerMeter = 100;
        this.lastTime = 0;
        this.dampingFactor = 0.999;

        this.initializeControls();
        this.draw();
    }

    initializeControls() {
        const lengthInput = document.getElementById("pendulumLength");
        const angleInput = document.getElementById("pendulumAngle");
        const gravityInput = document.getElementById("pendulumGravity");
        const startBtn = document.getElementById("pendulumStartBtn");
        const resetBtn = document.getElementById("pendulumResetBtn");

        lengthInput.addEventListener("input", () => {
            this.length = parseFloat(lengthInput.value);
            if (!this.isSimulating) {
                this.draw();
            }
        });

        angleInput.addEventListener("input", () => {
            this.angle = -(parseFloat(angleInput.value) * Math.PI) / 180;
            if (!this.isSimulating) {
                this.draw();
            }
        });

        gravityInput.addEventListener("input", () => {
            this.gravity = parseFloat(gravityInput.value);
        });

        startBtn.addEventListener("click", () => {
            if (!this.isSimulating) {
                this.isSimulating = true;
                startBtn.textContent = "Pause";
                this.animate(performance.now());
            } else {
                this.isSimulating = false;
                startBtn.textContent = "Start";
            }
        });

        resetBtn.addEventListener("click", () => {
            this.reset();
        });
    }

    reset() {
        this.isSimulating = false;
        document.getElementById("pendulumStartBtn").textContent = "Start";
        this.angle = -(parseFloat(document.getElementById("pendulumAngle").value) * Math.PI) / 180;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.draw();
        this.updateInfo();
    }

    animate(currentTime) {
        if (!this.isSimulating) return;

        if (this.lastTime) {
            const deltaTime = (currentTime - this.lastTime) / 1000;
            this.update(deltaTime);
        }

        this.lastTime = currentTime;
        this.draw();
        requestAnimationFrame((time) => this.animate(time));
    }

    update(deltaTime) {
        const dt = deltaTime / 10;

        for (let i = 0; i < 10; i++) {
            this.angleAcceleration = (-this.gravity / this.length) * Math.sin(this.angle);
            this.angleVelocity += this.angleAcceleration * dt;
            this.angle += this.angleVelocity * dt;
            this.angleVelocity *= this.dampingFactor;
        }

        this.updateInfo();
    }

    updateInfo() {
        const pendulumInfo = document.getElementById("pendulumInfo");
        const period = 2 * Math.PI * Math.sqrt(this.length / this.gravity);

        pendulumInfo.innerHTML = `
            <strong>Pendulum Information:</strong><br>
            Angle: ${((-this.angle * 180) / Math.PI).toFixed(1)}°<br>
            Angular Velocity: ${((-this.angleVelocity * 180) / Math.PI).toFixed(1)}°/s<br>
            Period: ${period.toFixed(2)} s
        `;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw pivot point
        this.ctx.beginPath();
        this.ctx.arc(this.pivotX, this.pivotY, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#2c3e50";
        this.ctx.fill();

        // Calculate bob position
        const bobX = this.pivotX + Math.sin(this.angle) * this.length * this.pixelsPerMeter;
        const bobY = this.pivotY + Math.cos(this.angle) * this.length * this.pixelsPerMeter;

        // Draw string
        this.ctx.beginPath();
        this.ctx.moveTo(this.pivotX, this.pivotY);
        this.ctx.lineTo(bobX, bobY);
        this.ctx.strokeStyle = "#2c3e50";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw bob
        this.ctx.beginPath();
        this.ctx.arc(bobX, bobY, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#e74c3c";
        this.ctx.fill();
        this.ctx.strokeStyle = "#c0392b";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw angle indicator when not simulating
        if (!this.isSimulating) {
            this.ctx.beginPath();
            this.ctx.arc(this.pivotX, this.pivotY, 30, Math.PI, Math.PI + this.angle);
            this.ctx.strokeStyle = "#3498db";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }
}
class SpringOscillator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isRunning = false;
        this.time = 0;
        this.mass = 1; 
        this.springConstant = 10; 
        this.initialDisplacement = 1; 
        this.currentDisplacement = 0;
        this.pixelsPerMeter = 50; 
        this.springBaseY = 50; 
        this.springBaseX = canvas.width / 2; 
        this.equilibriumPosition = canvas.height / 3; 
        this.maxDisplacement = 5;
        this.animate = this.animate.bind(this);
        this.initializeControls();
    }

    initializeControls() {
        this.massInput = document.getElementById('springMass');
        this.springConstantInput = document.getElementById('springConstant');
        this.initialDisplacementInput = document.getElementById('springDisplacement');
        this.startBtn = document.getElementById('springStartBtn');
        this.resetBtn = document.getElementById('springResetBtn');
        this.oscillationInfo = document.getElementById('springInfo');

        this.startBtn.addEventListener('click', () => this.toggleSimulation());
        this.resetBtn.addEventListener('click', () => this.resetSimulation());
        
        this.massInput.addEventListener('input', () => {
            this.mass = parseFloat(this.massInput.value);
            this.updateOscillationInfo();
        });
        
        this.springConstantInput.addEventListener('input', () => {
            this.springConstant = parseFloat(this.springConstantInput.value);
            this.updateOscillationInfo();
        });
        
        this.initialDisplacementInput.addEventListener('input', () => {
            this.initialDisplacement = Math.min(Math.max(parseFloat(this.initialDisplacementInput.value), -this.maxDisplacement), this.maxDisplacement);
            this.initialDisplacementInput.value = this.initialDisplacement; 
            if (!this.isRunning) {
                this.currentDisplacement = this.initialDisplacement;
                this.draw();
            }
        });
        
        this.currentDisplacement = this.initialDisplacement;
        this.updateOscillationInfo();
        this.draw();
    }

    toggleSimulation() {
        this.isRunning = !this.isRunning;
        this.startBtn.textContent = this.isRunning ? 'Stop' : 'Start';
        if (this.isRunning) {
            this.time = 0;
            this.animate();
        }
    }

    resetSimulation() {
        this.isRunning = false;
        this.startBtn.textContent = 'Start';
        this.time = 0;
        this.currentDisplacement = this.initialDisplacement;
        this.draw();
        this.updateOscillationInfo();
    }

    updateOscillationInfo() {
        const angularFrequency = Math.sqrt(this.springConstant / this.mass);
        const period = 2 * Math.PI * Math.sqrt(this.mass / this.springConstant);
        const frequency = 1 / period;
        
        this.oscillationInfo.innerHTML = `
            <strong>Spring Oscillator Information:</strong><br>
            Angular Frequency (ω): ${angularFrequency.toFixed(2)} rad/s<br>
            Period (T): ${period.toFixed(2)} s<br>
            Frequency (f): ${frequency.toFixed(2)} Hz
        `;
    }

    animate() {
        if (!this.isRunning) return;

        const angularFrequency = Math.sqrt(this.springConstant / this.mass);
        this.currentDisplacement = this.initialDisplacement * 
            Math.cos(angularFrequency * this.time);
        
        this.draw();
        this.time += 0.016; 

        requestAnimationFrame(this.animate);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        

        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(this.springBaseX - 40, 0, 80, this.springBaseY);
        

        const displacement = Math.min(Math.max(this.currentDisplacement, -this.maxDisplacement), this.maxDisplacement);
        const springEndY = this.equilibriumPosition + (displacement * this.pixelsPerMeter);

        const numCoils = 20;
        const springAmplitude = 20; 
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.springBaseX, this.springBaseY);
        
        for (let i = 0; i <= numCoils; i++) {
            const progress = i / numCoils;
            const y = this.springBaseY + (springEndY - this.springBaseY) * progress;
            const x = this.springBaseX + Math.sin(progress * Math.PI * numCoils) * springAmplitude;
            
            if (i === 0) {
                this.ctx.moveTo(this.springBaseX, this.springBaseY);
            } else {
                this.ctx.lineTo(x, y);
            }
        }

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
 
        const minBobRadius = 15;
        const maxBobRadius = 30;
        const bobRadius = minBobRadius + (Math.sqrt(this.mass) - 1) * 3;
        const clampedBobRadius = Math.min(Math.max(bobRadius, minBobRadius), maxBobRadius);

        this.ctx.beginPath();
        this.ctx.arc(this.springBaseX, springEndY, clampedBobRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        

        this.ctx.beginPath();
        this.ctx.setLineDash([5, 5]);
        this.ctx.moveTo(this.springBaseX - 50, this.equilibriumPosition);
        this.ctx.lineTo(this.springBaseX + 50, this.equilibriumPosition);
        this.ctx.strokeStyle = '#999';
        this.ctx.stroke();
        this.ctx.setLineDash([]); 
    }
}

const pendulumCanvas = document.getElementById("pendulumCanvas");
const springCanvas = document.getElementById("springCanvas");

const pendulumSimulator = new PendulumSimulator(pendulumCanvas);
const springOscillator = new SpringOscillator(springCanvas);