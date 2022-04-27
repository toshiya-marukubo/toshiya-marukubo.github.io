export const popup = () => {
  const question = document.getElementsByClassName('question')[0];
  const what = document.getElementsByClassName('what')[0];
  const close = document.getElementsByClassName('close')[0];

  question.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    what.classList.add('show');
  }, false);

  close.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    what.classList.remove('show');
  }, false);

  document.body.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (what.classList.contains('show')) {
      what.classList.remove('show');
    }
  }, false);
};
