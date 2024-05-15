const canvas = document.getElementById("spidersCanvas");
const ctx = canvas.getContext("2d");

const points = [];
const position = { x: 0, y: 0 };

const hsvToRgb = (h, s, v) => {
  let r, g, b;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

const changeColor = (point) => {
  gsap.to(point, {
    colorHue: "+=0.05",
    duration: 1,
    repeat: -1,
    modifiers: {
      colorHue: (hue) => (parseFloat(hue) % 1).toFixed(2),
    },
  });
};

const updateSize = () => {
  const { width, height } = canvas.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
};

const createPoints = () => {
  const { width, height } = canvas;
  const noiseFactor = Math.min(width / 50, 30);
  points.length = 0;

  for (let x = 0; x < width; x += width / noiseFactor) {
    for (let y = 0; y < height; y += height / noiseFactor) {
      const px = x + (Math.random() * width) / noiseFactor;
      const py = y + (Math.random() * height) / noiseFactor;
      points.push({
        x: px,
        originX: px,
        y: py,
        originY: py,
        colorHue: Math.random(),
        closest: [],
      });
    }
  }

  points.forEach((p1) => {
    const closest = [];
    points.forEach((p2) => {
      if (p1 !== p2) {
        const distance = getDistance(p1, p2);
        if (closest.length < 5) {
          closest.push(p2);
        } else {
          const farthest = _.maxBy(closest, (p) => getDistance(p1, p));
          if (distance < getDistance(p1, farthest)) {
            _.pull(closest, farthest);
            closest.push(p2);
          }
        }
      }
    });
    p1.closest = closest;
  });

  points.forEach((point) => {
    changeColor(point);
    point.circle = new Circle(
      ctx,
      point,
      2 + Math.random() * 2,
      `rgba(255,255,255,0.3)`
    );
    shiftPoint(point);
  });
};

const Circle = function (ctx, point, radius, color) {
  this.ctx = ctx;
  this.point = point;
  this.radius = radius;
  this.color = color;
  this.draw = () => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  };
};

const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

const drawLines = (point) => {
  if (point.opacity > 0) {
    ctx.strokeStyle = `rgba(255,255,255,${point.opacity})`;
    ctx.lineWidth = 0.5;
    point.closest.forEach((cp) => {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(cp.x, cp.y);
      ctx.stroke();
    });
  }
};

const shiftPoint = (point) => {
  const duration = 0.3 + Math.random() * 1;
  const x = point.originX - 50 + Math.random() * 100;
  const y = point.originY - 50 + Math.random() * 100;
  gsap.to(point, { x, y, duration, onComplete: () => shiftPoint(point) });
};

const animate = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const radius = 300; // Радиус вокруг курсора, в котором точки видны
  points.forEach((point) => {
    const distance = getDistance(position, point);
    if (distance < radius) {
      point.opacity = (1 - distance / radius) * 0.8; // Прозрачность в зависимости от расстояния
    } else {
      point.opacity = 0; // Невидимые точки за пределами радиуса
    }

    const [r, g, b] = hsvToRgb(point.colorHue, 0.8, 1); // Преобразование в RGB
    point.circle.color = `rgba(${r},${g},${b},${point.opacity})`; // Устанавливаем цвет в зависимости от прозрачности

    drawLines(point);
    point.circle.draw();
  });
  requestAnimationFrame(animate);
};

window.addEventListener("mousemove", (e) => {
  position.x = e.clientX;
  position.y = e.clientY;
});

window.addEventListener("resize", updateSize);

updateSize();
createPoints();
animate();
