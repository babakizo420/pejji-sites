// Dynamic Network Background (Particle nodes)
const canvas = document.getElementById('particle-net');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = window.innerWidth < 900 ? 40 : 100;

for(let i=0; i<particleCount; i++){
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
    });
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    
    for(let i=0; i<particleCount; i++){
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect lines
        for(let j=i+1; j<particleCount; j++){
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if(dist < 150) {
                ctx.globalAlpha = 1 - (dist / 150);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Interactive Tracking Mockup
const trackForm = document.getElementById('track-form');
const trackInput = document.getElementById('tracking-id');
const tbText = document.querySelector('.tb-text');
const tbLoader = document.querySelector('.tb-loader');
const trackResult = document.getElementById('tracking-result');

if(trackForm) {
    trackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide result to reset
        trackResult.style.display = 'none';
        
        // Show loading state
        tbText.style.display = 'none';
        tbLoader.style.display = 'block';
        
        setTimeout(() => {
            tbLoader.style.display = 'none';
            tbText.style.display = 'block';
            tbText.textContent = 'Track Updated';
            
            // Re-trigger layout explicitly
            trackResult.style.display = 'block';
            
            // Reset route animations
            const trLine = document.querySelector('.tr-line');
            const trPin = document.querySelector('.tr-rider-pin');
            if(trLine && trPin){
                trLine.style.animation = 'none';
                trPin.style.animation = 'none';
                trLine.offsetHeight; /* trigger reflow */
                trLine.style.animation = 'drawLine 2s 0.2s cubic-bezier(0.19, 1, 0.22, 1) forwards';
                trPin.style.animation = 'movePin 2s 0.2s cubic-bezier(0.19, 1, 0.22, 1) forwards';
            }
        }, 1200);
    });
}

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// Reveal animations on load
setTimeout(() => {
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
}, 100);

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Secure Form Logic
const form = document.getElementById('pickup-form');
const submitBtn = document.querySelector('.submit-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const successMsg = document.getElementById('success-msg');

if(form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        submitBtn.style.pointerEvents = 'none';
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        
        setTimeout(() => {
            Array.from(form.children).forEach(child => {
                if(!child.classList.contains('success-message')) {
                    child.style.display = 'none';
                }
            });
            successMsg.style.display = 'block';
            
            const checkIcon = document.querySelector('.check-icon');
            checkIcon.style.transform = 'scale(0.5)';
            checkIcon.style.opacity = '0';
            setTimeout(() => {
                checkIcon.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                checkIcon.style.transform = 'scale(1)';
                checkIcon.style.opacity = '1';
            }, 50);            
        }, 1500);
    });
}
