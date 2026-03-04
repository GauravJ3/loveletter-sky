const romanticCards = [
  {
    q: "Will you let me keep turning ordinary days into little love stories with you?",
    m: "You are my favorite chapter, every single day.",
  },
  {
    q: "Can we promise to choose softness, honesty, and laughter in every season?",
    m: "Love grows deepest where kindness is consistent.",
  },
  {
    q: "Would you say yes to more sunsets, warm hugs, and long hand-held walks with me?",
    m: "With you, even silence feels like poetry.",
  },
  {
    q: "Do you love Gaurav? Because he loves you more than anything.",
    m: "Final card unlocked: forever energy.",
  },
];

const affirmations = [
  "Perfect choice. Your yes looks beautiful.",
  "That yes just made the sky blush.",
  "Heart approved. Carrying love forward.",
  "Destiny says: excellent decision, madamji.",
];

const els = {
  yesBtn: document.getElementById("yesBtn"),
  noBtn: document.getElementById("noBtn"),
  actionArea: document.getElementById("actionArea"),
  questionCard: document.getElementById("frontCard"),
  stackWrap: document.getElementById("stackWrap"),
  cardIndex: document.getElementById("cardIndex"),
  cardQuestion: document.getElementById("cardQuestion"),
  cardMessage: document.getElementById("cardMessage"),
  affirmation: document.getElementById("affirmation"),
  celebration: document.getElementById("celebration"),
  canvas: document.getElementById("petalCanvas"),
  loveAudio: document.getElementById("loveAudio"),
};

let confettiId = null;
let cardCursor = 0;
let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
let noWanderTimer = null;

init();

function init() {
  bindEvents();
  runPetalBackground();
  setCard();
  runEntranceAnimation();
  positionNoButtonInitial();
}

function bindEvents() {
  els.yesBtn.addEventListener("click", handleYes);
  els.noBtn.addEventListener("mouseenter", dodgeNoButton);
  els.noBtn.addEventListener("mousemove", dodgeNoButton);
  els.noBtn.addEventListener("touchstart", dodgeNoButton, { passive: true });
  document.addEventListener("mousemove", (event) => {
    lastPointer = { x: event.clientX, y: event.clientY };
    evadePointerProximity(event);
  });
  document.addEventListener(
    "touchmove",
    (event) => {
      const t = event.touches && event.touches[0];
      if (!t) return;
      lastPointer = { x: t.clientX, y: t.clientY };
      evadePointerProximity({ clientX: t.clientX, clientY: t.clientY });
    },
    { passive: true },
  );
  document.addEventListener(
    "touchstart",
    (event) => {
      const t = event.touches && event.touches[0];
      if (!t) return;
      lastPointer = { x: t.clientX, y: t.clientY };
      evadePointerProximity({ clientX: t.clientX, clientY: t.clientY });
    },
    { passive: true },
  );
  window.addEventListener("resize", positionNoButtonInitial);
  if (window.visualViewport) window.visualViewport.addEventListener("resize", positionNoButtonInitial);
  els.noBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dodgeNoButton();
  });
  els.noBtn.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    dodgeNoButton();
  });
}

function evadePointerProximity(event) {
  const rect = els.noBtn.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const distance = Math.hypot(dx, dy);
  const triggerRadius = 240;
  if (distance < triggerRadius) dodgeNoButton(event);
}

function setCard() {
  const c = romanticCards[cardCursor];
  els.cardIndex.textContent = `Card ${cardCursor + 1} of ${romanticCards.length}`;
  els.cardQuestion.textContent = c.q;
  els.cardMessage.textContent = c.m;
  positionNoButtonInitial();
}

function dodgeNoButton(event) {
  const btn = els.noBtn;
  const { vw, vh } = getViewportSize();
  const pad = 18;
  const bw = btn.offsetWidth || 140;
  const bh = btn.offsetHeight || 48;

  const px = event && typeof event.clientX === "number" ? event.clientX : lastPointer.x;
  const py = event && typeof event.clientY === "number" ? event.clientY : lastPointer.y;

  let targetX = pad;
  let targetY = pad;
  let found = false;

  for (let i = 0; i < 30; i += 1) {
    const candidateX = pad + Math.random() * Math.max(10, vw - bw - pad * 2);
    const candidateY = pad + Math.random() * Math.max(10, vh - bh - pad * 2);
    const candidateCenterX = candidateX + bw / 2;
    const candidateCenterY = candidateY + bh / 2;
    const dist = Math.hypot(candidateCenterX - px, candidateCenterY - py);
    if (dist > 260) {
      targetX = candidateX;
      targetY = candidateY;
      found = true;
      break;
    }
  }

  if (!found) {
    targetX = pad + Math.random() * Math.max(10, vw - bw - pad * 2);
    targetY = pad + Math.random() * Math.max(10, vh - bh - pad * 2);
  }

  targetX = Math.max(pad, Math.min(vw - bw - pad, targetX));
  targetY = Math.max(pad, Math.min(vh - bh - pad, targetY));

  btn.style.position = "fixed";
  btn.style.left = `${targetX}px`;
  btn.style.top = `${targetY}px`;
  btn.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
  btn.style.visibility = "visible";
  btn.style.opacity = "1";
  if (window.gsap) gsap.fromTo(btn, { scale: 0.98 }, { scale: 1.04, duration: 0.12, yoyo: true, repeat: 1 });
}

function positionNoButtonInitial() {
  const btn = els.noBtn;
  const yes = els.yesBtn.getBoundingClientRect();
  const { vw, vh } = getViewportSize();
  const bw = btn.offsetWidth || 92;
  const bh = btn.offsetHeight || 42;
  const pad = 12;
  const mobileMode = window.matchMedia("(max-width: 639px), (hover: none), (pointer: coarse)").matches;

  let left = yes.left;
  let top = yes.bottom + 10;

  if (mobileMode) {
    left = yes.left + (yes.width - bw) / 2;
    top = yes.bottom + 10;
  } else {
    left = yes.right + 12;
    top = yes.top + (yes.height - bh) / 2;
  }

  left = Math.max(pad, Math.min(vw - bw - pad, left));
  top = Math.max(pad, Math.min(vh - bh - pad, top));

  btn.style.position = "fixed";
  btn.style.left = `${left}px`;
  btn.style.top = `${top}px`;
  btn.style.transform = "rotate(0deg)";
  btn.style.visibility = "visible";
  btn.style.opacity = "1";
}

function startNoButtonWander() {
  if (!window.gsap || noWanderTimer) return;
  const move = () => {
    const btn = els.noBtn;
    const { vw, vh } = getViewportSize();
    const pad = 14;
    const bw = btn.offsetWidth || 90;
    const bh = btn.offsetHeight || 42;
    const tx = pad + Math.random() * Math.max(10, vw - bw - pad * 2);
    const ty = pad + Math.random() * Math.max(10, vh - bh - pad * 2);
    gsap.to(btn, {
      left: tx,
      top: ty,
      rotation: Math.random() * 18 - 9,
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
      onComplete: () => {
        noWanderTimer = setTimeout(move, 500);
      },
    });
  };
  move();
}

function stopNoButtonWander() {
  if (noWanderTimer) {
    clearTimeout(noWanderTimer);
    noWanderTimer = null;
  }
}

function getViewportSize() {
  if (window.visualViewport) {
    return {
      vw: Math.max(280, window.visualViewport.width),
      vh: Math.max(380, window.visualViewport.height),
    };
  }
  return {
    vw: Math.max(280, window.innerWidth),
    vh: Math.max(380, window.innerHeight),
  };
}

function handleYes() {
  const line = affirmations[Math.floor(Math.random() * affirmations.length)];
  els.affirmation.textContent = line;

  if (cardCursor < romanticCards.length - 1) {
    launchConfetti(900);
    spawnRoseBurst(12);
    transitionToNextCard();
    return;
  }

  openFinalCelebration();
}

function transitionToNextCard() {
  if (window.gsap) {
    gsap.to(els.questionCard, {
      y: -22,
      opacity: 0,
      rotate: -2,
      duration: 0.28,
      onComplete: () => {
        cardCursor += 1;
        setCard();
        gsap.fromTo(els.questionCard, { y: 22, opacity: 0, rotate: 2 }, { y: 0, opacity: 1, rotate: 0, duration: 0.35 });
      },
    });
  } else {
    cardCursor += 1;
    setCard();
  }
}

function openFinalCelebration() {
  if (window.gsap) {
    gsap.to(".card-stack-shell", {
      opacity: 0,
      y: -18,
      duration: 0.35,
      onComplete: () => {
        document.querySelector(".card-stack-shell").classList.add("hidden");
        els.celebration.classList.remove("hidden");
        document.body.classList.add("final-mode");
        document.body.classList.add("final-message-lock");
        stopNoButtonWander();
        animateCelebrationIn();
      },
    });
  } else {
    document.querySelector(".card-stack-shell").classList.add("hidden");
    els.celebration.classList.remove("hidden");
    document.body.classList.add("final-mode");
    document.body.classList.add("final-message-lock");
    stopNoButtonWander();
  }
  playLoveHook();
  els.celebration.classList.add("settled");
}

function runEntranceAnimation() {
  if (!window.gsap) return;
  gsap.from(".card-stack-shell", { y: 22, opacity: 0, duration: 0.8, ease: "power2.out" });
}

function animateCelebrationIn() {
  if (!window.gsap) return;
  gsap.from("#celebration", { opacity: 0, y: 8, duration: 0.35, ease: "power1.out" });
}

function playLoveHook() {
  const audio = els.loveAudio;
  if (audio && audio.src && !audio.src.endsWith("/")) {
    audio.currentTime = 0;
    audio.play().catch(() => playSoftChime());
    return;
  }
  playSoftChime();
}

function playSoftChime() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  [440, 554, 659].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const start = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.035, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    osc.start(start);
    osc.stop(start + 0.3);
  });
  setTimeout(() => ctx.close(), 900);
}

function spawnRoseBurst(count) {
  const symbols = ["🌹", "🌸", "💖", "✨", "🫶"];
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("span");
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.position = "fixed";
    el.style.left = `${Math.random() * window.innerWidth}px`;
    el.style.top = `${window.innerHeight + 20}px`;
    el.style.fontSize = `${16 + Math.random() * 22}px`;
    el.style.pointerEvents = "none";
    el.style.zIndex = "20";
    document.body.appendChild(el);

    const rise = 1200 + Math.random() * 1100;
    const drift = Math.random() * 220 - 110;
    el.animate(
      [
        { transform: "translate(0, 0) rotate(0deg)", opacity: 0.95 },
        { transform: `translate(${drift}px, -${window.innerHeight + 140}px) rotate(${180 + Math.random() * 360}deg)`, opacity: 0 },
      ],
      { duration: rise, easing: "cubic-bezier(0.2,0.7,0.2,1)", fill: "forwards" },
    );
    setTimeout(() => el.remove(), rise + 80);
  }
}

function launchConfetti(duration = 2200) {
  if (typeof confetti === "function") {
    const start = Date.now();
    const palette = ["#ff5c9f", "#ffd56a", "#ffffff", "#9bf7d3", "#ff9d63"];
    const timer = setInterval(() => {
      const t = duration - (Date.now() - start);
      if (t <= 0) {
        clearInterval(timer);
        return;
      }
      const count = Math.max(12, Math.round((t / duration) * 34));
      confetti({
        particleCount: count,
        spread: 76,
        startVelocity: 28,
        origin: { x: 0.1 + Math.random() * 0.8, y: -0.02 },
        colors: palette,
      });
    }, 220);
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.pointerEvents = "none";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.zIndex = "25";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.4,
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 5,
    r: 4 + Math.random() * 4,
    rot: Math.random() * Math.PI,
    color: ["#ff5c9f", "#ffd56a", "#ffffff", "#9bf7d3", "#ff9d63"][Math.floor(Math.random() * 5)],
  }));

  let start = performance.now();
  const frame = (now) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += 0.08;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      ctx.restore();
    });
    if (now - start < duration) confettiId = requestAnimationFrame(frame);
    else {
      cancelAnimationFrame(confettiId);
      canvas.remove();
    }
  };
  confettiId = requestAnimationFrame(frame);
}

function runPetalBackground() {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const petals = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const seed = () => {
    petals.length = 0;
    for (let i = 0; i < 55; i += 1) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 5,
        speedY: 0.4 + Math.random() * 1.2,
        sway: Math.random() * 0.04,
        angle: Math.random() * Math.PI * 2,
        alpha: 0.2 + Math.random() * 0.5,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p) => {
      p.y += p.speedY;
      p.angle += p.sway;
      p.x += Math.sin(p.angle) * 0.7;
      if (p.y > canvas.height + 10) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = `rgba(255, 183, 214, ${p.alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.66, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(draw);
  };

  resize();
  seed();
  draw();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });
}
