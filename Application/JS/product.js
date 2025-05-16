export class Product {
  static lastId = 0;

  constructor(idUser, nameProduct, datePurchase, priceProduct) {
    this.idUser = idUser;
    this.nameProduct = nameProduct;
    this.datePurchase = datePurchase;
    this.priceProduct = priceProduct;
    this.PurchaseId = ++Product.lastId;
  }
}
