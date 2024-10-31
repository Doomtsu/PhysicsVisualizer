class BuoyancySimulator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blockMass = 1;
        this.blockDensity = 500;
        this.fluidDensity = 1000;
        this.g = 9.81;
        this.initializeControls();
        this.draw ();
    }

    initializeControls() {
        const blockMassInput = document.getElementById('blockMass');
        const blockDensityInput = document.getElementById('blockDensity');
        const fluidDensityInput = document.getElementById('fluidDensity');
        const simulateBtn = document.getElementById('simulateBtn');

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
            this.simulate();
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.fillRect(100, 100, 50, 50);
        this.ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        this.ctx.fillRect(0, 200, this.canvas.width, 200);
    }

    simulate() {
        const buoyantForce = this.fluidDensity * this.g * (this.blockMass / this.blockDensity);
        const weight = this.blockMass * this.g;
        const netForce = buoyantForce - weight;
        const buoyancyInfo = document.getElementById('buoyancyInfo');
        buoyancyInfo.innerHTML = `Buoyant Force: ${buoyantForce.toFixed(2)} N<br>Weight: ${weight.toFixed(2)} N<br>Net Force: ${netForce.toFixed(2)} N`;
    }
}

const canvas = document.getElementById('canvas');
const simulator = new BuoyancySimulator(canvas);