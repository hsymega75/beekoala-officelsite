/* ── YouTube responsive ── */
function initYouTubeResponsive() {
  document.querySelectorAll('.video-wrapper iframe').forEach(function(iframe) {
    if (!iframe.getAttribute('data-responsive-done')) {
      iframe.setAttribute('data-responsive-done', '1');
    }
  });
}

/* ── Hamburger nav toggle ── */
function initHamburger(btnId, navId) {
  var btn = document.getElementById(btnId);
  var nav = document.getElementById(navId);
  if (!btn || !nav) return;
  btn.addEventListener('click', function() {
    var isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    btn.textContent = isOpen ? '✕' : '☰';
  });
  nav.querySelectorAll('.dropdown-link').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '☰';
    });
  });
}

/* ── Scroll reveal ── */
function initScrollReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });
}

document.addEventListener('DOMContentLoaded', function() {
  initYouTubeResponsive();
  initScrollReveal();
});
