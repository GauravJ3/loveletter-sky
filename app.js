const els = {
  yesBtn: document.getElementById("yesBtn"),
  noBtn: document.getElementById("noBtn"),
  actionArea: document.getElementById("actionArea"),
  questionCard: document.getElementById("questionCard"),
  celebration: document.getElementById("celebration"),
  canvas: document.getElementById("petalCanvas"),
};

let confettiId = null;

init();

function init() {
  bindEvents();
  runPetalBackground();
}

function bindEvents() {
  els.yesBtn.addEventListener("click", handleYes);
  els.noBtn.addEventListener("mouseenter", () => dodgeNoButton());
  els.noBtn.addEventListener("mousemove", () => dodgeNoButton());
  els.noBtn.addEventListener("touchstart", () => dodgeNoButton(), { passive: true });
  els.noBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dodgeNoButton();
  });
}

function dodgeNoButton() {
  const area = els.actionArea.getBoundingClientRect();
  const btn = els.noBtn;
  const maxX = Math.max(0, area.width - btn.offsetWidth);
  const maxY = Math.max(0, area.height + 60 - btn.offsetHeight);
  const x = Math.random() * maxX - maxX / 2;
  const y = Math.random() * maxY - maxY / 2;
  btn.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 26 - 13}deg)`;
}

function handleYes() {
  els.questionCard.classList.add("hidden");
  els.celebration.classList.remove("hidden");
  launchConfetti();
  spawnRoseBurst();
}

function spawnRoseBurst() {
  const symbols = ["🌹", "🌸", "💖", "✨", "🫶"];
  for (let i = 0; i < 32; i += 1) {
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

function launchConfetti() {
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
  const duration = 2800;

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

    if (now - start < duration) {
      confettiId = requestAnimationFrame(frame);
    } else {
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
