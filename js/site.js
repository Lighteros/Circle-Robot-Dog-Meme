const SITE = {
  name: "Circle Robot Dog",
  symbol: "Bits",
  chain: "arc",
  ca: "xxx",
  pair: "",
  x: "https://x.com/BitsRobotDog",
  explorer: "https://explorer.arc.io",
  dexBase: "https://dexscreener.com/arc",
  uniBase: "https://app.uniswap.org/swap?chain=arc",
};

function hasLiveCa() {
  return /^0x[a-fA-F0-9]{40}$/.test(SITE.ca);
}

function dexUrl() {
  return SITE.pair ? `${SITE.dexBase}/${SITE.pair}` : SITE.dexBase;
}

function uniUrl() {
  return hasLiveCa() ? `${SITE.uniBase}&outputCurrency=${SITE.ca}` : SITE.uniBase;
}

function scanUrl() {
  return hasLiveCa() ? `${SITE.explorer}/address/${SITE.ca}` : SITE.explorer;
}

function wireLinks() {
  const dex = dexUrl();
  const uni = uniUrl();
  const scan = scanUrl();
  document.querySelectorAll("[data-link='dex']").forEach((el) => el.setAttribute("href", dex));
  document.querySelectorAll("[data-link='uni']").forEach((el) => el.setAttribute("href", uni));
  document.querySelectorAll("[data-link='scan']").forEach((el) => el.setAttribute("href", scan));
  document.querySelectorAll("[data-link='x']").forEach((el) => el.setAttribute("href", SITE.x));

  const frame = document.getElementById("dex-frame");
  if (frame) {
    frame.src = `${dex}?embed=1&theme=dark&info=0`;
  }

  const label = SITE.ca || "Contract pending on Arc";
  document.querySelectorAll("[data-ca]").forEach((el) => {
    el.textContent = label;
  });
  document.querySelectorAll("[data-copy]").forEach((el) => {
    el.dataset.copy = SITE.ca;
  });
}

async function copyCa(btn) {
  const value = btn.dataset.copy;
  const tip = btn.querySelector(".ca-copy");
  if (!value) {
    if (tip) tip.textContent = "Soon";
    setTimeout(() => {
      if (tip) tip.textContent = "Copy";
    }, 1200);
    return;
  }
  try {
    await navigator.clipboard.writeText(value);
    if (tip) tip.textContent = "Copied";
  } catch (err) {
    if (tip) tip.textContent = "Failed";
  }
  setTimeout(() => {
    if (tip) tip.textContent = "Copy";
  }, 1400);
}

function dust() {
  const canvas = document.getElementById("dust");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const dots = [];
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);
  for (let i = 0; i < 46; i += 1) {
    dots.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.6 + 0.3,
      s: Math.random() * 0.25 + 0.05,
      a: Math.random() * 0.35 + 0.08,
    });
  }
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach((d) => {
      d.y -= d.s;
      if (d.y < -4) {
        d.y = canvas.height + 4;
        d.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.fillStyle = `rgba(90, 212, 255, ${d.a})`;
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(tick);
  };
  tick();
}

function cursor() {
  const ring = document.querySelector(".cursor");
  const dot = document.querySelector(".cursor-dot");
  if (!ring || !dot || window.matchMedia("(pointer: coarse)").matches) return;
  let x = 0;
  let y = 0;
  let rx = 0;
  let ry = 0;
  window.addEventListener("mousemove", (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  });
  const follow = () => {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  };
  follow();
}

function nav() {
  const toggle = document.querySelector(".nav-toggle");
  const sheet = document.querySelector(".nav-sheet");
  if (!toggle || !sheet) return;
  toggle.addEventListener("click", () => sheet.classList.toggle("open"));
  sheet.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => sheet.classList.remove("open"));
  });
}

function init() {
  wireLinks();
  dust();
  cursor();
  nav();
  document.querySelectorAll(".ca-row").forEach((btn) => {
    btn.addEventListener("click", () => copyCa(btn));
  });
}

document.addEventListener("DOMContentLoaded", init);
