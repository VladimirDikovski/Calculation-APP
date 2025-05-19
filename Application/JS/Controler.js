import * as model from "./Model.js";
import * as view from "./View.js";
import { Product } from "./product.js";

let dataFromLocal = [];
let curentUser;

let productList = [];
let temporeryField = 0;

window.addEventListener("load", function (e) {
  //getDate from localStorage

  dataFromLocal = model.getDataFromLocal();
  //get data from localStorageProducts
  productList = takeDataFromLocalStorage("products");

  // Restore last used PurchaseId from localStorage
  const lastId = Number(localStorage.getItem("lastProductId")) || 0;
  Product.lastId = lastId;
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
        pr.priceProduct,
        pr.PurchaseId
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
  // Save last used ID in localStorage
  localStorage.setItem("lastProductId", Product.lastId);

  //decreaseSalary after purchase
  decreaseSalary(curentUser, Number(model.priceField.value));

  //update curentBalance
  view.showCurentBalanceSalary(model.curentBalance, curentUser.salary);

  //render values to html table
  view.renderHTMLtable(
    newPurchase.idUser,
    newPurchase.datePurchase,
    newPurchase.nameProduct,
    newPurchase.priceProduct,
    newPurchase.PurchaseId
  );

  //clear fields
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

  //increase salary
  curentUser.salary += Number(model.inputDepositField.value);
  //update locale storage for user salary
  updateLocalSotrageCurentUser(curentUser);
  model.inputDepositField.value = "";
  //show last update salary
  view.showCurentBalanceSalary(model.curentBalance, curentUser.salary);
});

//remove element from products
model.tableField.addEventListener("click", function (e) {
  if (!e.target.classList.contains("icon-close")) return;

  const row = e.target.closest("tr");
  const productId = Number(row.children[4].textContent);

  productList = productList.filter((pr) => pr.PurchaseId !== productId);
  const maxId = productList.reduce((max, p) => Math.max(max, p.PurchaseId), 0);
  Product.lastId = maxId;
  localStorage.setItem("lastProductId", Product.lastId);

  curentUser.salary += Number(row.children[3].textContent);
  //update localeStorae
  updateLocalSotrageCurentUser(curentUser);
  //update curent Balance
  view.showCurentBalanceSalary(model.curentBalance, curentUser.salary);
  //add data in local storage
  addDataInLocalStorage(productList, "products");
  //remove row
  row.remove();
});

//implement edit button
model.tableField.addEventListener("click", function (e) {
  if (!e.target.classList.contains("icon-edit")) return;

  model.editTable.classList.remove("hidden");
  const row = e.target.closest("tr");
  //take date from original table
  const productId = Number(row.children[4].textContent);
  const productPrice = Number(row.children[3].textContent);
  const productName = row.children[2].textContent;
  const productDate = row.children[1].textContent;
  temporeryField = Number(row.children[3].textContent);
  //update edit table with values from origial table
  model.editProductId.textContent = productId;
  model.editCalendarField.value = productDate;
  model.EditDropDown.value = productName;
  model.editPrice.value = productPrice;
});

//cloase button
model.editCloseBtn.addEventListener("click", function (e) {
  e.preventDefault();
  model.editTable.classList.add("hidden");
});

//implement save edit button
model.editSaveBtn.addEventListener("click", function (e) {


  //check for balance
  const isEnought = checkCurentBalanceAndSalary(
    Number(model.editPrice.value - temporeryField),
    curentUser.salary
  );
  if (!isEnought)
    return view.showValidationError(
      model.validationMessageField,
      "Нямаш достатъчно средства"
    );

  productList
    .filter((pr) => pr.PurchaseId === Number(model.editProductId.textContent))
    .map((ob) => {
      ob.datePurchase = model.editCalendarField.value;
      ob.nameProduct = model.EditDropDown.value;
      ob.priceProduct = Number(model.editPrice.value);
    });

  //update data base
  addDataInLocalStorage(productList, "products");

  //select all values rows
  const tBody = document.getElementsByTagName("tbody");

  //convert to aray
  const arrays = [...tBody];

  //clear all values rows
  arrays.map((el) => (el.textContent = ""));

  //update all values rows
  productList.map((el) => {
    view.renderHTMLtable(
      el.idUser,
      el.datePurchase,
      el.nameProduct,
      el.priceProduct,
      el.PurchaseId
    );
  });

  let deltaBetweenFiled =
    Number(temporeryField) - Number(model.editPrice.value);
  curentUser.salary += deltaBetweenFiled;

  //update curentUser Salary
  updateLocalSotrageCurentUser(curentUser);
  view.showCurentBalanceSalary(model.curentBalance, curentUser.salary);

  //hide edit table
  model.editTable.classList.add("hidden");
});

//export to excel:
model.exportBtn.addEventListener("click", function () {
  const table = document.querySelector(".table");
  if (!table) {
    alert("Table not found!");
    return;
  }

  // Get header cells (excluding last two columns)
  const headerCells = Array.from(table.querySelectorAll("thead th"));
  const headers = headerCells
    .slice(0, headerCells.length - 2)
    .map((th) => th.innerText.trim());

  // Get all body rows
  const bodyRows = table.querySelectorAll("tbody tr");

  // Build array of arrays: first row is headers, then data rows
  const data = [headers];

  bodyRows.forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll("td"));
    // Exclude last two columns (Delete and Edit)
    const rowData = cells
      .slice(0, cells.length - 2)
      .map((td) => td.innerText.trim());
    data.push(rowData);
  });

  // Create worksheet and workbook from array of arrays
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  // Export file
  XLSX.writeFile(workbook, "transactions.xlsx");
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
