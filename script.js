window.addEventListener("load", function() {
        document.getElementById("preloader").style.display = "none";
});


// 1. Get the canvas from the HTML and its "drawing tool"
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

// 2. Settings you can change
const PARTICLE_COUNT = 80;   // how many dots
const LINK_DISTANCE = 120;   // max distance (px) for a line between two dots
const MOUSE_DISTANCE = 160;  // max distance (px) for a line from a dot to the mouse
const COLOR = "184, 255, 0"; // same lime (#b8ff00) in R, G, B

// 3. Data
let particles = [];
const mouse = { x: null, y: null };

// 4. canvas the same size as the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// 5. Create one dot with a random position, speed and size
function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 2 + 1
    };
}

// 6. Start everything: size the canvas, then fill the array with dots
function init() {
    resizeCanvas();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
    }
}

// 7. Draw a line between two points, fading out as the distance grows
function drawLine(x1, y1, x2, y2, distance, maxDistance) {
    const opacity = (1 - distance / maxDistance) * 0.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "rgba(" + COLOR + ", " + opacity + ")";
    ctx.lineWidth = 1;
    ctx.stroke();
}

// 8. The animation loop: runs about 60 times per second
function animate() {
    // wipe the previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // move the dot
        p.x += p.vx;
        p.y += p.vy;

        // bounce off the edges of the screen
        if (p.x < 0 || p.x > canvas.width) {
            p.vx = -p.vx;
        }
        if (p.y < 0 || p.y > canvas.height) {
            p.vy = -p.vy;
        }

        // draw the dot as a tiny filled circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgb(" + COLOR + ")";
        ctx.fill();

        // connect to every OTHER dot that is close enough
        for (let j = i + 1; j < particles.length; j++) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < LINK_DISTANCE) {
                drawLine(p.x, p.y, q.x, q.y, distance, LINK_DISTANCE);
            }
        }

        // connect to the mouse if it is close enough
        if (mouse.x !== null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MOUSE_DISTANCE) {
                drawLine(p.x, p.y, mouse.x, mouse.y, distance, MOUSE_DISTANCE);
            }
        }
    }

    // ask the browser to run animate() again before the next screen refresh
    requestAnimationFrame(animate);
}

// 9. Events
window.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("mouseout", function () {
    mouse.x = null;
    mouse.y = null;
});

window.addEventListener("resize", init);

// 10. Go!
init();
animate();