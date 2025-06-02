// Керування меню та плавна прокрутка
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const menuItems = document.querySelector('.menu-items');
  const body = document.body;

  if (menuToggle && menuItems) {
    // Функція перемикання мобільного меню
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      menuItems.classList.toggle('active');
      
      // Блокуємо прокрутку сторінки, коли мобільне меню відкрите
      body.classList.toggle('menu-open');
    });

    // Закриваємо меню при кліку на пункт меню та забезпечуємо плавну прокрутку
    const menuLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    menuLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Знаходимо ідентифікатор секції
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          e.preventDefault(); // Запобігаємо стандартній перехід за якорем
          
          // Прокручуємо сторінку до секції з анімацією
          window.scrollTo({
            top: targetSection.offsetTop - 80, // Відступ від верху
            behavior: 'smooth'
          });
          
          // Закриваємо мобільне меню, якщо воно відкрите
          if (menuItems.classList.contains('active')) {
            menuToggle.classList.remove('active');
            menuItems.classList.remove('active');
            body.classList.remove('menu-open');
          }
          
          // Оновлюємо активний пункт меню
          menuLinks.forEach(item => item.classList.remove('active'));
          this.classList.add('active');
        }
      });
    });

    // Закриваємо меню при зміні розміру вікна на десктопний
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768 && menuItems.classList.contains('active')) {
        menuToggle.classList.remove('active');
        menuItems.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
    
    // Функція перемикання пунктів меню при прокручуванні
    window.addEventListener('scroll', function() {
      let current = '';
      const sections = document.querySelectorAll('.section');
      const navHeight = document.querySelector('.main-header').offsetHeight;
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - navHeight - 100)) {
          current = section.getAttribute('id');
        }
      });

      menuLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }
});
