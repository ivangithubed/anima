document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const themeTransitionOverlay = document.querySelector('.theme-transition-overlay');
  
  // Функція, яка запускає хвильову анімацію
  function animateThemeTransition(targetTheme) {
    // Отримуємо позицію кнопки-перемикача для старту анімації
    const toggleRect = themeToggle.getBoundingClientRect();
    const toggleCenterX = toggleRect.left + toggleRect.width / 2;
    const toggleCenterY = toggleRect.top + toggleRect.height / 2;
    
    // Встановлюємо початкову точку для хвилі (у відсотках)
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const startX = (toggleCenterX / viewportWidth) * 100;
    const startY = (toggleCenterY / viewportHeight) * 100;
    
    // Додаємо клас для відповідного типу анімації
    if (targetTheme === 'dark-theme') {
      document.body.classList.add('animating-to-dark');
      document.body.classList.remove('animating-to-light');
    } else {
      document.body.classList.add('animating-to-light');
      document.body.classList.remove('animating-to-dark');
    }
    
    // Змінюємо шлях хвилі, щоб вона починалася від кнопки
    const wavePath = themeTransitionOverlay.querySelector('.wave');
    wavePath.setAttribute('d', `M0,800 C${startX * 5},800 ${startX * 10},400 1440,800 L1440,0 C${startX * 10},0 ${startX * 5},0 0,0 Z`);
    
    // Активуємо хвильову анімацію
    themeTransitionOverlay.classList.add('active');
    
    // Через секунду (після завершення анімації) приховуємо хвилю
    setTimeout(() => {
      themeTransitionOverlay.classList.remove('active');
      document.body.classList.remove('animating-to-dark', 'animating-to-light');
    }, 1000);
  }
  
  // Перевіряємо, чи є збережена користувацька тема
  const currentTheme = localStorage.getItem('theme');
  
  // Якщо користувач уже вибрав тему раніше
  if (currentTheme) {
    document.body.classList.add(currentTheme);
    
    // Якщо поточна тема темна, додаємо клас toggled до кнопки
    if (currentTheme === 'dark-theme') {
      themeToggle.classList.add('toggled');
    }
  } else {
    // Якщо користувач не вибрав тему, використовуємо системну
    if (prefersDarkScheme.matches) {
      document.body.classList.add('dark-theme');
      themeToggle.classList.add('toggled');
    } else {
      document.body.classList.add('light-theme');
    }
  }
  
  // Обробник кліку на кнопку
  themeToggle.addEventListener('click', () => {
    // Анімація обертання іконки
    themeToggle.classList.toggle('toggled');
    
    // Визначаємо, яка тема буде встановлена
    let targetTheme;
    if (document.body.classList.contains('light-theme')) {
      targetTheme = 'dark-theme';
    } else {
      targetTheme = 'light-theme';
    }
    
    // Запускаємо хвильову анімацію перед зміною теми
    animateThemeTransition(targetTheme);
    
    // Змінюємо тему після невеликої затримки
    setTimeout(() => {
      if (document.body.classList.contains('light-theme')) {
        document.body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark-theme');
      } else {
        document.body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('theme', 'light-theme');
      }
    }, 300);
  });
  
  // Додаємо анімацію на наведення для SVG елементів
  themeToggle.addEventListener('mouseenter', () => {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.style.fill = 'var(--accent-color)';
  });
  
  themeToggle.addEventListener('mouseleave', () => {
    const themeIcon = themeToggle.querySelector('.theme-icon');
    themeIcon.style.fill = '';
  });
});
