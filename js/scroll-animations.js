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
          top: targetSection.offsetTop - 80, // Враховуємо висоту фіксованого хедера
          behavior: 'smooth'
        });

        // Невеликий трюк: оскільки 'scroll' подія може бути непередбачуваною на мобільних,
        // і 'smooth' scroll не має колбека, ми оновимо активний пункт через короткий таймаут.
        // Це дасть час прокрутці завершитися, і потім updateActiveMenuItem встановить правильний активний стан.
        setTimeout(() => {
          updateActiveMenuItem();
          // Також, якщо мобільне меню було відкрите, закриємо його
          const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
          const menuItems = document.querySelector('.menu-items');
          if (mobileMenuToggle && menuItems && menuItems.classList.contains('active')) {
            mobileMenuToggle.classList.remove('active');
            menuItems.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
        }, 700); // Час підбирається експериментально, залежно від тривалості анімації прокрутки
      }
    });
  });
  
  // Оновлюємо активний пункт меню при прокрутці
  function updateActiveMenuItem() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const navHeight = document.querySelector('.main-header').offsetHeight;
    let current = ''; // Зберігає ID поточної секції

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      // const sectionHeight = section.offsetHeight; // Не використовується в поточній логіці
    
      // Вважаємо секцію активною, якщо її верхня межа знаходиться в певному діапазоні від верхньої межі вікна перегляду
      // Зміщення -100 допомагає зробити посилання активним трохи раніше, ніж секція досягне верху
      if (window.pageYOffset >= (sectionTop - navHeight - 100)) {
        current = section.getAttribute('id');
      }
    });

    // Нам не потрібно визначати колір теми вручну, тому що ми будемо використовувати CSS класи

    navLinks.forEach(link => {
      // Перевіряємо, чи href посилання відповідає ID поточної секції
      if (link.getAttribute('href') === `#${current}`) {
        // Це посилання має бути активним
        link.classList.add('active'); // Додаємо клас для стилю активного елементу
        link.classList.remove('underline-instant-hide'); // Видаляємо клас для плавної появи
        
        // Застосовуємо стилі для видимості одразу, щоб анімація появи спрацювала
        link.style.setProperty('--underline-scale', '1');
        link.style.setProperty('--underline-opacity', '1');
        link.style.setProperty('--underline-visibility', 'visible');
        
        // Видаляємо будь-які інлайнові стилі
        link.style.removeProperty('color');
      } else {
        // Це посилання не має бути активним
        link.classList.remove('active');
        link.classList.add('underline-instant-hide'); // Додаємо клас для миттєвого зникнення
      
        // Даємо браузеру обробити додавання класу перед зміною CSS змінних
        requestAnimationFrame(() => {
          link.style.setProperty('--underline-scale', '0');
          link.style.setProperty('--underline-opacity', '0');
          link.style.setProperty('--underline-visibility', 'hidden');
        });
        
        // Видаляємо інлайнові стилі, щоб використовувався колір тескту з CSS
        link.style.removeProperty('color');
      }  
    });
  }

  // Викликаємо функцію оновлення меню при прокручуванні
  window.addEventListener('scroll', updateActiveMenuItem);
  
  // Викликаємо одразу для встановлення початкового стану
  updateActiveMenuItem();
});
