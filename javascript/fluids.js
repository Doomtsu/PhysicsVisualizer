class FluidSimulator {
    constructor() {
        this.initializeFlowRate();
        this.initializeBernoulli();
        this.initializeViscosity();
        this.initializePascal();
        this.initializeArchimedes();
    }

    initializeFlowRate() {
        const canvas = document.getElementById('flowCanvas');
        this.flowCtx = canvas.getContext('2d');
        
        const pipe1Diameter = document.getElementById('pipe1Diameter');
        const pipe2Diameter = document.getElementById('pipe2Diameter');
        const flowRate = document.getElementById('flowRate');
        const simulateBtn = document.getElementById('simulateFlow');
        
        pipe1Diameter.addEventListener('input', () => {
            document.getElementById('pipe1DiameterValue').textContent = pipe1Diameter.value;
        });

        pipe2Diameter.addEventListener('input', () => {
            document.getElementById('pipe2DiameterValue').textContent = pipe2Diameter.value;
        });

        flowRate.addEventListener('input', () => {
            document.getElementById('flowRateValue').textContent = flowRate.value;
        });

        simulateBtn.addEventListener('click', () => this.animateFlowRate());
    }

    animateFlowRate() {
        const pipe1Diameter = parseFloat(document.getElementById('pipe1Diameter').value);
        const pipe2Diameter = parseFloat(document.getElementById('pipe2Diameter').value);
        const flowRate = parseFloat(document.getElementById('flowRate').value);

        let particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * 200,
                y: 150 - pipe1Diameter * 25 + Math.random() * pipe1Diameter * 50
            });
        }

        const animate = () => {
            this.flowCtx.clearRect(0, 0, 600, 300);
            

            this.flowCtx.fillStyle = '#3498db';
            this.flowCtx.fillRect(0, 150 - pipe1Diameter * 25, 300, pipe1Diameter * 50);
            this.flowCtx.fillRect(300, 150 - pipe2Diameter * 25, 300, pipe2Diameter * 50);


            this.flowCtx.fillStyle = '#e74c3c';
            particles.forEach(particle => {
                this.flowCtx.beginPath();
                this.flowCtx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                this.flowCtx.fill();

                particle.x += flowRate * 2;
                if (particle.x > 300) {
                    const ratio = pipe1Diameter / pipe2Diameter;
                    particle.y = 150 + (particle.y - 150) * ratio;
                }
                if (particle.x > 600) {
                    particle.x = 0;
                    particle.y = 150 - pipe1Diameter * 25 + Math.random() * pipe1Diameter * 50;
                }
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    initializeBernoulli() {
        const canvas = document.getElementById('bernoulliCanvas');
        this.bernoulliCtx = canvas.getContext('2d');
        
        
        const simulateBernoulliBtn = document.getElementById('simulateBernoulli');
        simulateBernoulliBtn.addEventListener('click', () => this.animateBernoulli());
    }

    animateBernoulli() {

        let y = 150;
        let velocity = 2;

        const animate = () => {
            this.bernoulliCtx.clearRect(0, 0, 600, 300);
            

            this.bernoulliCtx.beginPath();
            this.bernoulliCtx.moveTo(0, 100);
            this.bernoulliCtx.lineTo(200, 100);
            this.bernoulliCtx.lineTo(300, 200);
            this.bernoulliCtx.lineTo(400, 100);
            this.bernoulliCtx.lineTo(600, 100);
            this.bernoulliCtx.lineTo(600, 200);
            this.bernoulliCtx.lineTo(0, 200);
            this.bernoulliCtx.closePath();
            this.bernoulliCtx.stroke();


            this.bernoulliCtx.fillStyle = 'rgba(52, 152, 219, 0.5)';
            this.bernoulliCtx.fillRect(0, y, 600, 200 - y);

            y += velocity;
            if (y > 180 || y < 120) velocity = -velocity;

            requestAnimationFrame(animate);
        };

        animate();
    }

    initializeViscosity() {
        const canvas = document.getElementById('viscosityCanvas');
        this.viscosityCtx = canvas.getContext('2d');
        
     
        const simulateViscosityBtn = document.getElementById('simulateViscosity');
        simulateViscosityBtn.addEventListener('click', () => this.animateViscosity());
    }

    animateViscosity() {

        let particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * 600,
                y: Math.random() * 300,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1
            });
        }

        const animate = () => {
            this.viscosityCtx.clearRect(0, 0, 600, 300);
            
            particles.forEach(particle => {
                this.viscosityCtx.beginPath();
                this.viscosityCtx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                this.viscosityCtx.fill();

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > 600) particle.vx = -particle.vx;
                if (particle.y < 0 || particle.y > 300) particle.vy = -particle.vy;
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    initializePascal() {
        const canvas = document.getElementById('pascalCanvas');
        this.pascalCtx = canvas.getContext('2d');
        
      
        const simulatePascalBtn = document.getElementById('simulatePascal');
        simulatePascalBtn.addEventListener('click', () => this.animatePascal());
    }

    animatePascal() {
    
        let pressure = 0;

        const animate = () => {
            this.pascalCtx.clearRect(0, 0, 600, 300);
            
    
            this.pascalCtx.strokeRect(50, 50, 500, 200);


            this.pascalCtx.fillStyle = 'rgba(52, 152, 219, 0.5)';
            this.pascalCtx.fillRect(50, 250 - pressure, 500, pressure);


            this.pascalCtx.fillStyle = '#34495e';
            this.pascalCtx.fillRect(250, 20, 100, 30);

            pressure += 1;
            if (pressure > 200 ) pressure = 0;

            requestAnimationFrame(animate);
        };

        animate();
    }

    initializeArchimedes() {
        const canvas = document.getElementById('archimedesCanvas');
        this.archimedesCtx = canvas.getContext('2d');
        
       
        const simulateArchimedesBtn = document.getElementById('simulateArchimedes');
        simulateArchimedesBtn.addEventListener('click', () => this.animateArchimedes());
    }

    animateArchimedes() {

        let buoyancy = 0;

        const animate = () => {
            this.archimedesCtx.clearRect(0, 0, 600, 300);
            

            this.archimedesCtx.strokeRect(50, 50, 500, 200);


            this.archimedesCtx.fillStyle = 'rgba(52, 152, 219, 0.5)';
            this.archimedesCtx.fillRect(50, 250 - buoyancy, 500, buoyancy);


            this.archimedesCtx.fillStyle = '#34495e';
            this.archimedesCtx.fillRect(250, 150, 50, 50);

            buoyancy += 1;
            if (buoyancy > 150) buoyancy = 0;

            requestAnimationFrame(animate);
        };

        animate();
    }
}

const simulator = new FluidSimulator();