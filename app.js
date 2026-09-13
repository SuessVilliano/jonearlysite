const SITE_CONFIG = {
  ghlBookingUrl: "",
  fallbackEmail: "hello@earlyadvisory.co"
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

const bookingButton = document.getElementById('bookingButton');
const bookingCard = bookingButton?.closest('.booking-card');
const bookingNote = document.getElementById('bookingNote');

if (SITE_CONFIG.ghlBookingUrl) {
  bookingCard?.classList.add('is-ready');
  bookingButton?.addEventListener('click', () => {
    window.open(SITE_CONFIG.ghlBookingUrl, '_blank', 'noopener,noreferrer');
  });
} else {
  bookingButton?.addEventListener('click', () => {
    const subject = encodeURIComponent('Executive Strategy Session — Early Advisory');
    const body = encodeURIComponent('Hi Jonathan,\n\nI would like to schedule an Executive Strategy Session.\n\nCompany:\nPrimary decision/challenge:\nBest times to meet:\n');
    window.location.href = `mailto:${SITE_CONFIG.fallbackEmail}?subject=${subject}&body=${body}`;
  });
  if (bookingNote) bookingNote.textContent = 'GHL calendar is ready to connect as soon as the booking URL is added.';
}

// Subtle desktop parallax for the hero card; disabled on touch/reduced-motion devices.
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
