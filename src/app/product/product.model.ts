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
