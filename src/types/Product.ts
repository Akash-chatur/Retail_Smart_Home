// src/types/Product.ts

export interface Accessory {
  id: number;
  name: string;
  price: number;
}

export interface WarrantyOption {
  id: number;
  name: string;
  duration: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  type: string;
  price: number;
  description: string;
  accessories: Accessory[];
  warrantyOptions?: WarrantyOption[];
  specialDiscount?: number;
  manufacturerRebate?: number;
  imageUrl?: string;
  category?: string; // New field
  onSale?: boolean; // New field
  manufacturer?: string; // New field
}

export interface Review {
  ManufacturerName: string;
  ManufacturerRebate: boolean;
  ProductCategory: string;
  ProductModelName: string;
  ProductOnSale: boolean;
  ProductPrice: number;
  ReviewDate: string;
  ReviewRating: number; // Assuming this is a number based on your API response
  ReviewText: string;
  StoreCity: string;
  StoreID: string;
  StoreState: string;
  StoreZip: string;
  UserAge: number;
  UserGender: string;
  UserID: string;
  UserOccupation: string;
  _id: { date: string };
}
