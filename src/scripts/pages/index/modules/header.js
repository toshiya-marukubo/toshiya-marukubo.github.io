// Referenced | インクルーシブHTML+CSS & JavaScript
// Author | Heydon Pickering
// Thank you so much.
const header = () => {
  const h1 = document.getElementsByTagName('h1')[0];
  const a = h1.firstElementChild;
  const nav = h1.nextElementSibling;
  const header = h1.parentNode;

  a.setAttribute('aria-expanded', 'false');
  nav.hidden = true;

  h1.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (header.classList.contains('header-open')) {
      header.classList.remove('header-open');
      header.classList.add('header-close');
      a.setAttribute('aria-expanded', 'false');
    } else {
      header.classList.remove('header-close');
      header.classList.add('header-open');
      a.setAttribute('aria-expanded', 'true');
      nav.hidden = false;
    }
  }, false);

  header.addEventListener('animationend', (e) => {
    if (e.animationName === 'header-width-close-animation') {
      nav.hidden = true;
    }
  });

  window.addEventListener('click', (e) => {
    if (header.classList.contains('header-open')) {
      header.classList.remove('header-open');
      header.classList.add('header-close');
      a.setAttribute('aria-expanded', 'false');
    }
  }, false);
};

export { header }
