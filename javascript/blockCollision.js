let canvas, ctx;
let block1, block2;
let animationId;
let isElastic = true; 

class Block {
    constructor(mass, velocity, x, color) {
        this.mass = mass;
        this.velocity = velocity;
        this.x = x;
        this.y = 200;
        this.width = 50;
        this.height = 50;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "white";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText(`${this.mass}kg`, this.x + this.width/2, this.y + this.height/2);
    }

    update() {
        this.x += this.velocity;
        if (this.x <= 0) {
            this.x = 0;
            this.velocity = -this.velocity; 
        }
        if (this.x + this.width >= canvas.width) {
            this.x = canvas.width - this.width;
            this.velocity = -this.velocity; 
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    const simulateBtn = document.getElementById("simulateBtn");
    simulateBtn.addEventListener("click", startSimulation);

    initializeBlocks();

    drawBlocks();

 
    document.getElementById("mass1").addEventListener("input", updateBlockProperties);
    document.getElementById("velocity1").addEventListener("input", updateBlockProperties);
    document.getElementById("mass2").addEventListener("input", updateBlockProperties);
    document.getElementById("velocity2").addEventListener("input", updateBlockProperties);
});

function initializeBlocks() {
    const mass1 = parseFloat(document.getElementById("mass1").value);
    const velocity1 = parseFloat(document.getElementById("velocity1").value);
    const mass2 = parseFloat(document.getElementById("mass2").value);
    const velocity2 = parseFloat(document.getElementById("velocity2").value);

   
    const leftPosition = canvas.width * 0.2; 
    const rightPosition = canvas.width * 0.6; 

    block1 = new Block(mass1, 0, leftPosition, "red");
    block2 = new Block(mass2, 0, rightPosition, "blue");

    updateCollisionInfo();
}

function drawBlocks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.moveTo(0, block1.y + block1.height + 10);
    ctx.lineTo(canvas.width, block1.y + block1.height + 10);
    ctx.stroke();

    block1.draw();
    block2.draw();
}

function updateBlockProperties() {
    block1.mass = parseFloat(document.getElementById("mass1").value);
    block1.velocity = 0;
    block2.mass = parseFloat(document.getElementById("mass2").value);
    block2.velocity = 0;


    const baseSize = 50;
    const maxSize = 80;
    const minSize = 30;
    
    block1.width = block1.height = Math.min(Math.max(baseSize * Math.sqrt(block1.mass/5), minSize), maxSize);
    block2.width = block2.height = Math.min(Math.max(baseSize * Math.sqrt(block2.mass/5), minSize), maxSize);

    drawBlocks();
    updateCollisionInfo();
}

function startSimulation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }


    block1.x = canvas.width * 0.2;
    block2.x = canvas.width * 0.6;

    block1.velocity = parseFloat(document.getElementById("velocity1").value);
    block2.velocity = parseFloat(document.getElementById("velocity2").value);

    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.moveTo(0, block1.y + block1.height + 10);
    ctx.lineTo(canvas.width, block1.y + block1.height + 10);
    ctx.stroke();

    block1.update();
    block2.update();

    if (checkCollision()) {
        handleCollision();
    }

    block1.draw();
    block2.draw();

    updateCollisionInfo();

    animationId = requestAnimationFrame(animate);
}

function checkCollision() {
    return (
        block1.x < block2.x + block2.width &&
        block1.x + block1.width > block2.x
    );
}

function handleCollision() {
    const v1 = block1.velocity;
    const v2 = block2.velocity;
    const m1 = block1.mass;
    const m2 = block2.mass;

    block1.velocity = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
    block2.velocity = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
    const overlap = (block1.x + block1.width) - block2.x;
    block1.x -= overlap / 2;
    block2.x += overlap / 2;
}

function updateCollisionInfo() {
    const collisionInfo = document.getElementById("collisionInfo");
    const totalKineticEnergy = 0.5 * block1.mass * block1.velocity * block1.velocity + 
                              0.5 * block2.mass * block2.velocity * block2.velocity;
    
    collisionInfo.innerHTML = `
        <h5>Block Information:</h5>
        <p>Block 1: Mass = ${block1.mass.toFixed(2)} kg, Velocity = ${block1.velocity.toFixed(2)} m/s</p>
        <p>Block 2: Mass = ${block2.mass.toFixed(2)} kg, Velocity = ${block2.velocity.toFixed(2)} m/s</p>
        <p>Total Kinetic Energy: ${totalKineticEnergy.toFixed(2)} J</p>
    `;
}