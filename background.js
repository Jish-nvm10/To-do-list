const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let mouse = { x: null, y: null };
const dots = [];
const numDots = 80;

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

class Dot {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.radius = 2;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#1d4ed8";
    ctx.fill();
  }
}

function connectDots() {
  for (let i = 0; i < numDots; i++) {
    for (let j = i + 1; j < numDots; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = "rgba(29,78,216,0.3)";
        ctx.stroke();
      }
    }

    // Line to mouse
    const dxm = dots[i].x - mouse.x;
    const dym = dots[i].y - mouse.y;
    const mouseDist = Math.sqrt(dxm * dxm + dym * dym);
    if (mouseDist < 150) {
      ctx.beginPath();
      ctx.moveTo(dots[i].x, dots[i].y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = "rgba(29,78,216,0.3)";
      ctx.stroke();
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  dots.forEach(dot => {
    dot.move();
    dot.draw();
  });
  connectDots();
  requestAnimationFrame(animate);
}

for (let i = 0; i < numDots; i++) {
  dots.push(new Dot());
}

animate();