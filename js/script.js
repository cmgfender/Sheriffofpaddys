const canvas = document.getElementById('lavaLampCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: null, y: null };

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

class Particle {
    constructor() {
        this.x = randomRange(0, width);
        this.y = randomRange(0, height);
        this.radius = randomRange(20, 60);
        this.dx = randomRange(-1, 1);
        this.dy = randomRange(-1, 1);
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off walls
        if (this.x + this.radius > width || this.x - this.radius < 0) {
            this.dx *= -1;
        }
        if (this.y + this.radius > height || this.y - this.radius < 0) {
            this.dy *= -1;
        }

        // Attract to mouse/touch
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }
    }
}

// Mouse and touch tracking
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    mouse.x = touch.clientX;
    mouse.y = touch.clientY;
});

window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
});

// Resize handler
window.addEventListener('resize', init);

// Animation loop
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Create blob-like effect
    ctx.globalCompositeOperation = 'lighter';

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

// Initialize and start animation
init();
animate();
