/* ============================================
   SIDEBAR - Expand/Collapse + Dropdowns
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const groups = document.querySelectorAll('.sidebar__group');

  if (!sidebar) return;

  let pinned = false;

  // Toggle pinned state
  if (toggle) {
    toggle.addEventListener('click', () => {
      pinned = !pinned;
      sidebar.classList.toggle('expanded', pinned);
    });
  }

  // Dropdown toggle
  groups.forEach(group => {
    const link = group.querySelector('.sidebar__link');
    link.addEventListener('click', (e) => {
      e.preventDefault();
      group.classList.toggle('open');
    });
  });

  // Expand on mouse enter (only if not pinned)
  sidebar.addEventListener('mouseenter', () => {
    if (!pinned) {
      sidebar.classList.add('expanded');
    }
  });

  // Collapse on mouse leave (only if not pinned)
  sidebar.addEventListener('mouseleave', () => {
    if (!pinned) {
      sidebar.classList.remove('expanded');
      // Close all dropdowns when collapsing
      groups.forEach(g => g.classList.remove('open'));
    }
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && pinned) {
      pinned = false;
      sidebar.classList.remove('expanded');
      groups.forEach(g => g.classList.remove('open'));
    }
  });
});
