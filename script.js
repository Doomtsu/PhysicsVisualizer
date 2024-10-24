const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pulleyRadius = 50;
const mass1X = 100;
const mass2X = 250;
const pulleyY = 100;
const ropeColor = '#000080';
const massColor = '#FFFFFF';

let mass1 = 5; // Default mass 1
let mass2 = 5; // Default mass 2
let position1 = 300; // Initial position of mass 1
let position2 = 300; // Initial position of mass 2
let animationFrame; // To store the animation frame
function drawAtwoodsMachine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw the pulley
    ctx.beginPath();
    ctx.arc(mass1X + (mass2X - mass1X) / 2, pulleyY, pulleyRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#800080';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw the ropes
    ctx.beginPath();
    ctx.moveTo(mass1X, pulleyY); // Connect to the pulley
    ctx.lineTo(mass1X, position1 + 25); // Connect to the bottom of the mass
    ctx.strokeStyle = ropeColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mass2X, pulleyY); // Connect to the pulley
    ctx.lineTo(mass2X, position2 + 25); // Connect to the bottom of the mass
    ctx.strokeStyle = ropeColor;
    ctx.stroke();

    // Draw the masses
    drawMass(mass1X, position1, mass1, 'm1');
    drawMass(mass2X, position2, mass2, 'm2');
}


// Function to draw a mass
function drawMass(x, y, mass, label) {
    ctx.beginPath();
    ctx.rect(x - 25, y - 25, 50, 50);
    ctx.fillStyle = massColor;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center'; // Center the text horizontally
    ctx.textBaseline = 'middle'; // Center the text vertically
    ctx.fillText(label, x, y);
}
// Function to animate the Atwood's machine
function animate() {
    mass1 = parseFloat(document.getElementById('mass1').value);
    mass2 = parseFloat(document.getElementById('mass2').value);
    
    // Reset positions
    position1 = 300;
    position2 = 300;

    // Start the animation loop
    function animationLoop() {
        // Calculate acceleration based on mass difference
        const acceleration = (mass2 - mass1) * 0.1; // Adjust the factor for speed

        // Update positions based on acceleration
        position1 -= acceleration;
        position2 += acceleration;

        // Stop the masses when they reach the pulley level
        if (position1 <= pulleyY - 25) {
            position1 = pulleyY - 25; // Stop at the pulley level
        }
        if (position2 <= pulleyY - 25) {
            position2 = pulleyY - 25; // Stop at the pulley level
        }

        drawAtwoodsMachine();
        animationFrame = requestAnimationFrame(animationLoop);
    }

    animationLoop(); // Start the animation loop
}
// Event listener for the animate button
document.getElementById('animate').addEventListener('click', animate);