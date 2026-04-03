// Scroll Reveal Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile Menu Toggle
const toggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (toggle) {
    toggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const spans = toggle.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
        }
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            toggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
        });
    });
}

// Nav background on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(13, 15, 26, 0.95)';
    } else {
        nav.style.background = 'rgba(13, 15, 26, 0.8)';
    }
});

// Contact Form Handler
const form = document.getElementById('contact-form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.7';
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.background = 'var(--accent)';
            btn.textContent = 'Request Sent ✓';
            setTimeout(() => {
                btn.style.background = '';
                btn.textContent = originalText;
                form.reset();
            }, 3000);
        }, 800);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
