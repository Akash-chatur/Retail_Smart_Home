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
  }