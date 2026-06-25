const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const buttonZone = document.querySelector("#buttonZone");
const celebration = document.querySelector("#celebration");
const partyLayer = document.querySelector("#partyLayer");
const song = document.querySelector("#loveSong");
const iconImage = document.querySelector("#siteIcon");
const iconPill = document.querySelector(".icon-pill");

const colors = ["#fff4f8", "#ff77ad", "#ff315f", "#b68cff", "#ffd86f", "#7ef8d3"];
const hearts = ["♥", "♡", "💖", "💕", "💘"];
const sparkles = ["✦", "✧", "✨", "✺"];
let celebrationStarted = false;
let partyTimer;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getViewport() {
  const viewport = window.visualViewport;

  return {
    width: viewport?.width ?? window.innerWidth,
    height: viewport?.height ?? window.innerHeight,
    left: viewport?.offsetLeft ?? 0,
    top: viewport?.offsetTop ?? 0,
  };
}

function overlaps(rectA, rectB, padding = 0) {
  return !(
    rectA.right < rectB.left - padding ||
    rectA.left > rectB.right + padding ||
    rectA.bottom < rectB.top - padding ||
    rectA.top > rectB.bottom + padding
  );
}

function moveNoButton() {
  if (!noButton || !yesButton || !buttonZone) {
    return;
  }

  if (!noButton.classList.contains("is-floating")) {
    const currentRect = noButton.getBoundingClientRect();

    noButton.style.left = `${Math.round(currentRect.left)}px`;
    noButton.style.top = `${Math.round(currentRect.top)}px`;
    noButton.classList.add("is-floating");
    document.body.appendChild(noButton);
  }

  buttonZone.classList.add("runaway");

  const viewport = getViewport();
  const buttonRect = noButton.getBoundingClientRect();
  const yesRect = yesButton.getBoundingClientRect();
  const margin = 12;
  const width = buttonRect.width || 102;
  const height = buttonRect.height || 52;
  const minX = viewport.left + margin;
  const minY = viewport.top + margin;
  const maxX = viewport.left + viewport.width - width - margin;
  const maxY = viewport.top + viewport.height - height - margin;
  let nextX = clamp(randomBetween(minX, maxX), minX, maxX);
  let nextY = clamp(randomBetween(minY, maxY), minY, maxY);

  for (let attempt = 0; attempt < 32; attempt += 1) {
    const candidateX = clamp(randomBetween(minX, maxX), minX, maxX);
    const candidateY = clamp(randomBetween(minY, maxY), minY, maxY);
    const candidateRect = {
      left: candidateX,
      top: candidateY,
      right: candidateX + width,
      bottom: candidateY + height,
    };

    if (!overlaps(candidateRect, yesRect, 24)) {
      nextX = candidateX;
      nextY = candidateY;
      break;
    }
  }

  noButton.style.left = `${Math.round(nextX)}px`;
  noButton.style.top = `${Math.round(nextY)}px`;
  noButton.style.transform = `rotate(${randomBetween(-9, 9).toFixed(1)}deg)`;
}

function keepNoButtonVisible() {
  if (!noButton?.classList.contains("is-floating")) {
    return;
  }

  const viewport = getViewport();
  const rect = noButton.getBoundingClientRect();
  const margin = 12;
  const nextX = clamp(rect.left, viewport.left + margin, viewport.left + viewport.width - rect.width - margin);
  const nextY = clamp(rect.top, viewport.top + margin, viewport.top + viewport.height - rect.height - margin);

  noButton.style.left = `${Math.round(nextX)}px`;
  noButton.style.top = `${Math.round(nextY)}px`;
}

function playSong() {
  if (!song) {
    document.body.classList.add("audio-missing");
    return;
  }

  try {
    song.currentTime = 0;
    const playAttempt = song.play();

    if (playAttempt?.catch) {
      playAttempt.catch(() => {
        document.body.classList.add("audio-blocked");
      });
    }
  } catch {
    document.body.classList.add("audio-blocked");
  }
}

function removeAfterAnimation(element, timeout) {
  window.setTimeout(() => {
    element.remove();
  }, timeout);
}

function appendParticle(element, lifetime) {
  if (!partyLayer) {
    return;
  }

  while (partyLayer.children.length > 180) {
    partyLayer.firstElementChild?.remove();
  }

  partyLayer.appendChild(element);
  removeAfterAnimation(element, lifetime);
}

function createConfetti() {
  const particle = document.createElement("span");
  const duration = randomBetween(2600, 4800);
  const delay = randomBetween(0, 450);

  particle.className = "particle confetti";
  particle.style.setProperty("--x", `${randomBetween(2, 98)}%`);
  particle.style.setProperty("--drift", `${randomBetween(-42, 42)}vw`);
  particle.style.setProperty("--rot", `${randomBetween(180, 760)}deg`);
  particle.style.setProperty("--duration", `${duration}ms`);
  particle.style.setProperty("--delay", `${delay}ms`);
  particle.style.setProperty("--size", `${randomBetween(6, 12)}px`);
  particle.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
  appendParticle(particle, duration + delay + 250);
}

function createHeart() {
  const particle = document.createElement("span");
  const duration = randomBetween(3000, 5400);
  const delay = randomBetween(0, 350);

  particle.className = "particle heart";
  particle.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  particle.style.setProperty("--x", `${randomBetween(3, 97)}%`);
  particle.style.setProperty("--drift", `${randomBetween(-28, 28)}vw`);
  particle.style.setProperty("--duration", `${duration}ms`);
  particle.style.setProperty("--delay", `${delay}ms`);
  particle.style.setProperty("--size", `${randomBetween(17, 31)}px`);
  particle.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
  appendParticle(particle, duration + delay + 250);
}

function createSparkle() {
  const particle = document.createElement("span");
  const duration = randomBetween(2400, 4200);
  const delay = randomBetween(0, 300);

  particle.className = "particle sparkle";
  particle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
  particle.style.setProperty("--x", `${randomBetween(4, 96)}%`);
  particle.style.setProperty("--drift", `${randomBetween(-26, 26)}vw`);
  particle.style.setProperty("--rot", `${randomBetween(180, 640)}deg`);
  particle.style.setProperty("--duration", `${duration}ms`);
  particle.style.setProperty("--delay", `${delay}ms`);
  particle.style.setProperty("--size", `${randomBetween(15, 27)}px`);
  appendParticle(particle, duration + delay + 250);
}

function createPop(x = randomBetween(8, 92), y = randomBetween(12, 72)) {
  const pop = document.createElement("span");
  const duration = randomBetween(520, 860);

  pop.className = "particle pop";
  pop.style.setProperty("--x", `${x}%`);
  pop.style.setProperty("--size", `${randomBetween(14, 28)}px`);
  pop.style.top = `${y}%`;
  pop.style.setProperty("--duration", `${duration}ms`);
  appendParticle(pop, duration + 100);
}

function createBalloon() {
  const particle = document.createElement("span");
  const duration = randomBetween(3600, 6500);
  const delay = randomBetween(0, 300);
  const x = randomBetween(8, 92);

  particle.className = "particle balloon";
  particle.textContent = "🎈";
  particle.style.setProperty("--x", `${x}%`);
  particle.style.setProperty("--drift", `${randomBetween(-18, 18)}vw`);
  particle.style.setProperty("--duration", `${duration}ms`);
  particle.style.setProperty("--delay", `${delay}ms`);
  particle.style.setProperty("--size", `${randomBetween(26, 40)}px`);
  particle.style.setProperty("--color", colors[Math.floor(Math.random() * colors.length)]);
  appendParticle(particle, duration + delay + 250);

  window.setTimeout(() => {
    createPop(clamp(x + randomBetween(-10, 10), 6, 94), randomBetween(14, 58));
  }, delay + duration * randomBetween(0.55, 0.78));
}

function fireParty(isBigBang = false) {
  const confettiCount = isBigBang ? 46 : 15;
  const heartCount = isBigBang ? 24 : 8;
  const sparkleCount = isBigBang ? 20 : 7;
  const balloonCount = isBigBang ? 12 : 4;
  const popCount = isBigBang ? 10 : 3;

  for (let index = 0; index < confettiCount; index += 1) createConfetti();
  for (let index = 0; index < heartCount; index += 1) createHeart();
  for (let index = 0; index < sparkleCount; index += 1) createSparkle();
  for (let index = 0; index < balloonCount; index += 1) createBalloon();
  for (let index = 0; index < popCount; index += 1) createPop();
}

function celebrate() {
  if (!celebration) {
    return;
  }

  playSong();
  celebration.classList.add("is-visible");
  celebration.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-celebrating");

  if (celebrationStarted) {
    fireParty(true);
    return;
  }

  celebrationStarted = true;
  fireParty(true);

  partyTimer = window.setInterval(() => {
    fireParty(false);
  }, 760);

  window.setTimeout(() => {
    window.clearInterval(partyTimer);
    partyTimer = window.setInterval(() => {
      createHeart();
      createSparkle();
      createBalloon();
    }, 1350);
  }, 9000);
}

if (iconImage && iconPill) {
  iconImage.addEventListener(
    "error",
    () => {
      iconPill.classList.add("icon-fallback");
      iconImage.remove();
    },
    { once: true },
  );
}

if (song) {
  song.addEventListener(
    "error",
    () => {
      document.body.classList.add("audio-missing");
    },
    { once: true },
  );
}

if (noButton) {
  noButton.addEventListener("pointerenter", moveNoButton);
  noButton.addEventListener("focus", moveNoButton);
  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
  });
  noButton.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault();
      moveNoButton();
    },
    { passive: false },
  );
}

yesButton?.addEventListener("click", celebrate);
window.addEventListener("resize", keepNoButtonVisible);
window.visualViewport?.addEventListener("resize", keepNoButtonVisible);
