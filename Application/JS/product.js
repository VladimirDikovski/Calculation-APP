export class Product {
  static lastId = 0; // static property to track the last used ID
  PurchaseId;
  constructor(idUser, nameProduct, datePurchase, priceProduct) {
    this.PurchaseId = ++Product.lastId; // auto-increment
    this.idUser = idUser;
    this.nameProduct = nameProduct;
    this.datePurchase = datePurchase;
    this.priceProduct = priceProduct;
  }
}
