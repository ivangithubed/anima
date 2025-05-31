document.addEventListener('DOMContentLoaded', () => {
  const hero = document.querySelector('.hero');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.classList.add('particles-canvas');
  hero.appendChild(canvas);
  
  // Розмір canvas
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Налаштування частинок
  const particlesConfig = {
    count: 100,
    color: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim(),
    minSize: 1,
    maxSize: 3,
    speed: 0.5,
    connectDistance: 150,
    mouseRadius: 200
  };
  
  // Масив для зберігання частинок
  let particles = [];
  
  // Позиція миші
  let mousePosition = {
    x: null,
    y: null
  };
  
  // Відстежуємо позицію миші
  canvas.addEventListener('mousemove', (e) => {
    mousePosition.x = e.x;
    mousePosition.y = e.y;
  });
  
  canvas.addEventListener('mouseleave', () => {
    mousePosition.x = null;
    mousePosition.y = null;
  });
  
  // Клас для частинок
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (particlesConfig.maxSize - particlesConfig.minSize) + particlesConfig.minSize;
      this.speedX = (Math.random() - 0.5) * particlesConfig.speed;
      this.speedY = (Math.random() - 0.5) * particlesConfig.speed;
      this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    // Оновлення позиції частинки
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Відбиття від країв
      if (this.x > canvas.width || this.x < 0) {
        this.speedX = -this.speedX;
      }
      
      if (this.y > canvas.height || this.y < 0) {
        this.speedY = -this.speedY;
      }
      
      // Взаємодія з мишею
      if (mousePosition.x != null && mousePosition.y != null) {
        const dx = mousePosition.x - this.x;
        const dy = mousePosition.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < particlesConfig.mouseRadius) {
          const force = particlesConfig.mouseRadius / distance;
          const angleToMouse = Math.atan2(dy, dx);
          
          this.speedX -= Math.cos(angleToMouse) * force * 0.02;
          this.speedY -= Math.sin(angleToMouse) * force * 0.02;
        }
      }
    }
    
    // Малювання частинки
    draw() {
      ctx.fillStyle = particlesConfig.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  
  // Створення початкових частинок
  function init() {
    particles = [];
    for (let i = 0; i < particlesConfig.count; i++) {
      particles.push(new Particle());
    }
    
    // Оновлюємо колір частинок при зміні теми
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          particlesConfig.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent-color').trim();
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
  }
  
  // Функція анімації
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Оновлення та малювання кожної частинки
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    
    // З'єднуємо частинки лініями
    connectParticles();
    
    requestAnimationFrame(animate);
  }
  
  // З'єднання частинок лініями
  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < particlesConfig.connectDistance) {
          const opacity = 1 - (distance / particlesConfig.connectDistance);
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = particlesConfig.color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  }
  
  // Запуск анімації
  init();
  animate();
});
