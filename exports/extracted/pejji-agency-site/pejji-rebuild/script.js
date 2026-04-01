// --- Navigation & Scroll Effects ---
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinksAnchors = navLinks.querySelectorAll('a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.add('scrolled'); // keep transparent style on load, but wait i'll just make it blurred immediately or after 50px
    navbar.classList.remove('scrolled');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    }
  }
});

// Run once on load
if (window.scrollY > 50) {
  navbar.classList.add('scrolled');
}

// Mobile Menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinksAnchors.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Active Link Highlighting
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navLinksAnchors.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// --- Scroll Reveal Animations ---
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: stop observing once revealed
      // observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealObserver.observe(el);
});

// --- Number Counters ---
const statNumbers = document.querySelectorAll('.stat-number');
let hasCounted = false;

const counterOptions = {
  threshold: 0.5
};

const countUp = (el) => {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 2000; // ms
  const step = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 16);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !hasCounted) {
      statNumbers.forEach(num => countUp(num));
      hasCounted = true; // only count once
    }
  });
}, counterOptions);

const statsSection = document.getElementById('stats');
if (statsSection) {
  counterObserver.observe(statsSection);
}

// --- Particle Background ---
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let w, h;

const resize = () => {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
};

window.addEventListener('resize', resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    
    // Pick a random theme color (teal, purple, orange)
    const colors = ['rgba(0, 229, 199, ', 'rgba(139, 92, 246, ', 'rgba(255, 107, 53, '];
    this.colorBase = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > w) this.x = 0;
    if (this.x < 0) this.x = w;
    if (this.y > h) this.y = 0;
    if (this.y < 0) this.y = h;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `${this.colorBase}${this.opacity})`;
    ctx.fill();
  }
}

const initParticles = () => {
  particles = [];
  const numParticles = Math.min(window.innerWidth / 10, 100); // Responsive particle count
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
};

const animateParticles = () => {
  ctx.clearRect(0, 0, w, h);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw lines between close particles
  particles.forEach((p1, i) => {
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j];
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        // Use p1's color base
        const opacity = 0.15 * (1 - distance / 120);
        ctx.strokeStyle = `${p1.colorBase}${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(animateParticles);
};

initParticles();
animateParticles();

// --- Quiz Logic ---
function nextQ(answer) {
  const resultDiv = document.getElementById('quiz-result');
  const qDiv = document.getElementById('quiz-question');
  const rTier = document.getElementById('r-tier');
  const rDesc = document.getElementById('r-desc');
  
  qDiv.style.opacity = '0';
  setTimeout(() => {
    qDiv.style.display = 'none';
    resultDiv.style.display = 'block';
    
    // Simulate thinking
    rTier.textContent = '...';
    rDesc.textContent = 'Analyzing your business needs...';
    
    setTimeout(() => {
      if (answer === 1) {
        rTier.textContent = 'Card';
        rDesc.textContent = 'The perfect digital business card for ₦60,000.';
      } else if (answer === 2) {
        rTier.textContent = 'Starter';
        rDesc.textContent = 'A professional landing page for leads for ₦150,000.';
      } else if (answer === 3) {
        rTier.textContent = 'Growth';
        rDesc.textContent = 'Our most popular tier. Perfect for taking bookings for ₦350,000.';
      } else {
        rTier.textContent = 'Pro';
        rDesc.textContent = 'A full ecommerce store to sell your products for ₦800,000.';
      }
    }, 800);
  }, 300);
}

function resetQuiz() {
  const resultDiv = document.getElementById('quiz-result');
  const qDiv = document.getElementById('quiz-question');
  
  resultDiv.style.display = 'none';
  qDiv.style.display = 'block';
  setTimeout(() => {
    qDiv.style.opacity = '1';
  }, 50);
}

// --- Back to Top Logic ---
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
