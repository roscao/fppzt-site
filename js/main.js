// ============================================================
// LANGUAGE TOGGLE
// ============================================================
let currentLang = 'ro';

function toggleLang() {
  currentLang = currentLang === 'ro' ? 'en' : 'ro';
  document.body.classList.toggle('lang-en', currentLang === 'en');
  document.querySelector('.lang-toggle').textContent = currentLang === 'ro' ? 'EN' : 'RO';
  document.documentElement.lang = currentLang;
}

// ============================================================
// SCROLL ANIMATIONS
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ============================================================
// CLOSE MOBILE MENU ON LINK CLICK
// ============================================================
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});
