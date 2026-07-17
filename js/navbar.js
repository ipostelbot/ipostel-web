/* ============================================
   NAVBAR - Mobile menu, Dropdowns, Sticky
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.navbar__hamburger');
  const menu = document.querySelector('.navbar__menu');
  const overlay = document.querySelector('.navbar__overlay');

  // Sticky shadow
  const handleScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', toggleMenu);
  }

  // Mobile dropdowns
  const dropdownItems = document.querySelectorAll('.navbar__item:has(.navbar__dropdown)');

  dropdownItems.forEach(item => {
    const link = item.querySelector('.navbar__link');

    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        item.classList.toggle('dropdown-open');

        // Close other dropdowns
        dropdownItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('dropdown-open');
          }
        });
      }
    });
  });

  // Mobile sub-dropdowns
  const subDropdownItems = document.querySelectorAll('.navbar__sub-dropdown');

  subDropdownItems.forEach(item => {
    const link = item.querySelector('.navbar__dropdown-link');

    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        item.classList.toggle('sub-open');
      }
    });
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && menu.classList.contains('active')) {
      toggleMenu();
    }
  });

  // Close dropdowns when clicking outside (desktop)
  document.addEventListener('click', (e) => {
    if (window.innerWidth > 768) {
      if (!e.target.closest('.navbar__item')) {
        dropdownItems.forEach(item => item.classList.remove('dropdown-open'));
      }
    }
  });
});
