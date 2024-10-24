let mass1, mass2;
let acceleration;
let v1 = 0; // velocity of mass1
let v2 = 0; // velocity of mass2
let g = 9.81; // acceleration due to gravity
let canvas;

function setup() {
    canvas = createCanvas(600, 400);
    canvas.parent('canvas-container');
    noLoop();

    // Get mass values from inputs
    mass1 = document.getElementById('mass1').value;
    mass2 = document.getElementById('mass2').value;

    document.getElementById('start').addEventListener('click', () => {
        mass1 = parseFloat(document.getElementById('mass1').value);
        mass2 = parseFloat(document.getElementById('mass2').value);
        acceleration = calculateAcceleration(mass1, mass2);
        loop();
    });

    document.getElementById('reset').addEventListener('click', resetSimulation);
}

function calculateAcceleration(m1, m2) {
    return (m2 - m1) * g / (m1 + m2);
}

function draw() {
    background(255);
    // Visualize the Atwood machine
    // Add your drawing logic here based on masses and their positions
}

function resetSimulation() {
    v1 = 0;
    v2 = 0;
    noLoop();
}
