class CircularMotionSimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.radius = 100; // Initial radius
        this.angularSpeed = 1; // Initial angular speed (radians per second)
        this.angle = 0; // Starting angle
        this.isSimulating = false;
        this.lastTime = 0;

        this.initializeControls();
        this.draw();
    }

    initializeControls() {
        const radiusInput = document.getElementById('radiusInput');
        const speedInput = document.getElementById('speedInput');
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');

        radiusInput.addEventListener('input', () => {
            this.radius = parseFloat(radiusInput.value);
            this.draw();
        });

        speedInput.addEventListener('input', () => {
            this.angularSpeed = parseFloat(speedInput.value);
        });

        startBtn.addEventListener('click', () => {
            if (!this.isSimulating) {
                this.isSimulating = true;
                startBtn.textContent = 'Pause';
                this.animate();
            } else {
                this.isSimulating = false;
                startBtn.textContent = 'Start';
            }
        });

        resetBtn.addEventListener('click', () => {
            this.reset();
        });

        this.reset();
    }

    reset() {
        this.isSimulating = false;
        document.getElementById('startBtn').textContent = 'Start';
        this.angle = 0;
        this.radius = parseFloat(document.getElementById('radiusInput').value);
        this.angularSpeed = parseFloat(document.getElementById('speedInput').value);
        this.draw();
        this.updateInfo();
    }

    animate() {
        if (!this.isSimulating) return;

        const currentTime = performance.now();
        if (this.lastTime) {
            const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
            this.angle += this.angularSpeed * deltaTime;
        }

        this.lastTime = currentTime;
        this.draw();
        this.updateInfo();
        requestAnimationFrame(() => this.animate());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the circle path
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'gray';
        this.ctx.stroke();

        // Draw the moving object
        const x = this.centerX + this.radius * Math.cos(this.angle);
        const y = this.centerY + this.radius * Math.sin(this.angle);
        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();

        // Draw a line from center to object
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(x, y);
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();
    }

    updateInfo() {
        const infoDiv = document.getElementById('info');
        const period = (2 * Math.PI / this.angularSpeed).toFixed(2);
        const frequency = (this.angularSpeed / (2 * Math.PI)).toFixed(2);
        const velocity = (this.radius * this.angularSpeed).toFixed(2);
        const acceleration = (this.radius * this.angularSpeed * this.angularSpeed).toFixed(2);

        infoDiv.innerHTML = `
            <strong>Circular Motion Information:</strong><br>
            Angle: ${(this.angle % (2 * Math.PI)).toFixed(2)} radians<br>
            Angular Speed: ${this.angularSpeed.toFixed(2)} rad/s<br>
            Period: ${period} s<br>
            Frequency: ${frequency} Hz<br>
            Velocity: ${velocity} m/s<br>
            Centripetal Acceleration: ${acceleration} m/s²
        `;
    }
}

// Initialize the simulator when the window loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('circularCanvas');
    new CircularMotionSimulator(canvas);
});