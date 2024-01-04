import "./style.css";
import { getCode, getNames } from "country-list";
import fuzzysort from "fuzzysort";
import { validate } from "postal-codes-js";

(() => {
  const emailInput = document.querySelector("#email");
  const emailPattern =
    /^[\w-]+(?:\.[\w-]+)*@[a-zA-Z\d](?:-?[a-zA-z\d])*(?:\.[-a-zA-Z\d]+)*\.\d*?[a-zA-Z](?:-?[a-zA-Z])*\d?$/;
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
    if (!emailPattern.test(event.target.value)) {
      Object.keys(check).forEach((key) => {
        const match = event.target.value.match(check[key].re);
        if (match) {
          const li = document.createElement("li");
          li.append(check[key].error);
          errorBoard.append(li);
        }
      });
      event.target.setCustomValidity("Please fix this");
    } else {
      event.target.setCustomValidity("");
    }
  }
  emailInput.addEventListener("input", validateEmail);
})();

(() => {
  const countryInput = document.querySelector("#country");
  const dialog = document.querySelector("dialog");
  const countries = getNames();

  dialog.style.left = `${countryInput.offsetLeft}px`;
  dialog.style.top = `${countryInput.offsetHeight + countryInput.offsetTop}px`;

  function populateDialog(keyword) {
    dialog.firstElementChild.replaceChildren();
    const results = fuzzysort.go(keyword, countries, {
      limit: 6,
      threshold: -100,
    });
    results.forEach((result) => {
      const li = document.createElement("li");
      li.append(result.target);
      dialog.firstElementChild.append(li);
    });
  }

  function validateCountry(event) {
    dialog.show();
    populateDialog(event.target.value);
    countryInput.nextElementSibling.replaceChildren();
    event.target.focus();
  }

  countryInput.addEventListener("input", validateCountry);
  countryInput.addEventListener("change", () => {
    document.querySelector("#zip").value = "";
  });
  dialog.addEventListener("click", (event) => {
    countryInput.value = event.target.textContent;
    dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (!countries.includes(countryInput.value)) {
      countryInput.setCustomValidity("Please fix this.");
      countryInput.nextElementSibling.append(
        "Please select a country from the list"
      );
    } else {
      countryInput.setCustomValidity("");
    }
  });
  document.addEventListener("click", () => {
    dialog.close();
  });
})();

(() => {
  const zipInput = document.querySelector("#zip");
  const countryInput = document.querySelector("#country");
  const errorBoard = zipInput.nextElementSibling;

  function validateZip(event) {
    errorBoard.replaceChildren();
    if (countryInput.validity.customError || countryInput.value === "") {
      errorBoard.append("Please select a country first");
      event.target.setCustomValidity("Plese fix this");
      // eslint-disable-next-line no-param-reassign
      event.target.value = "";
    } else {
      const code = getCode(countryInput.value);
      const val = validate(code, event.target.value);
      if (val !== true) {
        errorBoard.append(val);
        event.target.setCustomValidity("Plese fix this");
      } else {
        event.target.setCustomValidity("");
      }
    }
  }

  zipInput.addEventListener("input", validateZip);
  countryInput.addEventListener("change", (event) => {
    if (!event.target.checkValidity()) {
      event.target.setCustomValidity("Please fix this");
    } else {
      event.target.setCustomValidity("");
    }
  });
})();

(() => {
  const password = document.querySelector("#password");
  const confirm = document.querySelector("#confirm");
  const errorBoardPassword = password.nextElementSibling;
  const errorBoardConfirm = confirm.nextElementSibling;

  function validatePassword(event) {
    errorBoardPassword.replaceChildren();
    if (event.target.value.length < 8) {
      errorBoardPassword.append("Please supply a minimum of 8 characters");
      event.target.setCustomValidity("Please fix this");
    } else {
      event.target.setCustomValidity("");
    }

    if (event.target.value.length > 16) {
      // eslint-disable-next-line no-param-reassign
      event.target.value = event.target.value.slice(0, -1);
    }
  }

  function validateConfirm(event) {
    errorBoardConfirm.replaceChildren();
    if (password.value === "") {
      errorBoardConfirm.append("Please enter a password first");
      // eslint-disable-next-line no-param-reassign
      event.target.value = "";
      event.target.setCustomValidity("Please fix this");
    } else if (event.target.value !== password.value) {
      errorBoardConfirm.append("Passwords do not match");
      event.target.setCustomValidity("Please fix this");
    } else {
      event.target.setCustomValidity("");
    }
  }

  password.addEventListener("input", validatePassword);
  confirm.addEventListener("input", validateConfirm);
})();
