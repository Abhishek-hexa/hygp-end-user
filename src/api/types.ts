import { BuckleType, ProductId, ProductSize } from '../state/product/types';

export interface ApiProductVariant {
  id: string;
  modelUrl?: string;
  name: string;
  plasticModelUrl?: string;
  prefix?: string;
  price: number;
  sizeImageUrl?: string;
  size: ProductSize;
}

export interface ProductVariantsResponse {
  variants: ApiProductVariant[];
}

export interface ApiBuckleOption {
  id: string;
  colors: string[];
  metalColor?: string;
  name?: string;
  plasticColor?: string;
  previewColor?: string;
  type: BuckleType;
}

export interface ApiFontOption {
  fontUrl?: string;
  family: string;
  id: string;
  previewUrl: string;
  useCases?: string[];
}

export interface ApiCollection {
  id: string;
  name: string;
}

export interface ApiPattern {
  dataX?: string;
  id: string;
  image: string;
  name: string;
  previewUrl?: string;
  textureUrl: string;
}

export interface UploadDesignerImageResponse {
  url: string;
}

export interface CreateOrderItem {
  productId: ProductId;
  quantity: number;
  variantId: string;
}

export interface CreateOrderPayload {
  customerEmail?: string;
  items: CreateOrderItem[];
  note?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
}
