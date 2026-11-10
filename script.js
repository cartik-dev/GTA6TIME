const LAUNCH_DATE = new Date(2026, 10, 19, 0, 0, 0, 0);

const elements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
  panelLabel: document.getElementById("panelLabel"),
  dateLabel: document.getElementById("dateLabel"),
  statusText: document.getElementById("statusText"),
  fireworks: document.getElementById("fireworks")
};

const pad = (value) => String(value).padStart(2, "0");
let hasLaunched = false;

function updateCountdown() {
  const difference = LAUNCH_DATE.getTime() - Date.now();

  if (difference <= 0) {
    if (!hasLaunched) {
      hasLaunched = true;
      document.body.classList.add("launched");

      elements.panelLabel.textContent = "Этот день настал";
      elements.statusText.textContent = "GTA VI доступна";
      elements.dateLabel.textContent = "19 ноября 2026 · Запуск состоялся";

      startFireworks();
    }

    return;
  }

  const totalSeconds = Math.floor(difference / 1000);

  elements.days.textContent = pad(Math.floor(totalSeconds / 86400));
  elements.hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
  elements.minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
  elements.seconds.textContent = pad(totalSeconds % 60);
}

function startFireworks() {
  const canvas = elements.fireworks;
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  let width = 0;
  let height = 0;
  let lastBurst = 0;
  let particles = [];
  let animationFrame = 0;

  function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function createBurst() {
    const centerX = Math.random() * width;
    const centerY = Math.random() * height * 0.52 + height * 0.08;
    const hue = Math.random() * 360;
    const particleCount = 70;

    for (let index = 0; index < particleCount; index += 1) {
      const angle = (Math.PI * 2 * index) / particleCount + Math.random() * 0.08;
      const speed = 1.2 + Math.random() * 4.2;

      particles.push({
        x: centerX,
        y: centerY,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        life: 65 + Math.random() * 35,
        maxLife: 100,
        hue,
        size: 1.2 + Math.random() * 2.2
      });
    }
  }

  function renderFrame(timestamp) {
    if (!hasLaunched) {
      return;
    }

    if (timestamp - lastBurst > 650) {
      createBurst();

      if (Math.random() > 0.4) {
        createBurst();
      }

      lastBurst = timestamp;
    }

    context.clearRect(0, 0, width, height);
    particles = particles.filter((particle) => particle.life > 0);

    for (const particle of particles) {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.velocityY += 0.035;
      particle.velocityX *= 0.992;
      particle.life -= 1;

      context.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      context.fillStyle = `hsl(${particle.hue} 100% 70%)`;
      context.shadowBlur = 12;
      context.shadowColor = context.fillStyle;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }

    context.globalAlpha = 1;
    context.shadowBlur = 0;
    animationFrame = window.requestAnimationFrame(renderFrame);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  createBurst();
  createBurst();
  animationFrame = window.requestAnimationFrame(renderFrame);

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(animationFrame);
  }, { once: true });
}

updateCountdown();
window.setInterval(updateCountdown, 250);