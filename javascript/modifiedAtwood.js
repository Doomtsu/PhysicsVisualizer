class ModifiedAtwoodSimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.mass1 = 1; // kg
        this.mass2 = 1; // kg
        this.mass3 = 2; // kg
        this.angle = 30; // degrees
        this.friction = 0.1;
        this.g = 9.81; // m/s^2
        this.dt = 0.016; // Time step for simulation (approximately 60 FPS)
        this.x1 = 0; // Initial x position of mass 1
        this.x2 = 0; // Initial x position of mass 2
        this.x3 = 0; // Initial x position of mass 3
        this.v1 = 0; // Initial velocity of mass 1
        this.v2 = 0; // Initial velocity of mass 2
        this.v3 = 0; // Initial velocity of mass 3
        this.a1 = 0; // Acceleration of mass 1
        this.a2 = 0; // Acceleration of mass 2
        this.a3 = 0; // Acceleration of mass 3
        this.isSimulating = false;
    }

    calculateForces() {
        const sinAngle = Math.sin(this.angle * Math.PI / 180);
        const cosAngle = Math.cos(this.angle * Math.PI / 180);

        // Calculate forces on mass 1
        const F1g = this.mass1 * this.g * sinAngle;
        const F1f = this.friction * this.mass1 * this.g * cosAngle;
        const F1 = F1g - F1f;

        // Calculate forces on mass 2
        const F2g = this.mass2 * this.g * sinAngle;
        const F2f = this.friction * this.mass2 * this.g * cosAngle;
        const F2 = F2g - F2f;

        // Calculate forces on mass 3
        const F3g = this.mass3 * this.g;
        const F3 = F3g;

        // Calculate accelerations
        this.a1 = F1 / this.mass1;
        this.a2 = F2 / this.mass2;
        this.a3 = F3 / this.mass3;
    }

    updatePositions() {
        if (!this.isSimulating) return;

        // Update velocities and positions using Euler's method
        this.v1 += this.a1 * this.dt;
        this.v2 += this.a2 * this.dt;
        this.v3 += this.a3 * this.dt;

        this.x1 += this.v1 * this.dt;
        this.x2 += this.v2 * this.dt;
        this.x3 += this.v3 * this.dt;

        // Check if simulation has reached equilibrium
        const VELOCITY_THRESHOLD = 0.01;
        const ACCELERATION_THRESHOLD = 0.01;

        if (Math.abs(this.v1) < VELOCITY_THRESHOLD && 
            Math.abs(this.v2) < VELOCITY_THRESHOLD && 
            Math.abs(this.v3) < VELOCITY_THRESHOLD && 
            Math.abs(this.a1) < ACCELERATION_THRESHOLD && 
            Math.abs(this.a2) < ACCELERATION_THRESHOLD && 
            Math.abs(this.a3) < ACCELERATION_THRESHOLD) {
            this.isSimulating = false;
        }

        this.draw();
        requestAnimationFrame(() => this.updatePositions());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw masses and ramp
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(100 + this.x1, 200, 20, 20); // Mass 1
        this.ctx.fillRect(300 + this.x2, 200, 20, 20); // Mass 2
        this.ctx.fillRect(500, 200 - this.x3, 20, 20); // Mass 3
        this.ctx.beginPath();
        this.ctx.moveTo(100, 200);
        this.ctx.lineTo(300, 200 - this.angle * Math.PI / 180 * 100);
        this.ctx.stroke();

        // Draw velocity and acceleration graphs
        // ... (implementation omitted for brevity)
    }

    startSimulation() {
        this.isSimulating = true;
        this.calculateForces();
        this.updatePositions();
    }

    resetSimulation() {
        this.isSimulating = false;
        this.x1 = 0;
        this.x2 = 0;
        this .x3 = 0;
        this.v1 = 0;
        this.v2 = 0;
        this.v3 = 0;
        this.a1 = 0;
        this.a2 = 0;
        this.a3 = 0;
        this.draw();
    }
}

const canvas = document.getElementById("canvas");
const simulator = new ModifiedAtwoodSimulator(canvas);

document.getElementById("startBtn").addEventListener("click", () => {
    simulator.startSimulation();
});

document.getElementById("resetBtn").addEventListener("click", () => {
    simulator.resetSimulation();
});

document.getElementById("mass1").addEventListener("input", (e) => {
    simulator.mass1 = parseFloat(e.target.value);
});

document.getElementById("mass2").addEventListener("input", (e) => {
    simulator.mass2 = parseFloat(e.target.value);
});

document.getElementById("mass3").addEventListener("input", (e) => {
    simulator.mass3 = parseFloat(e.target.value);
});

document.getElementById("angle").addEventListener("input", (e) => {
    simulator.angle = parseFloat(e.target.value);
});

document.getElementById("friction").addEventListener("input", (e) => {
    simulator.friction = parseFloat(e.target.value);
});