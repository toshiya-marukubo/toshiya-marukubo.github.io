(() => {
  const result = confirm('If you are not good at light stimulation please push cancel button.');

  if (!result) {
    history.back();
  }
})();
