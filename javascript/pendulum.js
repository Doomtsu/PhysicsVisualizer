class PendulumSimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.length = 1; // m
        this.angle = 0; // radians (starts vertically down)
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.gravity = 9.81; // m/s²
        this.pivotX = canvas.width / 2;
        this.pivotY = 50;
        this.isSimulating = false;
        this.pixelsPerMeter = 100;
        this.lastTime = 0;
        this.dampingFactor = 0.999; // slight damping to make it more realistic

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
            if (!this.isSimulating) {
                this.draw();
            }
        });

        angleInput.addEventListener('input', () => {
            // Convert from degrees to radians and adjust for downward start
            this.angle = -(parseFloat(angleInput.value) * Math.PI) / 180;
            if (!this.isSimulating) {
                this.draw();
            }
        });

        gravityInput.addEventListener('input', () => {
            this.gravity = parseFloat(gravityInput.value);
        });

        startBtn.addEventListener('click', () => {
            if (!this.isSimulating) {
                this.isSimulating = true;
                startBtn.textContent = 'Pause';
                this.animate(performance.now());
            } else {
                this.isSimulating = false;
                startBtn.textContent = 'Start';
            }
        });

        resetBtn.addEventListener('click', () => {
            this.reset();
        });
    }

    reset() {
        this.isSimulating = false;
        document.getElementById('startBtn').textContent = 'Start';
        // Convert initial angle from degrees to radians
        this.angle = -(parseFloat(document.getElementById('angleInput').value) * Math.PI) / 180;
        this.angleVelocity = 0;
        this.angleAcceleration = 0;
        this.draw();
        this.updateInfo();
    }

    animate(currentTime) {
        if (!this.isSimulating) return;

        if (this.lastTime) {
            const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
            this.update(deltaTime);
        }

        this.lastTime = currentTime;
        this.draw();
        requestAnimationFrame((time) => this.animate(time));
    }

    update(deltaTime) {
        // Using Euler method with small time steps for better accuracy
        const dt = deltaTime / 10; // Split into smaller time steps
        
        for (let i = 0; i < 10; i++) {
            // Calculate acceleration using the pendulum differential equation
            this.angleAcceleration = (-this.gravity / this.length) * Math.sin(this.angle);
            
            // Update velocity and position
            this.angleVelocity += this.angleAcceleration * dt;
            this.angle += this.angleVelocity * dt;
            
            // Apply damping
            this.angleVelocity *= this.dampingFactor;
        }

        this.updateInfo();
    }

    updateInfo() {
        const pendulumInfo = document.getElementById('pendulumInfo');
        const period = 2 * Math.PI * Math.sqrt(this.length / this.gravity);
        
        pendulumInfo.innerHTML = `
            <strong>Pendulum Information:</strong><br>
            Angle: ${(-this.angle * 180 / Math.PI).toFixed(1)}°<br>
            Angular Velocity: ${(-this.angleVelocity * 180 / Math.PI).toFixed(1)}°/s<br>
            Period: ${period.toFixed(2)} s
        `;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw pivot point
        this.ctx.beginPath();
        this.ctx.arc(this.pivotX, this.pivotY, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fill();

        // Calculate bob position
        const bobX = this.pivotX + Math.sin(this.angle) * this.length * this.pixelsPerMeter;
        const bobY = this.pivotY + Math.cos(this.angle) * this.length * this.pixelsPerMeter;

        // Draw string
        this.ctx.beginPath();
        this.ctx.moveTo(this.pivotX, this.pivotY);
        this.ctx.lineTo(bobX, bobY);
        this.ctx.strokeStyle = '#2c3e50';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw bob
        this.ctx.beginPath();
        this.ctx.arc(bobX, bobY, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
        this.ctx.strokeStyle = '#c0392b';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw angle indicator (optional)
        if (!this.isSimulating) {
            this.ctx.beginPath();
            this.ctx.arc(this.pivotX, this.pivotY, 30, Math.PI, Math.PI + this.angle);
            this.ctx.strokeStyle = '#3498db';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }
}

// Initialize the simulator when the window loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('pendulumCanvas');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 400;
    new PendulumSimulator(canvas);
});