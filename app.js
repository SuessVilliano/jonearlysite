const SITE_CONFIG = {
  bookingUrl: "/booking.html",
  portraitUrl: "https://sdn2.signalhire.co/storage/profile/d925/ee55/5ad0/11e6/8155/feb7/9ce8/b6d8.webp"
};

const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('done'), 650);
});

const header = document.querySelector('.site-header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 18);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
function closeMenu() {
  menuToggle?.classList.remove('active');
  mobileMenu?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
menuToggle?.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  menuToggle.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

const portraitStyle = document.createElement('style');
portraitStyle.textContent = `.portrait-placeholder.has-photo{background-image:linear-gradient(180deg,rgba(7,17,31,.02),rgba(7,17,31,.18)),url('${SITE_CONFIG.portraitUrl}');background-size:cover;background-position:center 20%;}.portrait-placeholder.has-photo:before,.portrait-placeholder.has-photo:after{display:none}.portrait-placeholder.has-photo>span{display:none}.portrait-placeholder.large.has-photo{background-position:center top}`;
document.head.appendChild(portraitStyle);
document.querySelectorAll('.portrait-placeholder').forEach(el => el.classList.add('has-photo'));

const bookingButton = document.getElementById('bookingButton');
const bookingCard = bookingButton?.closest('.booking-card');
const bookingNote = document.getElementById('bookingNote');
bookingCard?.classList.add('is-ready');
bookingButton?.addEventListener('click', () => { window.location.href = SITE_CONFIG.bookingUrl; });
if (bookingNote) bookingNote.textContent = 'Choose a date and time, complete the intake, and your session request is captured instantly.';

const portrait = document.querySelector('.portrait-frame');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
if (portrait && !reduceMotion && finePointer) {
  portrait.addEventListener('mousemove', (event) => {
    const rect = portrait.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    portrait.style.transform = `perspective(1000px) rotateY(${x * 2.3}deg) rotateX(${y * -2.3}deg)`;
  });
  portrait.addEventListener('mouseleave', () => {
    portrait.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
}

// Mobile viewport + footer-stop hardening for iOS/Safari/Chrome.
const mobileFixes = document.createElement('style');
mobileFixes.textContent = `html,body{max-width:100%;overflow-x:hidden}body{min-height:100dvh;overscroll-behavior-y:none}main{display:block}footer{position:relative;z-index:2;margin-bottom:0;padding-bottom:max(18px,env(safe-area-inset-bottom))}@media(max-width:700px){.hero{min-height:auto;padding-top:118px;padding-bottom:48px}.hero-grid{grid-template-columns:1fr;gap:34px}.hero-visual{min-height:0}.portrait-frame{min-height:420px}.metric-float{display:none}.hero-rule{margin-top:42px}.section-pad{padding-top:72px;padding-bottom:72px}footer{min-height:0}.noise{display:none}}`;
document.head.appendChild(mobileFixes);

// Load shared concierge widget without requiring HTML template changes.
const conciergeCss = document.createElement('link');
conciergeCss.rel = 'stylesheet';
conciergeCss.href = '/concierge.css';
document.head.appendChild(conciergeCss);
const conciergeScript = document.createElement('script');
conciergeScript.src = '/concierge.js';
conciergeScript.defer = true;
document.body.appendChild(conciergeScript);
