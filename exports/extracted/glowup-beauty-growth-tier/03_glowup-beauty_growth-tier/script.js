// Custom Cursor
const cursor = document.querySelector('.cursor-glow');
if (window.innerWidth > 900) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .day.available, .s-card, .logo, .cal-nav').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
}

// Parallax Hero
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset;
    if (scroll < window.innerHeight) {
        heroBg.style.transform = `translateY(${scroll * 0.3}px) scale(${1 + scroll * 0.0002})`;
    }
});

// Cinematic Reveal Animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============================
// Dynamic Calendar
// ============================
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let calYear, calMonth; // 0-indexed month

function initCalendar() {
    const now = new Date();
    calYear = now.getFullYear();
    calMonth = now.getMonth();
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('cal-month-label');
    if (!grid || !label) return;

    label.textContent = `${MONTH_NAMES[calMonth]} ${calYear}`;

    const today = new Date();
    today.setHours(0,0,0,0);

    const firstDay = new Date(calYear, calMonth, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    // Pick a few "available" days: every 3rd day starting from today+2 (up to 5 slots)
    const availableDays = new Set();
    for (let i = 2; i <= daysInMonth; i += 3) {
        const d = new Date(calYear, calMonth, i);
        if (d >= today && availableDays.size < 5) {
            availableDays.add(i);
        }
    }

    let html = '';
    // Day name headers
    ['S','M','T','W','T','F','S'].forEach(n => {
        html += `<div class="day-name">${n}</div>`;
    });
    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        html += '<div></div>';
    }
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(calYear, calMonth, d);
        date.setHours(0,0,0,0);
        let cls = 'day';
        if (date < today) cls += ' past';
        if (availableDays.has(d)) cls += ' available';
        html += `<div class="${cls}">${d}</div>`;
    }

    grid.innerHTML = html;
    bindDayClicks();
}

function bindDayClicks() {
    const timeSlots = document.getElementById('time-slots');
    const selectedDateSpan = document.getElementById('selected-date');
    const days = document.querySelectorAll('.day.available');

    days.forEach(day => {
        day.addEventListener('click', () => {
            // Reset all available day styles
            document.querySelectorAll('.day.available').forEach(d => {
                d.style.boxShadow = '';
                d.style.background = '';
                d.style.color = '';
            });

            day.style.boxShadow = '0 0 0 2px var(--bg), 0 0 0 4px var(--accent)';
            day.style.background = '#fff';
            day.style.color = 'var(--bg)';
            selectedDateSpan.textContent = `${MONTH_NAMES[calMonth].slice(0,3)} ${day.textContent}`;
            timeSlots.style.display = 'block';

            setTimeout(() => {
                timeSlots.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });
    });

    // Re-attach cursor hover for new day elements
    if (window.innerWidth > 900) {
        document.querySelectorAll('.day.available').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }
}

// Calendar navigation
document.getElementById('cal-prev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
});

initCalendar();

// Set initial selected-date to today's date dynamically
const _now = new Date();
const _sel = document.getElementById('selected-date');
if (_sel) _sel.textContent = MONTH_NAMES[_now.getMonth()].slice(0,3) + ' ' + _now.getDate();

// Time slot selection & confirm
const tBtns = document.querySelectorAll('.t-btn');
const confirmBtn = document.querySelector('.complete-btn');

tBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        confirmBtn.textContent = `Confirm for ${btn.textContent}`;
    });
});

confirmBtn.addEventListener('click', () => {
    if(confirmBtn.textContent !== 'Confirm Reservation' && !confirmBtn.textContent.includes('Secured')) {
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = 'Processing...';
        confirmBtn.style.opacity = '0.7';

        setTimeout(() => {
            confirmBtn.style.opacity = '1';
            confirmBtn.style.background = '#E0A96D';
            confirmBtn.style.color = '#0B0A0A';
            confirmBtn.textContent = 'Reservation Secured ✓';
        }, 1200);
    }
});

// ============================
// Fullscreen Menu Logic
// ============================
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const fsMenu = document.getElementById('fs-menu');
const menuLinks = document.querySelectorAll('.menu-link');

if(menuBtn) {
    menuBtn.addEventListener('click', () => {
        fsMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        fsMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            fsMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Add custom cursor hover to menu elements
    if (window.innerWidth > 900) {
        document.querySelectorAll('.menu-link, .close-btn, .menu-btn, .m-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if(targetId === '#') { e.preventDefault(); return; }

        // Handle #top specially - scroll to very top
        if(targetId === '#top') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        // Ensure menu closes if open
        if(fsMenu && fsMenu.classList.contains('active')) {
            fsMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// ============================
// Contact Form Handler
// ============================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = this.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.7';
        setTimeout(() => {
            btn.style.opacity = '1';
            btn.style.background = '#E0A96D';
            btn.style.color = '#0B0A0A';
            btn.textContent = 'Message Sent ✓';
        }, 800);
    });
}

// ============================
// Newsletter Subscribe Handler
// ============================
const newsletterBtn = document.getElementById('newsletter-btn');
if (newsletterBtn) {
    newsletterBtn.addEventListener('click', function() {
        const group = document.getElementById('newsletter-group');
        const input = group.querySelector('input');
        if (input && input.value.includes('@')) {
            group.innerHTML = '<span style="color: var(--accent); font-size: 1rem; letter-spacing: 1px;">Subscribed!</span>';
        } else {
            input.style.borderBottomColor = '#ff4444';
            input.setAttribute('placeholder', 'Enter a valid email');
            setTimeout(() => {
                input.style.borderBottomColor = '';
                input.setAttribute('placeholder', 'Email Address');
            }, 2000);
        }
    });
}
