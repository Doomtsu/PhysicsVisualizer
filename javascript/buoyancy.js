class BuoyancySimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockMass = 1;
        this.blockDensity = 500;
        this.fluidDensity = 1000; 
        this.g = 9.81; 
        this.waterLevel = canvas.height * 0.7; 
        this.blockWidth = 50;
        this.blockHeight = 50;
        this.blockX = (this.canvas.width - this.blockWidth) / 2;
        this.initialBlockY = 150; 
        this.blockY = this.initialBlockY; 
        this.velocity = 0;
        this.isSimulating = false; 
        this.timeStep = 1 / 60; 
        this.pixelsPerMeter = 100; 

        this.initializeControls();
        this.draw(); 
        this.dampingCoefficient = 0.5; 
        this.velocity = 0;
        this.acceleration = 0;
        this.dt = 0.016; 
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

        const volume = this.blockMass / this.blockDensity; 
        const submergedDepth = Math.max(0, this.waterLevel - (this.blockY + this.blockHeight)); 
        const submergedVolume = Math.min(volume, submergedDepth); 
        
        const buoyantForce = this.fluidDensity * this.g * submergedVolume; 
        const weight = this.blockMass * this.g; 
        const netForce = buoyantForce - weight;


        const acceleration = netForce / this.blockMass; 
        this.velocity += acceleration * this.timeStep; 
        this.blockY += this.velocity * this.timeStep * this.pixelsPerMeter; 
        this.velocity *= 0.99;

        if (this.blockY < 0) {
            this.blockY = 0; 
            this.velocity *= -0.5; 
        } else if (this.blockY + this.blockHeight > this.canvas.height) {
            this.blockY = this.canvas.height - this.blockHeight; 
            this.velocity *= -0.5 ; 
        }

        this.draw();
        this.updateBuoyancyInfo(buoyantForce, weight, netForce);

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
        this.ctx.fillRect(0, this.waterLevel, this.canvas.width, this.canvas.height - this.waterLevel);
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