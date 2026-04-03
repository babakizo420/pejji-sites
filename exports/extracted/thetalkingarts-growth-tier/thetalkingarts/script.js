// Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Cursor Glow (desktop only)
const glow = document.getElementById('cursor-glow');
if (glow && window.innerWidth > 900) {
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu
const toggle = document.getElementById('nav-toggle');
const mobMenu = document.getElementById('mob-menu');
if (toggle) {
    toggle.addEventListener('click', () => {
        mobMenu.classList.toggle('active');
        const spans = toggle.querySelectorAll('span');
        if (mobMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.transform = 'rotate(-45deg) translate(2px, -2px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.transform = '';
        }
    });
    mobMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            mobMenu.classList.remove('active');
            toggle.querySelectorAll('span').forEach(s => s.style.transform = '');
        });
    });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Contact form
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const orig = btn.textContent;
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.7';
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.textContent = 'Request Sent ✓';
            setTimeout(() => { btn.textContent = orig; form.reset(); }, 3000);
        }, 800);
    });
}
