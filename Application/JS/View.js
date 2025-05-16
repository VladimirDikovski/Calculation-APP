import { tableField } from "./Model.js";

export function writeError(element, text) {
  element.textContent = text;
}

export function showCurentBalanceSalary(elementHtml, salary) {
  elementHtml.textContent = `Balance ${salary}`;
}

export function showName(elementHtml, name) {
  elementHtml.textContent = `Welcome ${name}`;
}

export function showValidationError(elementHtml, text) {
  elementHtml.textContent = text;
}
export function renderHTMLtable(id, date, product, price, purchasesId) {
  const html = `<tr>
    <td>${id}</td>
    <td>${date}</td>
    <td>${product}</td>
    <td>${price}</td>
    <td class="puchase-id">${purchasesId}</td>
      <td><ion-icon name="close-outline" class="icon-close"></ion-icon></td>
  </tr>`;
  tableField.insertAdjacentHTML("afterbegin", html);
}
