class ProjectileLauncher {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isLaunched = false;
        this.projectile = { x: 0, y: 0 };
        this.time = 0;
        this.g = 9.81; 
        this.pixelsPerMeter = 4;
        this.launchHeight = 10;
        this.initializeControls();
        this.draw();
    }

    initializeControls() {
        this.launchHeightInput = document.getElementById('launchHeight');
        this.launchAngleInput = document.getElementById('launchAngle');
        this.launchVelocityInput = document.getElementById('launchVelocity');
        this.launchBtn = document.getElementById('launchBtn');
        this.projectileInfo = document.getElementById('projectileInfo');

        this.launchBtn.addEventListener('click', () => this.launch());
    }

    launch() {
        this.isLaunched = true;
        this.time = 0;
        this.launchHeight = parseFloat(this.launchHeightInput.value);
        this.launchAngle = parseFloat(this.launchAngleInput.value) * Math.PI / 180;
        this.launchVelocity = parseFloat(this.launchVelocityInput.value);
        this.projectile.x = 0;
        this.initialY = this.canvas.height - (this.launchHeight * this.pixelsPerMeter);
        this.projectile.y = this.initialY;
        this.vx = this.launchVelocity * Math.cos(this.launchAngle);
        this.vy = -this.launchVelocity * Math.sin(this.launchAngle);
    
        this.animate();
    }
    
    

    animate() {
        this.time += 0.02;
        this.projectile.x = this.vx * this.time * this.pixelsPerMeter;
        const displacement = this.vy * this.time + 0.5 * this.g * this.time * this.time;
        this.projectile.y = this.initialY + displacement * this.pixelsPerMeter;
    
        this.draw();
    
        if (this.projectile.y <= this.canvas.height) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.isLaunched = false;
            this.updateProjectileInfo();
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, this.canvas.height - 10, this.canvas.width, 10);
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, this.canvas.height - this.launchHeight * this.pixelsPerMeter, 20, this.launchHeight * this.pixelsPerMeter);
        if (this.isLaunched) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.beginPath();
            this.ctx.arc(this.projectile.x, this.projectile.y, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    updateProjectileInfo() {
        const range = this.vx * this.time;
        const maxHeight = this.launchHeight + (this.vy * this.vy) / (2 * this.g);
        const flightTime = this.time;

        this.projectileInfo.innerHTML = `
            <strong>Range:</strong> ${range.toFixed(2)} m<br>
            <strong>Max Height:</strong> ${maxHeight.toFixed(2)} m<br>
            <strong>Flight Time:</strong> ${flightTime.toFixed(2)} s
        `;
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    new ProjectileLauncher(canvas);
});