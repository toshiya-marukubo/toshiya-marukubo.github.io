(() => {
  window.addEventListener('load', () => {
    const question = document.getElementsByClassName('question')[0];
    const what = document.getElementsByClassName('what')[0];
    const close = document.getElementsByClassName('close')[0];

    question.addEventListener('click', (e) => {
      e.preventDefault();

      what.classList.toggle('show');
    }, false);

    close.addEventListener('click', (e) => {
      e.preventDefault();

      what.classList.toggle('show');
    }, false);
  });
})();
