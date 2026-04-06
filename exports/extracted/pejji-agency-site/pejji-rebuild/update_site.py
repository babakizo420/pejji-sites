import os

with open('index.html', 'r') as f:
    html = f.read()

replacements = {
    '<div class="feature-icon teal">🔒</div>': '<div class="feature-icon teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:28px; height:28px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>',
    '<div class="feature-icon orange">⚡</div>': '<div class="feature-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:28px; height:28px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>',
    '<div class="feature-icon purple">📊</div>': '<div class="feature-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:28px; height:28px;"><path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20v-6"></path></svg></div>',
    '<div class="feature-icon teal">💬</div>': '<div class="feature-icon teal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:28px; height:28px;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>',
    '<h3>Launch Day 🚀</h3>': '<h3>Launch Day <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.2em; height:1.2em; vertical-align:middle; display:inline-block;"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg></h3>',
    '🔥 Limited slots': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.2em; height:1.2em; vertical-align:middle; display:inline-block; color:var(--orange);"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg> Limited slots'
}

for src, tgt in replacements.items():
    html = html.replace(src, tgt)

quiz_html = """
  <--bun Pricing Quiz Section -->
  <section class="section" id="quiz" style="background: var(--bg-secondary);">
    <div class="container">
      <div class="quiz-box reveal" id="quiz-container">
        <div class="quiz-header" style="text-align: center; margin-bottom: 32px;">
          <span class="section-label" style="justify-content: center;">Website Quiz</span>
          <h2 class="section-title">Not sure which tier you need?</h2>
          <p class="section-subtitle" style="margin: 0 auto;">Take our 30-second quiz to find the perfect fit for your business goals.</p>
        </div>
        <div class="quiz-body" id="quiz-question" style="text-align: center; transition: opacity 0.3s ease;">
          <h3 id="q-text" style="font-size: 1.5rem; margin-bottom: 24px;">What is the primary goal of your new website?</h3>
          <div class="quiz-options" id="q-options" style="display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto;">
            <button class="btn btn-outline quiz-opt" style="width: 100%; justify-content: center;" onclick="nextQ(1)">Just an online business card</button>
            <button class="btn btn-outline quiz-opt" style="width: 100%; justify-content: center;" onclick="nextQ(2)">Get leads & professional email</button>
            <button class="btn btn-outline quiz-opt" style="width: 100%; justify-content: center;" onclick="nextQ(3)">Take bookings / appointments</button>
            <button class="btn btn-outline quiz-opt" style="width: 100%; justify-content: center;" onclick="nextQ(4)">Sell products online (Ecommerce)</button>
          </div>
        </div>
        <div class="quiz-result" id="quiz-result" style="display: none; text-align: center; transition: opacity 0.3s ease;">
          <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Your Recommended Tier: <span id="r-tier" class="gradient-text">Growth</span></h3>
          <p id="r-desc" style="color: var(--text-secondary); margin-bottom: 24px;">Perfect for taking bookings and managing customers.</p>
          <a href="#pricing" class="btn btn-primary">View Pricing Details</a>
          <button class="btn btn-outline" style="margin-left: 12px;" onclick="resetQuiz()">Retake Quiz</button>
        </div>
      </div>
    </div>
  </section>
"""

referral_html = """
  <--bun Referral Program Section -->
  <section class="section" id="referral">
    <div class="container">
      <div class="referral-grid reveal">
        <div class="referral-content">
          <span class="section-label">Partner Program</span>
          <h2 class="section-title">Earn <span class="gradient-text">₦30,000+</span> Per Referral</h2>
          <p class="section-subtitle" style="max-width: 100%; margin-bottom: 24px;">Know a business that needs a website? Refer them to Pejji and earn cash or agency credit when they launch. No limits on how much you can earn.</p>
          <ul class="price-features" style="margin-bottom: 32px;">
            <li><span class="check teal" style="color:var(--teal); font-weight:bold;">✓</span> Get ₦10k for Starter tier referrals</li>
            <li><span class="check teal" style="color:var(--teal); font-weight:bold;">✓</span> Get ₦30k for Growth tier referrals</li>
            <li><span class="check teal" style="color:var(--teal); font-weight:bold;">✓</span> Get ₦50k for Pro tier referrals</li>
          </ul>
          <a href="https://wa.me/2349044526924?text=Hi%20Pejji!%20I%20want%20to%20join%20the%20referral%20program." class="btn btn-primary" target="_blank" rel="noopener">Join Partner Program →</a>
        </div>
        <div class="referral-visual">
          <div class="ref-card">
            <div class="ref-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:40px; height:40px; color:var(--teal);"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
            <h4>Active Partners</h4>
            <div class="ref-number gradient-text" style="font-family: var(--font-heading); font-size: 3rem; font-weight: 700;">142</div>
            <p style="color: var(--text-secondary);">businesses growing with us</p>
          </div>
        </div>
      </div>
    </div>
  </section>
"""

html = html.replace('<!-- Pricing Section -->', quiz_html + '\n  <!-- Pricing Section -->')
html = html.replace('<!-- CTA Section -->', referral_html + '\n  <!-- CTA Section -->')

with open('index.html', 'w') as f:
    f.write(html)

css_append = """
/* --- Quiz Section --- */
.quiz-box {
  background: var(--bg-card);
  border: 1px solid var(--bg-glass-border);
  border-radius: var(--radius-xl);
  padding: 60px 48px;
  max-width: 800px;
  margin: 0 auto;
}

/* --- Referral Section --- */
.referral-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  background: linear-gradient(135deg, rgba(0, 229, 199, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
  border: 1px solid var(--bg-glass-border);
  border-radius: var(--radius-xl);
  padding: 60px 48px;
}

.ref-card {
  background: var(--bg-card);
  border: 1px solid var(--bg-glass-border);
  border-radius: var(--radius-lg);
  padding: 48px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  transform: rotate(2deg);
  transition: transform var(--transition-med);
}

.ref-card:hover {
  transform: rotate(0deg) translateY(-10px);
}

.ref-icon {
  width: 80px;
  height: 80px;
  background: var(--teal-glow);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

@media (max-width: 1024px) {
  .referral-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 48px 24px;
  }
}
"""

with open('styles.css', 'a') as f:
    f.write(css_append)

js_append = """
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
"""

with open('script.js', 'a') as f:
    f.write(js_append)

