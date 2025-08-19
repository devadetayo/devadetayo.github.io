// theme-switcher.js
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const storageKey = 'theme';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Load saved theme or default to system
  let theme = localStorage.getItem(storageKey) || 'system';

  // Returns 'dark' or 'light' based on current system
  function getSystemTheme() {
    return mediaQuery.matches ? 'dark' : 'light';
  }

  // Apply the correct theme visually
  function applyTheme(currentTheme) {
    if (currentTheme === 'system') {
      root.setAttribute('data-theme', getSystemTheme());
    } else {
      root.setAttribute('data-theme', currentTheme);
    }
    updateRadios(currentTheme);
  }

  // Highlight the selected radio (even if system matched)
  function updateRadios(active) {
    document.querySelectorAll('.theme-option').forEach(label => {
      const val = label.getAttribute('data-theme');
      const input = label.querySelector('input[type="radio"]');
      if (val === active) {
        input.checked = true;
        label.classList.add('bg-primary', 'text-white');
      } else {
        input.checked = false;
        label.classList.remove('bg-primary', 'text-white');
      }
    });
  }

  // Handle user selecting a theme
  document.querySelectorAll('.theme-option').forEach(label => {
    label.addEventListener('click', () => {
      theme = label.getAttribute('data-theme');
      localStorage.setItem(storageKey, theme);
      applyTheme(theme);
    });
  });

  // React to system changes if theme is 'system'
  mediaQuery.addEventListener('change', () => {
    if (theme === 'system') {
      applyTheme('system');
    }
  });

  // Init
  applyTheme(theme);

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
});


