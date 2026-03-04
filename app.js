const memoryCards = [
  { title: "First Smile", text: "The moment I knew your smile could fix a hard day." },
  { title: "Long Walk", text: "Even silence felt warm while walking with you." },
  { title: "Late Night Talk", text: "Hours felt like minutes when we shared dreams." },
  { title: "Tiny Caring", text: "You remember little details nobody else notices." },
  { title: "Inside Jokes", text: "We laugh at things only we understand." },
  { title: "Quiet Peace", text: "You make ordinary days feel gentle and beautiful." },
];

const reasons = [
  "You are kind even when no one is watching.",
  "You make me want to become a better person.",
  "Your laugh feels like sunlight in winter.",
  "You care deeply, and that is rare.",
  "With you, love feels easy and honest.",
];

const promises = [
  { when: "Today", text: "I will listen more than I assume." },
  { when: "This Week", text: "I will plan one thoughtful date with intention." },
  { when: "This Month", text: "I will celebrate your dreams like they are mine too." },
  { when: "Always", text: "I will choose respect, patience, and truth in every season." },
];

const letterTemplate =
  "You make my world softer and brighter at the same time. I love how your presence turns small moments into favorite memories. I do not want perfect days, I want real days with you, where we keep choosing each other with care. Thank you for being you.";

const romanticQuestions = [
  {
    prompt: "Would you let me keep being the safest place for your heart?",
    yes: "Always, my favorite person.",
    no: "Not today",
  },
  {
    prompt: "Can I plan a dreamy sunset date just for us this week?",
    yes: "Yes, please.",
    no: "Maybe later",
  },
  {
    prompt: "Should we keep collecting tiny beautiful memories together?",
    yes: "Yes, a thousand times.",
    no: "Nope",
  },
  {
    prompt: "May I keep choosing you with patience, care, and loyalty?",
    yes: "Yes, choose me.",
    no: "Unsure",
  },
  {
    prompt: "Would you love to build a peaceful future with me?",
    yes: "Yes, let's build it.",
    no: "Not now",
  },
  {
    prompt: "Can I be your forever teammate in every season of life?",
    yes: "Yes, forever teammate.",
    no: "No thanks",
  },
  {
    prompt: "Do you love Gaurav? Because he loves you more than anything.",
    yes: "Yes, I do.",
    no: "...",
  },
];

const els = {
  yourName: document.getElementById("yourName"),
  herName: document.getElementById("herName"),
  pairingLine: document.getElementById("pairingLine"),
  themeBtn: document.getElementById("themeBtn"),
  letterBtn: document.getElementById("letterBtn"),
  closeLetterBtn: document.getElementById("closeLetterBtn"),
  letterDialog: document.getElementById("letterDialog"),
  typedLetter: document.getElementById("typedLetter"),
  memoryGrid: document.getElementById("memoryGrid"),
  revealReasonBtn: document.getElementById("revealReasonBtn"),
  reasonText: document.getElementById("reasonText"),
  promiseTimeline: document.getElementById("promiseTimeline"),
  questionStage: document.getElementById("questionStage"),
  questionProgress: document.getElementById("questionProgress"),
  questResult: document.getElementById("questResult"),
  canvas: document.getElementById("loveParticles"),
};

let reasonIndex = 0;
let typingTimer = null;
let questionIndex = 0;

init();

function init() {
  renderMemories();
  renderPromises();
  bindEvents();
  setupReveal();
  setupParticles();
  updatePairing();
  renderQuestionCard(true);
}

function bindEvents() {
  [els.yourName, els.herName].forEach((input) => input.addEventListener("input", updatePairing));
  els.themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("day");
  });
  els.letterBtn.addEventListener("click", openLetter);
  els.closeLetterBtn.addEventListener("click", () => els.letterDialog.close());
  els.revealReasonBtn.addEventListener("click", showNextReason);
}

function updatePairing() {
  const your = (els.yourName.value || "A").trim();
  const her = (els.herName.value || "B").trim();
  els.pairingLine.textContent = `${your} + ${her}, written in stars.`;
}

function renderMemories() {
  els.memoryGrid.innerHTML = memoryCards
    .map(
      (item) => `<article class="memory-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>`,
    )
    .join("");
}

function renderPromises() {
  els.promiseTimeline.innerHTML = promises
    .map(
      (p) => `<article class="promise"><b>${escapeHtml(p.when)}</b><span>${escapeHtml(p.text)}</span></article>`,
    )
    .join("");
}

function showNextReason() {
  els.reasonText.textContent = reasons[reasonIndex];
  reasonIndex = (reasonIndex + 1) % reasons.length;
}

function openLetter() {
  els.letterDialog.showModal();
  typeLetter(letterTemplate);
}

function typeLetter(text) {
  clearInterval(typingTimer);
  els.typedLetter.textContent = "";
  let idx = 0;
  typingTimer = setInterval(() => {
    els.typedLetter.textContent += text[idx] || "";
    idx += 1;
    if (idx >= text.length) clearInterval(typingTimer);
  }, 24);
}

function renderQuestionCard(first = false) {
  const q = romanticQuestions[questionIndex];
  els.questionProgress.textContent = `${questionIndex + 1} / ${romanticQuestions.length}`;
  const card = document.createElement("article");
  card.className = `question-card ${first ? "" : "soft-enter"}`;
  card.innerHTML = `
    <p class="question-title">${escapeHtml(q.prompt)}</p>
    <div class="question-actions">
      <button class="primary" data-yes="1">${escapeHtml(q.yes)}</button>
      <button data-no="1">${escapeHtml(q.no)}</button>
    </div>
  `;

  card.querySelector("[data-yes]").addEventListener("click", handlePositiveAnswer);
  const noBtn = card.querySelector("[data-no]");
  noBtn.addEventListener("mouseenter", () => floatAway(noBtn));
  noBtn.addEventListener("touchstart", () => floatAway(noBtn), { passive: true });

  els.questionStage.innerHTML = "";
  els.questionStage.appendChild(card);
}

function handlePositiveAnswer() {
  animateQuestionSuccess();
  if (questionIndex < romanticQuestions.length - 1) {
    questionIndex += 1;
    setTimeout(() => {
      renderQuestionCard();
    }, 380);
    return;
  }
  els.questResult.textContent = "You just unlocked the happiest ending: forever, with love.";
}

function floatAway(button) {
  const box = button.parentElement.getBoundingClientRect();
  const maxX = Math.max(0, box.width - button.offsetWidth);
  const maxY = Math.max(0, 80);
  button.style.position = "relative";
  button.style.transition = "transform 220ms ease";
  button.style.transform = `translate(${Math.random() * maxX - maxX / 2}px, ${Math.random() * maxY - maxY / 2}px) rotate(${Math.random() * 20 - 10}deg)`;
}

function animateQuestionSuccess() {
  const card = els.questionStage.querySelector(".question-card");
  if (!card) return;
  card.classList.add("accepted");
}

function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("show");
      });
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

function setupParticles() {
  const canvas = els.canvas;
  const ctx = canvas.getContext("2d");
  const hearts = [];
  const count = 48;

  function size() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawn() {
    hearts.length = 0;
    for (let i = 0; i < count; i += 1) {
      hearts.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 2 + Math.random() * 4,
        vx: -0.2 + Math.random() * 0.4,
        vy: -0.3 - Math.random() * 0.8,
        a: 0.2 + Math.random() * 0.4,
      });
    }
  }

  function drawHeart(x, y, s, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = `rgba(255,110,170,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-1, -1.2, -2.4, -0.2, 0, 2);
    ctx.bezierCurveTo(2.4, -0.2, 1, -1.2, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((h) => {
      h.x += h.vx;
      h.y += h.vy;
      if (h.y < -10) {
        h.y = canvas.height + 10;
        h.x = Math.random() * canvas.width;
      }
      if (h.x < -20) h.x = canvas.width + 20;
      if (h.x > canvas.width + 20) h.x = -20;
      drawHeart(h.x, h.y, h.r, h.a);
    });
    requestAnimationFrame(frame);
  }

  size();
  spawn();
  frame();
  window.addEventListener("resize", () => {
    size();
    spawn();
  });
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
