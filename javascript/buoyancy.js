class BuoyancySimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockMass = 1; // Default mass in kg
        this.blockDensity = 500; // Default density in kg/m^3
        this.fluidDensity = 1000; // Default fluid density in kg/m^3
        this.g = 9.81; // Acceleration due to gravity in m/s^2
        this.waterLevel = canvas.height * 0.7; // Water level (y-coordinate)
        this.blockWidth = 50;
        this.blockHeight = 50;
        this.blockX = (this.canvas.width - this.blockWidth) / 2;
        this.initialBlockY = 150; // Initial Y position
        this.blockY = this.initialBlockY; // Current Y position
        this.velocity = 0; // Initial velocity in m/s
        this.isSimulating = false; // Simulation state
        this.timeStep = 1 / 60; // 60 FPS
        this.pixelsPerMeter = 100; // Scale factor

        this.initializeControls();
        this.draw(); // Initial drawing
    }

    initializeControls() {
        const blockMassInput = document.getElementById('blockMass');
        const blockDensityInput = document.getElementById('blockDensity');
        const fluidDensityInput = document.getElementById('fluidDensity');
        const simulateBtn = document.getElementById('simulateBtn');
        const resetBtn = document.getElementById('resetBtn');

        blockMassInput.addEventListener('input', () => {
            this.blockMass = parseFloat(blockMassInput.value);
        });

        blockDensityInput.addEventListener('input', () => {
            this.blockDensity = parseFloat(blockDensityInput.value);
        });

        fluidDensityInput.addEventListener('input', () => {
            this.fluidDensity = parseFloat(fluidDensityInput.value);
        });

        simulateBtn.addEventListener('click', () => {
            this.startSimulation();
        });

        resetBtn.addEventListener('click', () => {
            this.resetSimulation();
        });
    }

    startSimulation() {
        this.isSimulating = true;
        this.blockY = this.initialBlockY;
        this.velocity = 0;
        this.animate();
    }

    resetSimulation() {
        this.isSimulating = false;
        this.blockY = this.initialBlockY;
        this.velocity = 0;
        this.draw();
        
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        document.getElementById('blockMass').value = '1';
        document.getElementById('blockDensity').value = '500';
        document.getElementById('fluidDensity').value = '1000';

        this.blockMass = 1;
        this.blockDensity = 500;
        this.fluidDensity = 1000;

        document.getElementById('buoyancyInfo').innerHTML = '';
    }

    animate() {
        if (!this.isSimulating) return;

        const volume = this.blockMass / this.blockDensity; // Volume of the block
        const submergedDepth = Math.max(0, this.waterLevel - (this.blockY + this.blockHeight)); // How deep the block is submerged
        const submergedVolume = Math.min(volume, submergedDepth); // Effective volume submerged
        
        const buoyantForce = this.fluidDensity * this.g * submergedVolume; // Buoyant force
        const weight = this.blockMass * this.g; // Weight of the block
        const netForce = buoyantForce - weight; // Net force acting on the block

        // Update velocity and position
        const acceleration = netForce / this.blockMass; // Calculate acceleration
        this.velocity += acceleration * this.timeStep; // Update velocity with acceleration
        this.blockY += this.velocity * this.timeStep * this.pixelsPerMeter; // Update position

        // Damping to simulate water resistance
        this.velocity *= 0.99;

        // Prevent the block from going off-screen
        if (this.blockY < 0) {
            this.blockY = 0; // Keep the block above the canvas
            this.velocity *= -0.5; // Bounce off the top with damping
        } else if (this.blockY + this.blockHeight > this.canvas.height) {
            this.blockY = this.canvas.height - this.blockHeight; // Keep the block within bounds
            this.velocity *= -0.5 ; // Bounce off the bottom with damping
        }

        this.draw();
        this.updateBuoyancyInfo(buoyantForce, weight, netForce);

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw water
        this.ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
        this.ctx.fillRect(0, this.waterLevel, this.canvas.width, this.canvas.height - this.waterLevel);

        // Draw block
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        this.ctx.fillRect(this.blockX, this.blockY, this.blockWidth, this.blockHeight);
    }

    updateBuoyancyInfo(buoyantForce, weight, netForce) {
        const buoyancyInfo = document.getElementById('buoyancyInfo');
        buoyancyInfo.innerHTML = `
            Buoyant Force: ${buoyantForce.toFixed(2)} N<br>
            Weight: ${weight.toFixed(2)} N<br>
            Net Force: ${netForce.toFixed(2)} N<br>
            Block Position: ${((this.waterLevel - this.blockY - this.blockHeight) / this.pixelsPerMeter).toFixed(2)} m relative to water level
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const simulator = new BuoyancySimulator(canvas);
});