export const confirmation = (text) => {
  const result = confirm(text);

  if (!result) {
    history.back();
  }
};
