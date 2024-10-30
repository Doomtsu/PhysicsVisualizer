class SpringOscillator {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isRunning = false;
        this.time = 0;
        
        // Physics parameters
        this.mass = 1; // kg
        this.springConstant = 10; // N/m
        this.initialDisplacement = 1; // m
        this.currentDisplacement = 0;
        
        // Animation parameters
        this.pixelsPerMeter = 50; // Reduced scale factor for visualization
        this.springBaseY = 50; // Position of the ceiling mount
        this.springBaseX = canvas.width / 2; // Center horizontally
        this.equilibriumPosition = canvas.height / 3; // Moved up to allow more space for oscillation
        this.maxDisplacement = 5;
        
        // Bind the animation method
        this.animate = this.animate.bind(this);
        
        // Initialize controls
        this.initializeControls();
    }

    initializeControls() {
        // Get DOM elements
        this.massInput = document.getElementById('massInput');
        this.springConstantInput = document.getElementById('springConstantInput');
        this.initialDisplacementInput = document.getElementById('initialDisplacementInput');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.oscillationInfo = document.getElementById('oscillationInfo');

        // Add event listeners
        this.startBtn.addEventListener('click', () => this.toggleSimulation());
        this.resetBtn.addEventListener('click', () => this.resetSimulation());
        
        // Update parameters when inputs change
        this.massInput.addEventListener('change', () => {
            this.mass = parseFloat(this.massInput.value);
            this.updateOscillationInfo();
        });
        this.springConstantInput.addEventListener('change', () => {
            this.springConstant = parseFloat(this.springConstantInput.value);
            this.updateOscillationInfo();
        });
        this.initialDisplacementInput.addEventListener('change', () => {
            this.initialDisplacement = Math.min(Math.max(parseFloat(this.initialDisplacementInput.value), -this.maxDisplacement), this.maxDisplacement);
            this.initialDisplacementInput.value = this.initialDisplacement; // Update input to clamped value
            if (!this.isRunning) {
                this.currentDisplacement = this.initialDisplacement;
                this.draw();
            }
        });

        // Initial draw
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
            <strong>Oscillation Information:</strong><br>
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
        this.time += 0.016; // Approximately 60 FPS

        requestAnimationFrame(this.animate);
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ceiling mount
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(this.springBaseX - 40, 0, 80, this.springBaseY);

        // Calculate spring properties
        const displacement = Math.min(Math.max(this.currentDisplacement, -this.maxDisplacement), this.maxDisplacement);
        const springEndY = this.equilibriumPosition + (displacement * this.pixelsPerMeter);
        const numCoils = 20;
        const springAmplitude = 20; // Width of the spring coils

        // Draw spring
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

        // Draw mass (bob) with a smaller scaling factor
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

        // Draw equilibrium line (dashed)
        this.ctx.beginPath();
        this.ctx.setLineDash([5, 5]);
        this.ctx.moveTo(this.springBaseX - 50, this.equilibriumPosition);
        this.ctx.lineTo(this.springBaseX + 50, this.equilibriumPosition);
        this.ctx.strokeStyle = '#999';
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset to solid line
    }
}

// Initialize the simulator when the window loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 400;
    new SpringOscillator(canvas);
});