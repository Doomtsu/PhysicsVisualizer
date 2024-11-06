class StandardAtwoodsMachine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.pulleyRadius = 30;
        this.massSize = 40;
        this.ropeWidth = 2;
        this.pulleyY = 100;
        this.gravity = 9.81;
        this.mass1 = 10;
        this.mass2 = 5;
        this.position1 = canvas.height - this.massSize / 2;
        this.position2 = canvas.height - this.massSize / 2;
        this.velocity = 0;
        this.acceleration = 0;
        this.angle = 0;
        this.isPlaying = false;
        this.speedFactor = 9.81;

        this.initControls();
        this.drawScene();
    }

    initControls() {
        document.getElementById("playPauseStandard").addEventListener("click", () => this.toggleAnimation());
        document.getElementById("resetStandard").addEventListener("click", () => this.resetSimulation());
        document.getElementById("gravityStandard").addEventListener("input", (e) => {
            this.speedFactor = parseFloat(e.target.value);
            this.updatePhysicsInfo();
        });
        document.getElementById("mass1").addEventListener("input", () => this.resetSimulation());
        document.getElementById("mass2").addEventListener("input", () => this.resetSimulation());
    }

    toggleAnimation() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.animate();
        }
    }

    resetSimulation() {
        this.mass1 = parseFloat(document.getElementById("mass1").value);
        this.mass2 = parseFloat(document.getElementById("mass2").value);
        this.position1 = this.canvas.height - this.massSize / 2;
        this.position2 = this.canvas.height - this.massSize / 2;
        this.velocity = 0;
        this.acceleration = 0;
        this.angle = 0;
        this.isPlaying = false;
        this.drawScene();
        this.updatePhysicsInfo();
    }

    updatePhysics() {
        this.acceleration = ((this.mass2 - this.mass1) / (this.mass1 + this.mass2)) * this.speedFactor;
        this.velocity += this.acceleration * 0.001 * this.speedFactor;
        const displacement = this.velocity * 0.001 * this.speedFactor;
        this.position1 -= displacement;
        this.position2 += displacement;
        this.angle -= displacement / this.pulleyRadius;
        if (this.position1 <= this.pulleyY + this.massSize / 2 || this.position2 <= this.pulleyY + this.massSize / 2) {
            this.isPlaying = false;
        }
    }

    updatePhysicsInfo() {
        const tension = (2 * this.mass1 * this.mass2 * this.speedFactor) / (this.mass1 + this.mass2);
        const infoElement = document.getElementById("physicsInfoStandard");
        infoElement.innerHTML = `
            <h4>Physics Information:</h4>
            <p>Gravity: ${this.speedFactor.toFixed(2)} m/s²</p>
            <p>|Acceleration|: ${Math.abs(this.acceleration.toFixed(2))} m/s²</p>
            <p>|Velocity|: ${Math.abs(this.velocity.toFixed(2))} m/s</p>
            <p>Tension: ${tension.toFixed(2)} N</p>
        `;
    }

    animate() {
        if (!this.isPlaying) return;
        this.updatePhysics();
        this.drawScene();
        this.updatePhysicsInfo();
        requestAnimationFrame(() => this.animate());
    }

    drawScene() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawRope();
        this.drawPulley();
        this.drawMass(this.canvas.width / 4, this.position1, this.mass1, "m1");
        this.drawMass((3 * this.canvas.width) / 4, this.position2, this.mass2, "m2");
    }

    drawPulley() {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.pulleyY);
        this.ctx.rotate(this.angle);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.pulleyRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#4a90e2";
        this.ctx.fill();
        this.ctx.strokeStyle = "#2c3e50";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(this.pulleyRadius, 0);
        this.ctx.strokeStyle = "#2c3e50";
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawRope() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2 - this.pulleyRadius, this.pulleyY);
        this.ctx.lineTo(this.canvas.width / 4, this.position1);
        this.ctx.moveTo(this.canvas.width / 2 + this.pulleyRadius, this.pulleyY);
        this.ctx.lineTo((3 * this.canvas.width) / 4, this.position2);
        this.ctx.strokeStyle = "#8e44ad";
        this.ctx.lineWidth = this.ropeWidth;
        this.ctx.stroke();
    }

    drawMass(x, y, mass, label) {
        this.ctx.beginPath();
        this.ctx.rect(x - this.massSize / 2, y - this.massSize / 2, this.massSize, this.massSize);
        this.ctx.fillStyle = "#e74c3c";
        this.ctx.fill();
        this.ctx.strokeStyle = "#c0392b";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(label, x, y);
    }
}

class ModifiedAtwoodsMachine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.scale = 100;

        this.m1 = 1;
        this.m2 = 2;
        this.angle = 30;
        this.mu = 0.1;
        this.g = 9.81;

        this.position = 0;
        this.velocity = 0;
        this.acceleration = 0;
        this.time = 0;
        this.isRunning = false;
        this.timeStep = 1 / 60;

        this.bindControls();
        this.calculateAcceleration();
        this.draw();
    }

    calculateAcceleration() {
        const sinTheta = Math.sin((this.angle * Math.PI) / 180);
        const cosTheta = Math.cos((this.angle * Math.PI) / 180);

        const numerator =
            this.m2 * this.g - this.m1 * this.g * (sinTheta + this.mu * cosTheta);
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

        const maxInclineLength = 3;
        if (this.position <= 0 || this.position >= maxInclineLength) {
            this.isRunning = false;
        }

        this.updateInfo();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const originX = 50;
        const originY = this.canvas.height - 100;
        const pulleyX = originX + 300;
        const pulleyY = originY - 300 * Math.tan((this.angle * Math.PI) / 180);

        // Draw inclined plane
        this.ctx.beginPath();
        this.ctx.moveTo(originX, originY);
        this.ctx.lineTo(pulleyX, pulleyY);
        this.ctx.lineTo(pulleyX, originY);
        this.ctx.strokeStyle = "#000";
        this.ctx.stroke();

        // Fill inclined plane
        this.ctx.fillStyle = "#0047ab";
        this.ctx.beginPath();
        this.ctx.moveTo(originX, originY);
        this.ctx.lineTo(pulleyX, pulleyY);
        this.ctx.lineTo(pulleyX, originY);
        this.ctx.fill();

        // Draw pulley
        this.ctx.beginPath();
        this.ctx.arc(pulleyX, pulleyY, 20, 0, 2 * Math.PI);
        this.ctx.strokeStyle = "#000";
        this.ctx.stroke();

        const pos = this.position * this.scale;
        const angleRad = (this.angle * Math.PI) / 180;

        // Calculate masses positions
        const mass1X = originX + pos * Math.cos(angleRad);
        const mass1Y = originY - pos * Math.sin(angleRad);
        const mass2X = pulleyX;
        const mass2Y = pulleyY + pos;

        // Draw masses
        this.drawMass(mass1X, mass1Y, "M1");
        this.drawMass(mass2X, mass2Y, "M2");

        // Draw rope
        this.ctx.beginPath();
        this.ctx.moveTo(mass1X, mass1Y);
        this.ctx.lineTo(pulleyX, pulleyY);
        this.ctx.lineTo(mass2X, mass2Y);
        this.ctx.stroke();
    }

    drawMass(x, y, label) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#f00";
        this.ctx.fill();
        this.ctx.strokeStyle = "#000";
        this.ctx.stroke();
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(label, x, y);
    }

    updateInfo() {
        const infoElement = document.getElementById("physicsInfoModified");
        infoElement.innerHTML = `
            Time: ${this.time.toFixed(2)} s<br>
            Position: ${this.position.toFixed(2)} m<br>
            Velocity: ${this.velocity.toFixed(2)} m/s<br>
            Acceleration: ${this.acceleration.toFixed(2)} m/s²
        `;
    }

    bindControls() {
        document.getElementById('massA').addEventListener('input', () => {
            this.m1 = parseFloat(document.getElementById('massA').value);
            this.calculateAcceleration();
            this.updateInfo();
        });

        document.getElementById('massB').addEventListener('input', () => {
            this.m2 = parseFloat(document.getElementById('massB').value);
            this.calculateAcceleration();
            this.updateInfo();
        });

        document.getElementById('playPauseModified').addEventListener('click', () => {
            if (this.isRunning) {
                this.isRunning = false;
            } else {
                this.start();
            }
        });

        document.getElementById('resetModified').addEventListener('click', () => {
            this.reset();
        });
        document.getElementById('angleModified').addEventListener('input', (e) => {
            this.angle = parseFloat(e.target.value);
            this.calculateAcceleration();
            this.updateInfo();
            this.draw();
        });
    
        document.getElementById('frictionModified').addEventListener('input', (e) => {
            this.mu = parseFloat(e.target.value);
            this.calculateAcceleration();
            this.updateInfo();
            this.draw();
        });
    
        document.getElementById('gravityModified').addEventListener('input', (e) => {
            this.g = parseFloat(e.target.value);
            document.getElementById('gravityValueModified').textContent = this.g.toFixed(2);
            this.calculateAcceleration();
            this.updateInfo();
            this.draw();
        });
    }
}

// Initialize both Atwood's Machines
document.addEventListener('DOMContentLoaded', () => {
    const standardCanvas = document.getElementById('standardCanvas');
    const modifiedCanvas = document.getElementById('modifiedCanvas');

    new StandardAtwoodsMachine(standardCanvas);
    new ModifiedAtwoodsMachine(modifiedCanvas);
});