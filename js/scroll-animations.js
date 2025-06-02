// Скролл-драйвен анімації для секцій сайту
document.addEventListener('DOMContentLoaded', function() {
  // Зробимо перші налаштування
  // Показуємо першу секцію без анімацій
  const heroSection = document.getElementById('hero');
  if (heroSection && heroSection.querySelector('.section-content')) {
    heroSection.querySelector('.section-content').style.opacity = '1';
    heroSection.querySelector('.section-content').style.transform = 'translateX(0)';
  }

  // Одразу показуємо весь контент на початку
  document.querySelectorAll('.section-content').forEach(content => {
    content.style.opacity = '1';
    content.style.transform = 'translateX(0)';
  });

  // Встановлюємо спостерігач для реалізації анімації при прокрутці
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // Отримуємо секцію та її контент
      const section = entry.target;
      const content = section.querySelector('.section-content');
      
      // Якщо секція видима, запускаємо анімацію
      if (entry.isIntersecting) {
        requestAnimationFrame(() => {
          content.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
          content.style.transform = 'translateX(0)';
          content.style.opacity = '1';
        });
      } else {
        // Якщо секція не видима і це не перша секція, готуємо її до наступної анімації
        if (section.id !== 'hero') {
          content.style.transition = 'none'; // Вимикаємо анімацію при підготовці
          content.style.transform = 'translateX(-100px)';
          content.style.opacity = '0';
        }
      }
    });
  }, {
    threshold: 0.2, // Початок анімації, коли 20% секції у відимій зоні
    rootMargin: '-50px 0px' // Зміщення відносно відимої зони
  });

  // Додаємо всі секції до спостереження
  document.querySelectorAll('.section').forEach(section => {
    sectionObserver.observe(section);
  });
  
  // Додаємо плавну анімацію для меню при кліку
  const menuLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        e.preventDefault();
        // Плавно прокручуємо до секції
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Оновлюємо активний пункт меню
        menuLinks.forEach(menuLink => menuLink.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  
  // Оновлюємо активний пункт меню при прокрутці
  function updateActiveMenuItem() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const navHeight = document.querySelector('.main-header').offsetHeight;
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (window.pageYOffset >= (sectionTop - navHeight - 100)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  // Викликаємо функцію оновлення меню при прокручуванні
  window.addEventListener('scroll', updateActiveMenuItem);
  
  // Викликаємо одразу для встановлення початкового стану
  updateActiveMenuItem();
});
