//take dom
export const emailField = document.querySelector(".input-email");
export const passwordField = document.querySelector(".input-password");
export const btnSumbitLogin = document.querySelector(".btn-login");
export const loginError = document.querySelector(".error-login");
export const mainHeader = document.querySelector(".main-header");
export const bodyTable = document.querySelector(".body-wrapper");
export const curentBalance = document.querySelector(".curent-balance");
export const name = document.querySelector(".name");
export const btnSumbitProduct = document.querySelector(".btn-submit");
export const dateField = document.querySelector(".input-calendar");
export const productField = document.querySelector(".input-menu");
export const priceField = document.querySelector(".input-price");
export const validationMessageField = document.querySelector(".validation");
export const tableField = document.querySelector(".table");
export const btnDeposit = document.querySelector(".btn-deposit");
export const inputDepositField = document.querySelector(".input-deposit");
export const exportBtn = document.querySelector(".export");

export const editTable = document.querySelector(".edit-table");
export const editCalendarField = document.querySelector(".input-edit-calendar");
export const EditDropDown = document.querySelector(".input-edit-dropdown");
export const editPrice = document.querySelector(".input-edit-price");
export const editProductId = document.querySelector(".edit-productId");

export const editCloseBtn = document.querySelector(".edit-table-close");
export const editSaveBtn = document.querySelector(".edit-table-save");

import { PaidLeaves } from "../../Register/JS/script.js";

export function getDataFromLocal() {
  const data = JSON.parse(localStorage.getItem("register"));
  if (!data) return [];
  return data.map((obj) => {
    const user = new PaidLeaves(obj.email, obj.password, obj.name, obj.salary);

    user.id = obj.id;
    return user;
  });
}
