const pages = document.querySelectorAll('.page');
let currentPage = 0;
let isAnimating = false;

function resetReveals(page) {
  page.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('show');
  });
}

function revealPage(page) {
  const items = page.querySelectorAll('.reveal');
  const delay = 300;

  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('show');
    }, i * delay);
  });
}

function showPage(index, direction) {
  if (index < 0 || index >= pages.length || index === currentPage || isAnimating)
    return;

  isAnimating = true;

  const current = pages[currentPage];
  const next = pages[index];

  // Animate current page out
  current.classList.add(direction === 'left' ? 'exit-left' : 'exit-right');

  // Wait until exit animation is done
  setTimeout(() => {
    // Hide current page completely
    current.classList.remove('active', 'exit-left', 'exit-right');

    // Reset reveals *after page is gone*
    current.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('show'); // back to hidden + offset via CSS
    });

    // Activate next page
    next.classList.add('active');

    // Animate reveals one by one
    const items = next.querySelectorAll('.reveal');
    const baseDelay = 300;
    items.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('show');
      }, i * baseDelay);
    });

    currentPage = index;
    isAnimating = false;
  }, 450); // match page exit duration
}


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