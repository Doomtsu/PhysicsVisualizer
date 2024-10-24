const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Define the dimensions of the pulley
const pulleyRadius = 50;

// Define the positions of the masses
const mass1X = 100;
const mass1Y = 300;
const mass2X = 250;
const mass2Y = 300;

// Define the colors
const pulleyColor = '#800080';
const ropeColor = '#000080';
const massColor = '#FFFFFF';

// Draw the pulley
ctx.beginPath();
ctx.arc(mass1X + (mass2X - mass1X) / 2, 100, pulleyRadius, 0, 2 * Math.PI);
ctx.fillStyle = pulleyColor;
ctx.fill();
ctx.strokeStyle = 'black';
ctx.stroke();

// Draw the rope
ctx.beginPath();
ctx.moveTo(mass1X, mass1Y);
ctx.lineTo(mass1X, 100);
ctx.strokeStyle = ropeColor;
ctx.stroke();

ctx.beginPath();
ctx.moveTo(mass2X, mass2Y);
ctx.lineTo(mass2X, 100);
ctx.strokeStyle = ropeColor;
ctx.stroke();

// Draw the masses
ctx.beginPath();
ctx.rect(mass1X - 25, mass1Y - 25, 50, 50);
ctx.fillStyle = massColor;
ctx.fill();
ctx.strokeStyle = 'black';
ctx.stroke();
ctx.font = 'bold 24px sans-serif';
ctx.fillText('m1', mass1X - 10, mass1Y + 5);

ctx.beginPath();
ctx.rect(mass2X - 25, mass2Y - 25, 50, 50);
ctx.fillStyle = massColor;
ctx.fill();
ctx.strokeStyle = 'black';
ctx.stroke();
ctx.font = 'bold 24px sans-serif';
ctx.fillText('m2', mass2X - 10, mass2Y + 5);

// Draw the arrows
ctx.beginPath