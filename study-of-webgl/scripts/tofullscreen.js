// https://coliss.com/articles/build-websites/operation/css/viewport-units-on-mobile.html
const toFullScreen = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};
