class BuoyancySimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockMass = 1; // Default mass
        this.blockDensity = 500; // Default density
        this.fluidDensity = 1000; // Default fluid density
        this.g = 9.81; // Acceleration due to gravity
        this.waterLevel = 300; // Water level (y-coordinate)
        this.blockWidth = 50;
        this.blockHeight = 50;
        this.blockX = (this.canvas.width - this.blockWidth) / 2;
        this.initialBlockY = 0; // Initial Y position
        this.blockY = this.initialBlockY; // Current Y position
        this.velocity = 0; // Initial velocity
        this.isSimulating = false; // Simulation state

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
        this.blockY = this.initialBlockY; // Reset block position
        this.velocity = 0; // Reset velocity
        this.animate(); // Start the animation
    }

    resetSimulation() {
        this.isSimulating = false;
        this.blockY = this.initialBlockY;
        this.velocity = 0;
        this.draw(); // Redraw the scene in its initial state
        
        // Clear any existing animation frame
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        // Reset input fields to default values
        document.getElementById('blockMass').value = '1';
        document.getElementById('blockDensity').value = '500';
        document.getElementById('fluidDensity').value = '1000';

        // Reset internal values
        this.blockMass = 1;
        this.blockDensity = 500;
        this.fluidDensity = 1000;

        // Clear the buoyancy info
        document.getElementById('buoyancyInfo').innerHTML = '';
    }

    animate() {
        if (!this.isSimulating) return;

        // Calculate forces
        const volume = this.blockMass / this.blockDensity;
        const buoyantForce = this.fluidDensity * this.g * volume;
        const weight = this.blockMass * this.g;
        const netForce = buoyantForce - weight;

        // Update velocity and position
        this.velocity += (netForce / this.blockMass) - this.g * 0.016;
        this.blockY += this.velocity;

        // Check if the block has reached the water level
        if (this.blockY + this.blockHeight >= this.waterLevel) {
            this.blockY = this.waterLevel - this.blockHeight;
            this.velocity *= -0.8; // Reverse velocity and apply damping
        }

        // Clear and redraw the scene
        this.draw();

        // Update buoyancy info
        this.updateBuoyancyInfo(buoyantForce, weight, netForce);

        // Request the next animation frame
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    draw() {
        // Clear the canvas
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
            Block Position: ${(this.waterLevel - this.blockY - this.blockHeight).toFixed(2)} pixels above water level
        `;
    }
}

// Wait for the DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const simulator = new BuoyancySimulator(canvas);
});