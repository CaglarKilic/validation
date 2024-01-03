import "./style.css";

(() => {
  const emailInput = document.querySelector("#email");
  const emailPattern =
    "^[\\w\\-]+(?:\\.[\\w\\-]+)*@[a-zA-Z\\d](?:-?[a-zA-z\\d])*(?:\\.[\\-a-zA-Z\\d]+)*\\.\\d*?[a-zA-Z](?:-?[a-zA-Z])*\\d?$";
  emailInput.pattern = emailPattern;
  const check = {
    dot: { re: /\.\./, error: "Consecutive dots(..) are not allowed." },
    dotPos: {
      re: /^\.|\.@|@\.|\.$/,
      error: "Dot(.) is not allowed at the beginning or end of both parts.",
    },
    at: { re: /@{2,}|^[^@]*$/, error: "Need just one @ sign." },
    atPos: { re: /^@|@$/, error: "@ should be somewhere in the middle" },
    hyphen: {
      re: /@.*--/,
      error: "Consecutive hyphens(--) are not allowed in the domain part.",
    },
    hyphenPos: {
      re: /@(?:-|.*-\.|.*\.-|.*-$)/,
      error:
        "For the domain part, hypen(-) is not allowed immediately before or after dot(.) as well as at the beginning or end",
    },
    char: {
      re: /[^\w.\-@]|@.*[^a-zA-Z\d\-.@]/,
      error:
        "Special characters except dot(.), hyphen(-), underscore(_) are not allowed. Underscore in the domain part is also not allowed",
    },
    tld: { re: /\.\d+$/, error: "Top level domain can't be all numbers." },
    end: {
      re: /@[^.]+$/,
      error: "Domain sholud end with any name following a dot(.)",
    },
  };

  function validateEmail(event) {
    const errorBoard = event.target.nextElementSibling;
    errorBoard.replaceChildren();
    if (event.target.validity.patternMismatch) {
      Object.keys(check).forEach((key) => {
        const match = event.target.value.match(check[key].re);
        if (match) {
          const li = document.createElement("li");
          li.append(check[key].error);
          errorBoard.append(li);
        }
      });
    }
  }
  emailInput.addEventListener("input", validateEmail);
})();
