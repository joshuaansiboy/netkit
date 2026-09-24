// This fixed script runs in <head> while HTML is parsed, before the first page paint.
// It contains no user-provided content. CSS handles the system preference when unset.
export const THEME_BOOTSTRAP_SCRIPT =
  '(function(){try{var theme=localStorage.getItem("netkit-theme");if(theme==="light"||theme==="dark"){document.documentElement.dataset.theme=theme}}catch{}})();';
