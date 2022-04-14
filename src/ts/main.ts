function initToggler() {
  const ele = document.querySelector('.playground__toggler#playground-toggler');
  const pl = document.querySelector('.playground#playground');
  ele.addEventListener('click', () => {
    ele.classList.toggle('is-active')
    pl.classList.toggle('playground--active');
  })
}

function initMenuScroll() {
  const ele = document.querySelector('.menu#menu');
  const inner = document.querySelectorAll('.menu#menu .menu__inner');
  const handler = (eventTarget: EventTarget | HTMLElement) => {
    const target = (eventTarget as HTMLElement)
    const scrollTop = target.scrollTop;
    if (scrollTop > 0) {
      ele.classList.add('menu--top-shaded')
    }
    else {
      ele.classList.remove('menu--top-shaded')
    }

    if (target.scrollHeight - target.getBoundingClientRect().height - scrollTop > 0) {
      ele.classList.add('menu--bot-shaded')
    }
    else {
      ele.classList.remove('menu--bot-shaded')
    }
  }

  inner.forEach((el) => {
    handler(el);
    el.addEventListener('scroll', (e) => {
      handler(e.currentTarget);
    })
    window.addEventListener('resize', (e) => {
      handler(el);
    })
  })
}

function initMenuLink() {
  const ele = document.querySelectorAll('.menu#menu .menu__link');
  const content = document.querySelector('iframe#playground-content');
  const loading = document.querySelector('#loading');
  const toggler = document.querySelector('.playground__toggler#playground-toggler');
  const pl = document.querySelector('.playground#playground');
  ele.forEach((el) => {
    el.addEventListener('click', () => {
      toggler.classList.remove('is-active');
      pl.classList.remove('playground--active');
      loading.classList.add('playground__loading--active')
      const route = el.getAttribute('data-route');
      content.setAttribute('src', 'examples/' + route + '.html');
    })
  })
}

function initIframeOnLoad() {
  const content = document.querySelector('iframe#playground-content');
  const loading = document.querySelector('#loading');
  content.addEventListener('load', () => {
    loading.classList.remove('playground__loading--active');
  }, true)
}

function main() {
  initToggler();
  initMenuLink();
  initMenuScroll();
  initIframeOnLoad();
}

window.onload = main;