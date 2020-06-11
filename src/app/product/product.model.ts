export interface ProductModel {
  name: string;
  itemcode: string;
  description: string;
  packingtype: string;
  packs: number;
  categoryId: string;
  subcategoryId: string;
  expiredenabled: boolean;
  id?: string;
}

export interface ProductModel {
  name: string;
  itemcode: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  productconfiguration: productconfigurationModel;
}
export interface productconfigurationModel {
  imagelink: string;
  packingQty: number;
  expiredenabled: boolean;
  leadtime: number;
  canexpire: boolean;
  canbesold: boolean;
  canbepurchased: boolean;
  anypromo: boolean;
}
