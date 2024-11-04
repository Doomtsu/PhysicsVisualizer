class RotationalMotionSimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.objectType = 'disk';
        this.mass = 1;
        this.radius = 1;
        this.torque = 1;
        this.angle = 0;
        this.angularVelocity = 0;
        this.isSimulating = false;
        this.lastTime = 0;

        this.initializeControls();
        this.draw();
    }

    initializeControls() {
        const objectSelect = document.getElementById('objectSelect');
        const massInput = document.getElementById('massInput');
        const radiusInput = document.getElementById('radiusInput');
        const torqueInput = document.getElementById('torqueInput');
        const startBtn = document.getElementById('startBtn');
        const resetBtn = document.getElementById('resetBtn');

        objectSelect.addEventListener('change', () => {
            this.objectType = objectSelect.value;
            this.reset();
        });

        massInput.addEventListener('input', () => {
            this.mass = parseFloat(massInput.value);
            this.reset();
        });

        radiusInput.addEventListener('input', () => {
            this.radius = parseFloat(radiusInput.value);
            this.reset();
        });

        torqueInput.addEventListener('input', () => {
            this.torque = parseFloat(torqueInput.value);
        });

        startBtn.addEventListener('click', () => {
            this.isSimulating = !this.isSimulating;
            if (this.isSimulating) {
                this.animate();
            }
        });

        resetBtn.addEventListener('click', () => {
            this.reset();
        });
    }

    reset() {
        this.angle = 0;
        this.angularVelocity = 0;
        this.draw();
        this.updateInfo();
    }

    animate(currentTime) {
        if (!this.isSimulating) return;

        if (this.lastTime) {
            const deltaTime = (currentTime - this.lastTime) / 1000;
            const momentOfInertia = this.calculateMomentOfInertia();
            const angularAcceleration = this.torque / momentOfInertia;
            this.angularVelocity += angularAcceleration * deltaTime;
            this.angle += this.angularVelocity * deltaTime;
        }

        this.lastTime = currentTime;
        this.draw();
        this.updateInfo();
        requestAnimationFrame((time) => this.animate(time));
    }

    calculateMomentOfInertia() {
        switch (this.objectType) {
            case 'disk':
                return 0.5 * this.mass * this.radius * this.radius;
            case 'ring':
                return this.mass * this.radius * this.radius;
            case 'rod':
                return (1/12) * this.mass * this.radius * this.radius;
            default:
                return 0.5 * this.mass * this.radius * this.radius;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the rotating object
        this.ctx.save();
        this.ctx.translate(this.centerX, this.centerY);
        this.ctx.rotate(this.angle);

        switch (this.objectType) {
            case 'disk':
                this.drawDisk();
                break;
            case 'ring':
                this.drawRing();
                break;
            case 'rod':
                this.drawRod();
                break;
        }

        this.ctx.restore();
    }

    drawDisk() {
        const scaledRadius = this.radius * 50;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, scaledRadius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        this.ctx.fill();

        // Add a line to show rotation
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -scaledRadius);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    drawRing() {
        const scaledRadius = this.radius * 50;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, scaledRadius, 0, 2 * Math.PI);
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        this.ctx.stroke();

        // Add a marker to show rotation
        this.ctx.beginPath();
        this.ctx.arc(0, -scaledRadius, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    }

    drawRod() {
        const scaledLength = this.radius * 50;
        this.ctx.beginPath();
        this.ctx.moveTo(-scaledLength, 0);
        this.ctx.lineTo(scaledLength, 0);
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
        this.ctx.stroke();

        // Add markers at the ends of the rod
        this.ctx.beginPath();
        this.ctx.arc(-scaledLength, 0, 5, 0, 2 * Math.PI);
        this.ctx.arc(scaledLength, 0, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    }

    updateInfo() {
        const rotationInfo = document.getElementById('rotationInfo');
        rotationInfo.innerHTML = `
            <p>Angle: ${this.angle.toFixed(2)} rad</p>
            <p>Angular Velocity: ${this.angularVelocity.toFixed(2)} rad/s</p>
            <p>Moment of Inertia: ${this.calculateMomentOfInertia().toFixed(2)} kg·m²</p>
        `;
    }
}

const canvas = document.getElementById('rotationCanvas');
const simulator = new RotationalMotionSimulator(canvas);