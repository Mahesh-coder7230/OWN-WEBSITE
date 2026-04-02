window.onload = function () {
  const words = [ " C++ ", " Java ", " Python ", " JavaScript "];
  let i = 0;
  let j = 0;
  let currentWord = "";
  let isDeleting = false;
  const textElement = document.getElementById("animated-text");

  function type() {
    if (i < words.length) {
      if (!isDeleting && j <= words[i].length) {
        currentWord = words[i].substring(0, j++);
        textElement.innerHTML = currentWord;
      } else if (isDeleting && j >= 0) {
        currentWord = words[i].substring(0, j--);
        textElement.innerHTML = currentWord;
      }

      if (j === words[i].length) isDeleting = true;
      if (isDeleting && j === 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
      }

      setTimeout(type, isDeleting ? 400 : 200);
    }
  }

  type();
};