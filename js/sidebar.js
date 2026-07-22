/* ============================================
   SIDEBAR - Desktop + Mobile
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('sidebarOverlay');
  const groups = document.querySelectorAll('.sidebar__group');

  if (!sidebar) return;

  let pinned = false;

  // ── Desktop toggle ──
  if (toggle) {
    toggle.addEventListener('click', () => {
      pinned = !pinned;
      sidebar.classList.toggle('expanded', pinned);
    });
  }

  // ── Dropdown toggle ──
  groups.forEach(group => {
    const link = group.querySelector('.sidebar__link');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      group.classList.toggle('open');
    });
  });

  // ── Dropdown link selection (teal highlight) ──
  document.querySelectorAll('.sidebar__dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.sidebar__dropdown-link.selected').forEach(el => el.classList.remove('selected'));
      link.classList.add('selected');
    });
  });

  // ── Desktop hover ──
  sidebar.addEventListener('mouseenter', () => {
    if (!pinned && window.innerWidth > 768) {
      sidebar.classList.add('expanded');
    }
  });

  sidebar.addEventListener('mouseleave', () => {
    if (!pinned && window.innerWidth > 768) {
      sidebar.classList.remove('expanded');
      groups.forEach(g => g.classList.remove('open'));
    }
  });

  // ── Mobile hamburger ──
  function openMobile() {
    sidebar.classList.add('mobile-open');
    hamburger.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    sidebar.classList.remove('mobile-open');
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    groups.forEach(g => g.classList.remove('open'));
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (sidebar.classList.contains('mobile-open')) {
        closeMobile();
      } else {
        openMobile();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobile);
  }

  // ── Escape key ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sidebar.classList.contains('mobile-open')) {
        closeMobile();
      }
      if (pinned) {
        pinned = false;
        sidebar.classList.remove('expanded');
        groups.forEach(g => g.classList.remove('open'));
      }
    }
  });

  // ── Close mobile on resize to desktop ──
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar.classList.contains('mobile-open')) {
      closeMobile();
    }
  });
});
