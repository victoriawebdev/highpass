const center = [55.769470, 37.638966];

document.addEventListener("DOMContentLoaded", () => {
  const mapOverlay = document.getElementById('map-overlay'),
    nav = document.querySelector('.nav'),
    navClose = document.getElementById('nav-close'),
    menuLinks = document.querySelectorAll('.nav__link_basic'),
    logo = document.querySelector('.logo_header'),
    searchForm = document.getElementById('search-form'),
    searchOpen = document.querySelector('.search_open'),
    burger = document.getElementById('burger'),
    body = document.body;

  const validate = new window.JustValidate('#form', {
    errorLabelStyle: {
      color: '#FF3030'
    }
  });

  const validateSubscription = new window.JustValidate('#form-subscription', {
    errorLabelStyle: {
      color: '#FF3030'
    }
  });

  const validateSearch = new window.JustValidate('#search-form', {
    errorLabelStyle: {
      color: '#FF3030'
    }
  });

  validate.addField('#name', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно'
    },
    {
      rule: 'minLength',
      value: 2,
      errorMessage: 'Введите корректное имя'
    },
    {
      rule: 'customRegexp',
      value: /^[А-Я][а-яё]*$/,
      errorMessage: 'Недопустимый формат'
    }
  ])
  .addField('#email', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно'
    },
    {
      rule: 'email',
      errorMessage: 'Введите корректный email'
    }
  ])
  .addField('#textarea', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно'
    }
  ]);

  validateSubscription.addField('#emailSubscription', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно'
    },
    {
      rule: 'email',
      errorMessage: 'Введите корректный email'
    }
  ]);

  validateSearch.addField('#search-input', [
    {
      rule: 'required',
      errorMessage: 'Поле обязательно'
    }
  ]);

  let previousActiveElement,
    vh = window.innerHeight * 0.01;

  document.documentElement.style.setProperty('--vh', `${vh}px`);

  function init() {
    const map = new ymaps.Map("map", {
      center: center,
      zoom: 13,
      controls: []
    });

    const placemark = new ymaps.Placemark(center, {}, {
      iconLayout: 'default#image',
      iconImageHref: '../img/vector/marker.svg',
      iconImageSize: [12, 12],
      iconImageOffset: [-6, -6]
    });

    const position = map.getGlobalPixelCenter();

    if (window.matchMedia('(max-width:576px').matches) {
      map.setGlobalPixelCenter([position[0] - 109, position[1] + 135]);
    } else if (window.matchMedia('(max-width:768px').matches) {
      map.setGlobalPixelCenter([position[0] - 133, position[1] + 130]);
    } else {
      map.setGlobalPixelCenter([position[0] - 192, position[1] + 129]);
    };

    map.geoObjects.add(placemark);

    placemark.events.add('click', () => {
      mapOverlay.classList.remove('map__overlay_close');
    });
  };

  ymaps.ready(init);

  document.getElementById('open-search-form').addEventListener('click', () => {
    searchForm.classList.add('search-form_show');
  });

  document.getElementById('search-form-close').addEventListener('click', () => {
    searchForm.classList.remove('search-form_show');
  });

  document.getElementById('map-btn-close').addEventListener('click', () => {
    mapOverlay.classList.add('map__overlay_close');
  });

  function showMenu() {
    nav.classList.add('active');
    body.classList.add('stop-scroll');
    previousActiveElement = document.activeElement;

    Array.from(body.children).forEach((child) => {
      if (child !== header) {
        child.inert = true;
      } else {
        logo.inert = true;
        searchOpen.inert = true;
        burger.inert = true;
      };
    });

    setTimeout(() => {
      navClose.focus();
    }, 100);
  };

  function hideMenu() {
    nav.classList.remove('active');
    body.classList.remove('stop-scroll');

    Array.from(body.children).forEach((child) => {
      if (child !== header) {
        child.inert = false;
      } else {
        logo.inert = false;
        searchOpen.inert = false;
        burger.inert = false;
      };
    });

    setTimeout(() => {
      previousActiveElement.focus();
    }, 100);
  };

  burger.addEventListener('click', () => {
    showMenu();
  });

  navClose.addEventListener('click', () => {
    hideMenu();
  });

  function monitorsLinkClicks() {
    if (window.matchMedia('(max-width: 576px').matches) {
      menuLinks.forEach((el) => {
        el.addEventListener('click', () => {
          nav.classList.remove('active');
          body.classList.remove('stop-scroll');

          Array.from(body.children).forEach((child) => {
            if (child !== header) {
              child.inert = false;
            } else {
              logo.inert = false;
              searchOpen.inert = false;
              burger.inert = false;
            };
          });
        });
      });
    };
  };

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    monitorsLinkClicks();
  });

  monitorsLinkClicks();
});
