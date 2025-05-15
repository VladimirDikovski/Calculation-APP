
import * as model from "./Model.js";
import * as view from "./View.js";
import { Product } from "./product.js";

let dataFromLocal = [];
let curentUser;
let countPurchase = 0;
let productList = [];

window.addEventListener("load", function (e) {
  //getDate from localStorage

  dataFromLocal = model.getDataFromLocal();
  //get data from localStorageProducts
  productList = takeDataFromLocalStorage("products");
});

model.btnSumbitLogin.addEventListener("click", function (e) {
  e.preventDefault();
  //check for exist user
  curentUser = dataFromLocal.find(
    (user) => user.email === model.emailField.value
  );
  if (!curentUser)
    return view.writeError(model.loginError, "Няма такъв Потребител!");

  if (curentUser.password !== model.passwordField.value)
    return view.writeError(model.loginError, "Паролата не е същата!");

  //render HTML for products
  productList
    .filter((product) => product.idUser == curentUser.id)
    .map((pr) => {
      view.renderHTMLtable(
        pr.idUser,
        pr.datePurchase,
        pr.nameProduct,
        pr.priceProduct
      );
    });

  //Put mainHeader hidden class
  model.mainHeader.classList.remove("show");
  model.mainHeader.classList.add("hidden");

  //put tableForm show class
  model.bodyTable.classList.remove("hidden");
  model.bodyTable.classList.add("show");

  //show curentBalance
  view.showCurentBalanceSalary(model.curentBalance, curentUser.salary);

  //show name user
  view.showName(model.name, curentUser.name);

  //clear the inputs field
  clear(model.emailField, model.passwordField);
});

model.btnSumbitProduct.addEventListener("click", function (e) {
  e.preventDefault();

  //renderHtml

  //validation inputs fields for past date
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const inputDate = new Date(model.dateField.value);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate < now)
    return view.showValidationError(
      model.validationMessageField,
      "Датата не трябва да е в миналото"
    );

  //validateion from not empty field
  if (model.dateField.value === "" || model.priceField.value === "")
    return view.showValidationError(
      model.validationMessageField,
      "Полето не трябва да е празно"
    );

  //check do you have a money for new purchases
  const isEnought = checkCurentBalanceAndSalary(
    Number(model.priceField.value),
    curentUser.salary
  );

  if (Number(model.priceField.value) <= 0)
    return view.showValidationError(
      model.validationMessageField,
      "Стойноста не може да е отрицателна или 0"
    );

  if (!isEnought)
    return view.showValidationError(
      model.validationMessageField,
      "Нямаш достатъчно средства"
    );

  //create new Purchase object
  const newPurchase = new Product(
    curentUser.id,
    model.productField.value,
    model.dateField.value,
    Number(model.priceField.value)
  );
  productList.push(newPurchase);

  //decreaseSalary after purchase
  decreaseSalary(curentUser, Number(model.priceField.value));

  //update curentBalance
  view.showCurentBalanceSalary(model.curentBalance, curentUser.salary);

  //render values to html table
  view.renderHTMLtable(
    productList[productList.length - 1].idUser,
    productList[productList.length - 1].datePurchase,
    productList[productList.length - 1].nameProduct,
    productList[productList.length - 1].priceProduct
  );

  clear(model.dateField, model.priceField);
  model.validationMessageField.textContent = "";

  //update localStorage for curent User
  updateLocalSotrageCurentUser(curentUser);

  //insert data for products in localStorage
  addDataInLocalStorage(productList, "products");
});

model.btnDeposit.addEventListener("click", function (e) {
  e.preventDefault();
  //validation
  if (model.inputDepositField.value === "")
    return view.showValidationError(
      model.validationMessageField,
      "Полето не трябва да е празно"
    );

  if (Number(model.inputDepositField.value) <= 0)
    return view.showValidationError(
      model.validationMessageField,
      "Стойноста трябва да е по голяма от 0"
    );

  curentUser.salary += Number(model.inputDepositField.value);
  updateLocalSotrageCurentUser(curentUser);
  model.inputDepositField.value = "";
  view.showCurentBalanceSalary(model.curentBalance, curentUser.salary);
});

function clear(field1, field2) {
  field1.value = "";
  field2.value = "";
}

function checkCurentBalanceAndSalary(price, salary) {
  const isEnought = price <= salary ? true : false;
  return isEnought;
}

function decreaseSalary(curentUser, price) {
  curentUser.salary -= price;
}

function updateLocalSotrageCurentUser(curentUser) {
  dataFromLocal
    .filter((lc) => lc.id === curentUser.id)
    .map((cu) => (cu.salary = curentUser.salary));
  localStorage.setItem("register", JSON.stringify(dataFromLocal));
}

function addDataInLocalStorage(data, logalStorageName) {
  localStorage.setItem(logalStorageName, JSON.stringify(data));
}

function takeDataFromLocalStorage(logalStorageName) {
  const dataProduct = JSON.parse(localStorage.getItem(logalStorageName));
  if (!dataProduct) return [];
  return dataProduct;
}
