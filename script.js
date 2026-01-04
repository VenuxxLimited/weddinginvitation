const pages = document.querySelectorAll('.page');
let currentPage = 0;
let isAnimating = false;

const revealTimeouts = new Map(); // page -> array of timeouts

function revealPage(page) {
  const items = page.querySelectorAll('.reveal');
  const delay = 250;
  const timeouts = [];

  items.forEach((el, i) => {
    const t = setTimeout(() => {
      el.classList.add('show');
    }, i * delay);
    timeouts.push(t);
  });

  // store timeouts so we can cancel them
  revealTimeouts.set(page, timeouts);
}

function resetReveals(page) {
  // Cancel any pending reveal timeouts
  if (revealTimeouts.has(page)) {
    revealTimeouts.get(page).forEach(clearTimeout);
    revealTimeouts.delete(page);
  }

  // reset all reveals
  page.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('show');
  });
}

function showPage(index, direction) {
  if (index < 0 || index >= pages.length || index === currentPage || isAnimating)
    return;

  isAnimating = true;

  const current = pages[currentPage];
  const next = pages[index];

  // Cancel any pending reveals immediately so they don't animate mid-exit
  if (revealTimeouts.has(current)) {
    revealTimeouts.get(current).forEach(clearTimeout);
    revealTimeouts.delete(current);
  }

  // Animate current page out
  current.classList.add(direction === 'left' ? 'exit-left' : 'exit-right');

  // Wait until exit animation is done
  setTimeout(() => {
    // Hide current page completely
    current.classList.remove('active', 'exit-left', 'exit-right');

    // Now reset reveals AFTER the page is hidden
    current.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('show');
    });

    // Activate next page
    next.classList.add('active');
    revealPage(next); // animate reveals

    currentPage = index;
    isAnimating = false;
  }, 450); // match page exit duration
}

let startY = 0;

document.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', e => {
  const deltaY = e.touches[0].clientY - startY;
  // If user tries to move vertically, prevent it
  if (Math.abs(deltaY) > 0) {
    e.preventDefault();
  }
}, { passive: false });



// Initial load
pages.forEach((p, i) => {
  if (i !== 0) resetReveals(p);
});
pages[0].classList.add('active');
revealPage(pages[0]);


let isDragging = false;
let dragStartX = 0;
let dragCurrentX = 0;

// --- Mouse events (desktop) ---
document.addEventListener('mousedown', e => {
  isDragging = true;
  dragStartX = e.clientX;
});
document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  dragCurrentX = e.clientX;
});
document.addEventListener('mouseup', () => {
  if (!isDragging) return;
  handleSwipe();
  isDragging = false;
});

// --- Touch events (mobile) ---
document.addEventListener('touchstart', e => {
  isDragging = true;
  dragStartX = e.touches[0].clientX;
});
document.addEventListener('touchmove', e => {
  if (!isDragging) return;
  dragCurrentX = e.touches[0].clientX;
});
document.addEventListener('touchend', () => {
  if (!isDragging) return;
  handleSwipe();
  isDragging = false;
});

// --- Common handler ---
function handleSwipe() {
  const delta = dragCurrentX - dragStartX;

  if (delta > 60) showPage(currentPage - 1, 'right'); // swipe right
  if (delta < -60) showPage(currentPage + 1, 'left'); // swipe left
}

function scaleApp() {
    const baseWidth = 500;
    const baseHeight = 888; // 9 / 16

    const scale = Math.min(
      window.innerWidth / baseWidth,
      window.innerHeight / baseHeight
    );

    document.querySelector('.scale-root').style.transform =
      `scale(${scale})`;
  }

  window.addEventListener('resize', scaleApp);
  scaleApp();