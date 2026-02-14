gsap.registerPlugin(ScrollTrigger);

// 1. Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.querySelector('.mode-text').innerText = 
        document.body.classList.contains('light-mode') ? 'DARK' : 'LIGHT';
});

// 2. The Horizontal Fix
const wrapper = document.querySelector(".horizontal-wrapper");
const panels = gsap.utils.toArray(".h-panel");

let scrollTween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
        trigger: ".horizontal-limit",
        pin: true,
        scrub: 1,
        end: () => "+=" + wrapper.offsetWidth,
        invalidateOnRefresh: true
    }
});

// 3. Background Fade
gsap.to(".stars, canvas", {
    opacity: 0,
    scrollTrigger: {
        trigger: ".horizontal-limit",
        start: "top bottom",
        end: "top center",
        scrub: true
    }
});

// 4. Interactive Canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.style.position = 'fixed'; canvas.style.top = '0'; canvas.style.left = '0'; canvas.style.zIndex = '-1';

let particles = [];
const mouse = { x: -1000, y: -1000 };

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = [];
    for(let i=0; i<60; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            baseX: Math.random() * canvas.width,
            baseY: Math.random() * canvas.height,
            density: (Math.random() * 30) + 1
        });
    }
}

window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isLight = document.body.classList.contains('light-mode');
    
    particles.forEach(p => {
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 150) {
            p.x -= dx / 10;
            p.y -= dy / 10;
            ctx.fillStyle = isLight ? "rgba(90, 24, 201, 1)" : "#7a2fff";
        } else {
            p.x += (p.baseX - p.x) * 0.05;
            p.y += (p.baseY - p.y) * 0.05;
            ctx.fillStyle = isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
        }
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
    });
    requestAnimationFrame(animate);
}

init(); animate();
window.addEventListener('resize', init);