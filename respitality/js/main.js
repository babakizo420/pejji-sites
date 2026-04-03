document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Fade up animations using Intersection Observer
    const fadeElements = document.querySelectorAll('.fade-up');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.15 });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        fadeElements.forEach(el => el.classList.add('visible'));
    }

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('mobile-open');
            mobileMenuBtn.textContent = isOpen ? '✕' : '☰';
        });
    }

    // 4. Cookie Consent
    const cookieBanner = document.getElementById('cookieConsent');
    if (cookieBanner) {
        if (document.cookie.indexOf('cookie_consent=accepted') !== -1) {
            cookieBanner.classList.add('hidden');
        }
    }
});

// Cookie consent accept function (global scope for onclick)
function acceptCookies() {
    document.cookie = 'cookie_consent=accepted; path=/; max-age=' + (365 * 24 * 60 * 60) + '; SameSite=Lax';
    var banner = document.getElementById('cookieConsent');
    if (banner) {
        banner.classList.add('hidden');
    }
}
