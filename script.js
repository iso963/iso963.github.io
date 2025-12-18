​​​​​​​​​// ================================
// Random Arena - vanilla JS logic
// ================================

// ----- State -----
let names = [];
let currentMode = "floating"; // "floating" | "hex" | "roulette"
let isAnimating = false; // prevents starting multiple animations at once

// HTML element references
const nameInput = document.getElementById("nameInput");
const addNameBtn = document.getElementById("addNameBtn");
const nameListEl = document.getElementById("nameList");
const clearListBtn = document.getElementById("clearListBtn");
const shuffleListBtn = document.getElementById("shuffleListBtn");

const modeButtons = document.querySelectorAll(".mode-btn");
const randomizeBtn = document.getElementById("randomizeBtn");
const arena = document.getElementById("arena");
const arenaTitle = document.getElementById("arenaTitle");

const winnerBanner = document.getElementById("winnerBanner");
const winnerNameSpan = document.getElementById("winnerName");

// ========== Utility functions ==========

/**
 * Renders the current names into the sidebar list.
 * Each item can be edited (double-click) or removed.
 */
function renderNameList() {
  nameListEl.innerHTML = "";

  names.forEach((name, index) => {
    const li = document.createElement("li");
    li.className = "name-item";

    const span = document.createElement("span");
    span.textContent = name;

    // Double-click to edit a name (simple prompt for beginners)
    span.addEventListener("dblclick", () => {
      const newName = prompt("Edit name:", name);
      if (newName && newName.trim()) {
        names[index] = newName.trim();
        renderNameList();
        renderArena();
      }
    });

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn ghost";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      names.splice(index, 1);
      renderNameList();
      renderArena();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    nameListEl.appendChild(li);
  });
}

/**
 * Adds a name from the input field to the array and re-renders.
 */
function addNameFromInput() {
  const value = nameInput.value.trim();
  if (!value) return;
  names.push(value);
  nameInput.value = "";
  renderNameList();
  renderArena();
}

/**
 * Simple array shuffle using Fisher-Yates algorithm.
 */
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Shows the winner banner with a given name.
 */
function showWinnerBanner(name) {
  winnerNameSpan.textContent = name;
  winnerBanner.classList.remove("hidden");
}

/**
 * Hides the winner banner.
 */
function hideWinnerBanner() {
  winnerBanner.classList.add("hidden");
}

// ========== Arena rendering for each mode ==========

/**
 * Render arena for the currently selected mode.
 */
function renderArena() {
  // Clear winner label when the arena changes
  hideWinnerBanner();

  // Remove any previous mode classes
  arena.classList.remove("floating-mode", "hex-mode", "roulette-mode");

  if (currentMode === "floating") {
    arenaTitle.textContent = "Floating Cards Arena";
    renderFloatingArena();
  } else if (currentMode === "hex") {
    arenaTitle.textContent = "Hexagon Arena";
    renderHexArena();
  } else if (currentMode === "roulette") {
    arenaTitle.textContent = "Vertical Roulette";
    renderRouletteArena();
  }
}

/**
 * Floating Cards Arena:
 * - Names are placed randomly within the area as gently floating cards.
 */
function renderFloatingArena() {
  arena.classList.add("floating-mode");
  arena.innerHTML = "";

  const container = document.createElement("div");
  container.className = "floating-container";
  arena.appendChild(container);

  if (!names.length) {
    container.innerHTML = "<p style='opacity:0.6;font-size:0.9rem;'>Add some names to see them float.</p>";
    return;
  }

  // Create a card for each name with random position and animation offset
  names.forEach((name, i) => {
    const card = document.createElement("div");
    card.className = "float-card";
    card.textContent = name;

    // Random position inside the container (respecting some padding)
    const top = Math.random() * 70 + 5; // 5% - 75%
    const left = Math.random() * 70 + 5;

    card.style.top = top + "%";
    card.style.left = left + "%";

    // Different animation durations / delays keep the motion organic
    const duration = 8 + Math.random() * 6; // 8s - 14s
    const delay = -Math.random() * 10; // negative value = animation starts mid-cycle
    card.style.animationDuration = duration + "s";
    card.style.animationDelay = delay + "s";

    container.appendChild(card);
  });
}

/**
 * Hexagon Arena:
 * - Up to 6 names are placed around a hex ring.
 * - If there are more than 6 names, we use the first 6 for the arena.
 */
function renderHexArena() {
  arena.classList.add("hex-mode");
  arena.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "hex-wrapper";
  arena.appendChild(wrapper);

  if (!names.length) {
    const msg = document.createElement("p");
    msg.style.opacity = "0.7";
    msg.style.fontSize = "0.9rem";
    msg.style.padding = "12px";
    msg.textContent = "Add names to fill the hexagon segments.";
    arena.appendChild(msg);
    return;
  }

  const visibleNames = names.slice(0, 6); // max 6 for now
  for (let i = 0; i < 6; i++) {
    const segment = document.createElement("div");
    segment.className = `hex-segment pos-${i}`;

    if (visibleNames[i]) {
      segment.textContent = visibleNames[i];
    } else {
      segment.textContent = "—";
      segment.style.opacity = "0.3";
    }

    wrapper.appendChild(segment);
  }
}

/**
 * Vertical Roulette:
 * - A strip of rows scrolls vertically inside a masked window.
 */
function renderRouletteArena() {
  arena.classList.add("roulette-mode");
  arena.innerHTML = "";

  const windowEl = document.createElement("div");
  windowEl.className = "roulette-window";

  const strip = document.createElement("div");
  strip.className = "roulette-strip";

  windowEl.appendChild(strip);
  arena.appendChild(windowEl);

  if (!names.length) {
    const msg = document.createElement("p");
    msg.style.opacity = "0.7";
    msg.style.fontSize = "0.9rem";
    msg.style.padding = "12px";
    msg.textContent = "Add names and start the arena to see the roulette.";
    arena.appendChild(msg);
    return;
  }

  // We repeat the list a few times to make the scroll look longer.
  const repeats = 4;
  for (let r = 0; r < repeats; r++) {
    names.forEach((name) => {
      const row = document.createElement("div");
      row.className = "roulette-item";
      row.textContent = name;
      strip.appendChild(row);
    });
  }
}

// ========== Animations for each mode ==========

/**
 * Floating cards animation:
 * - We rapidly highlight random cards.
 * - The highlights slow down to build suspense.
 * - The last card stays highlighted as the winner.
 */
function playFloatingAnimation() {
  const cards = arena.querySelectorAll(".float-card");
  if (!cards.length) return;

  isAnimating = true;
  hideWinnerBanner();

  let currentIndex = -1;
  let interval = 70; // starting speed
  const totalSteps = 20; // how many highlight changes
  let step = 0;

  function highlightStep() {
    // Remove previous highlight
    cards.forEach((card) => card.classList.remove("highlight", "winner"));

    // Pick a new random index
    currentIndex = Math.floor(Math.random() * cards.length);
    const currentCard = cards[currentIndex];
    currentCard.classList.add("highlight");

    step++;
    interval += 30; // increase interval (slows down each step)

    if (step < totalSteps) {
      setTimeout(highlightStep, interval);
    } else {
      // Final winner
      currentCard.classList.add("winner");
      const winner = currentCard.textContent;
      showWinnerBanner(winner);
      isAnimating = false;
    }
  }

  highlightStep();
}

/**
 * Hexagon arena animation:
 * - We quickly cycle the "active" segment around the ring.
 * - The cycling slows down and the last segment is the winner.
 */
function playHexAnimation() {
  const segments = arena.querySelectorAll(".hex-segment");
  if (!segments.length) return;

  isAnimating = true;
  hideWinnerBanner();

  let activeIndex = 0;
  let interval = 80;
  const totalRounds = 24;
  let round = 0;

  function cycle() {
    // Clear previous active/winner styles
    segments.forEach((seg) => seg.classList.remove("active", "winner"));

    // Move to the next segment
    activeIndex = (activeIndex + 1) % segments.length;
    const activeSegment = segments[activeIndex];
    activeSegment.classList.add("active");

    round++;
    interval += 18; // slow down

    if (round < totalRounds) {
      setTimeout(cycle, interval);
    } else {
      // Winner
      activeSegment.classList.add("winner");
      const winner = activeSegment.textContent === "—"
        ? "(empty segment)"
        : activeSegment.textContent;
      showWinnerBanner(winner);
      isAnimating = false;
    }
  }

  cycle();
}

/**
 * Roulette animation:
 * - We animate the vertical position of the strip with JS.
 * - As we slow down, we "snap" a row to the center and highlight it.
 */
function playRouletteAnimation() {
  const windowEl = arena.querySelector(".roulette-window");
  const strip = arena.querySelector(".roulette-strip");
  if (!windowEl || !strip || !names.length) return;

  isAnimating = true;
  hideWinnerBanner();

  const rows = Array.from(strip.querySelectorAll(".roulette-item"));
  const rowHeight = rows[0].offsetHeight + 8; // approximate including margin
  const totalRows = rows.length;

  // We will scroll several rows then slow down.
  const totalScrollRows = totalRows * 0.7; // 70% of strip
  const totalDistance = totalScrollRows * rowHeight;

  let startTime = null;
  const duration = 2800; // ms

  function easeOutCubic(t) {
    // simple easing for slow-down effect (0..1)
    return 1 - Math.pow(1 - t, 3);
  }

  function animateScroll(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Apply ease-out to movement
    const eased = easeOutCubic(progress);
    const offset = eased * totalDistance;

    strip.style.transform = `translateY(${-offset}px)`;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      // After scrolling finishes, decide which row is nearest to center
      finishRoulette();
    }
  }

  function finishRoulette() {
    const windowRect = windowEl.getBoundingClientRect();
    const centerY = windowRect.top + windowRect.height / 2;

    // Find row closest to center
    let closestRow = null;
    let closestDistance = Infinity;

    rows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const rowCenter = rect.top + rect.height / 2;
      const distance = Math.abs(rowCenter - centerY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestRow = row;
      }
    });

    if (!closestRow) {
      isAnimating = false;
      return;
    }

    // Slight snap: adjust strip position so this row is exactly centered
    const rowRect = closestRow.getBoundingClientRect();
    const rowCenter = rowRect.top + rowRect.height / 2;
    const delta = rowCenter - centerY;

    // Current transform value (we only used translateY so we can parse it)
    const currentTransform = strip.style.transform || "translateY(0px)";
    const match = currentTransform.match(/-?\d+\.?\d*/);
    const currentY = match ? parseFloat(match[0]) : 0;
    const newY = currentY - delta;

    strip.style.transition = "transform 0.5s ease-out";
    strip.style.transform = `translateY(${newY}px)`;

    // Highlight the winner row
    rows.forEach((row) => row.classList.remove("winner", "active"));
    closestRow.classList.add("winner");

    const winner = closestRow.textContent;
    showWinnerBanner(winner);

    // Clean up after the snap transition ends
    setTimeout(() => {
      strip.style.transition = "";
      isAnimating = false;
    }, 550);
  }

  requestAnimationFrame(animateScroll);
}

// ========== Event listeners ==========

// Add name button
addNameBtn.addEventListener("click", addNameFromInput);

// Add name with Enter key
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNameFromInput();
  }
});

// Clear all names
clearListBtn.addEventListener("click", () => {
  if (!names.length) return;
  if (!confirm("Clear all names?")) return;
  names = [];
  renderNameList();
  renderArena();
});

// Shuffle list of names
shuffleListBtn.addEventListener("click", () => {
  if (!names.length) return;
  shuffleArray(names);
  renderNameList();
  renderArena();
});

// Mode switching
modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.mode === currentMode) return;

    currentMode = btn.dataset.mode;

    // Update button active state
    modeButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Re-render arena for new mode
    renderArena();
  });
});

// Start randomization animation
randomizeBtn.addEventListener("click", () => {
  if (isAnimating) return; // prevent overlapping animations

  if (!names.length) {
    alert("Add at least one name first.");
    return;
  }

  if (currentMode === "floating") {
    playFloatingAnimation();
  } else if (currentMode === "hex") {
    playHexAnimation();
  } else if (currentMode === "roulette") {
    playRouletteAnimation();
  }
});

// ========== Initial render with some demo names (optional) ==========

// You can comment this out if you prefer an empty state.
names = ["Ada", "Grace", "Linus", "Kevin", "Satoshi", "Evo", "Sam"];
renderNameList();
renderArena();
