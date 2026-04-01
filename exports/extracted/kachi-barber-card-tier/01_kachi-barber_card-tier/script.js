// 10x Premium Magnetic & 3D Tilt Physics

// 1. 3D Tilt Effect on Bento Cards
const cards = document.querySelectorAll('.bento-item');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate tilt (limit to 5 degrees)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.zIndex = '10';
  });

  card.addEventListener('mouseleave', () => {
    // Reset properties gently
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.zIndex = '1';
  });
});

// 2. Magnetic Hover Effect on CTA Button
const magButton = document.querySelector('.cta-box');
if (magButton) {
  const iconWrap = magButton.querySelector('.icon-wrap');
  
  magButton.addEventListener('mousemove', (e) => {
      const rect = magButton.getBoundingClientRect();
      // Calculate cursor position relative to the center of the button
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Move the WhatsApp icon slightly towards the cursor to create a 'magnetic' pull
      iconWrap.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  
  magButton.addEventListener('mouseleave', () => {
      // Reset position
      iconWrap.style.transform = `translate(0px, 0px)`;
  });
}
