const formEl = document.querySelector(".form");
const labelRequired = document.querySelectorAll(".required");
const inputForm = document.querySelectorAll(".input-form");
const btnRegister = document.querySelector(".btn-submit-register");
const validationMessagesEl = document.querySelector(".error-status");
const btnLogIn = document.querySelector(".btn-logIn");

export class PaidLeaves {
  id;
  constructor(email, password, name, salary) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.salary = Number(salary);
  }

  calculateId(id) {
    this.id = id;
  }

  getId() {
    return this.id;
  }
}

const [inputEmail, inputPassword, inputSalary, inputName] = inputForm;

class Application {
  #objectArrays = [];

  constructor() {
    if (btnRegister) {
      btnRegister.addEventListener("click", this._btnSubmit.bind(this));
    }

    if (btnLogIn) {
      btnLogIn.addEventListener("click", this._gotoWebsite.bind(this));
    }

    this._getDataFromLocalStorage();

    // ✅ Optional safety: prevent form submission completely
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }

  _btnSubmit(e) {
    e.preventDefault();
    console.log("Register clicked"); // Debug line

    if (
      !inputEmail.value ||
      !inputPassword.value ||
      !inputSalary.value ||
      !inputName.value
    ) {
      this._showRequiredFields("Fields should not be empty");
      return;
    }

    // Check if email already exists
    const isRegistered = this.#objectArrays.find(
      (obj) => obj.email === inputEmail.value
    );
    if (isRegistered) {
      return this._showRequiredFields("This email is already registered!");
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputEmail.value)) {
      return this._showRequiredFields("Please enter a valid email.");
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(inputPassword.value)) {
      return this._showRequiredFields(
        "Password must be at least 6 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special character."
      );
    }

    if (isNaN(inputSalary.value) || Number(inputSalary.value) <= 0) {
      return this._showRequiredFields("Salary must be a number > 0.");
    }

    const newUser = new PaidLeaves(
      inputEmail.value,
      inputPassword.value,
      inputName.value,
      inputSalary.value
    );

    newUser.calculateId(this.#objectArrays.length + 1);
    this.#objectArrays.push(newUser);
    this._saveToLocalStorage();

    this._clearFields();
    validationMessagesEl.style.color = "green";
    this._showRequiredFields("You have successfully registered!");
  }

  _clearFields() {
    inputEmail.value = "";
    inputPassword.value = "";
    inputSalary.value = "";
    inputName.value = "";
  }

  _showRequiredFields(msg) {
    labelRequired.forEach((el) => (el.style.display = "inline-block"));
    validationMessagesEl.style.opacity = "1";
    validationMessagesEl.innerHTML = msg;
    validationMessagesEl.style.color = "red";
  }

  _saveToLocalStorage() {
    localStorage.setItem("register", JSON.stringify(this.#objectArrays));
  }

  _getDataFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("register"));
    this.#objectArrays = data || [];
  }

  _gotoWebsite() {
    console.log("Redirecting...");
    window.location.href = "../../Application/index.html";
  }
}

new Application();
