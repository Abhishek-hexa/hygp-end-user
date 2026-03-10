export interface ApiResponse<T> {
  data: T
  message?: string
}

//    Buckles API
//    GET /buckle

export interface BuckleMaterialType {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface BuckleApiItem {
  id: number
  name: string

  material_id: number
  material_type: BuckleMaterialType

  metal_color: string | null
  plastic_color: string | null
  breakaway_color?: string | null

  preview: string

  display_order: number

  createdAt: string
  updatedAt: string
}

export type BucklesApiResponse = ApiResponse<BuckleApiItem[]>


//    Engraving Fonts API
//    GET /engraving-fonts

export type FontUseCase = 'webbing' | 'buckle'

export interface EngravingFontApiItem {
  id: number

  name: string
  longName: string

  file_name: string
  trueFontName: string

  font_path: string
  preview: string

  display_order: number
  isVisible: boolean

  use_case: FontUseCase[]

  createdAt: string
  updatedAt: string
}

export type EngravingFontsApiResponse = ApiResponse<EngravingFontApiItem[]>


//    Product Variants API
//    GET /product/variants/{id}

export interface ProductVariantApiItem {
  id: number

  size: string
  prefix: string

  price: string

  model: string
  plasticModel: string

  sizeImage?: string

  width: number | null
  length: number | null
  withoutBellPrice: string
}

export interface ProductVariantsApiResponse {
  success: boolean
  variants: ProductVariantApiItem[]
  data: ProductVariantApiItem[] // For backward compatibility, to be removed in the future
}


//    Shopify Collections API
//    GET /shopify-collection

export interface ShopifyCollectionApiItem {
  gid: string
  id: string

  title: string
  handle: string

  image: string

  Default_collection?: boolean
  Default_product?: string

  star_pattern?: string
}

export interface ShopifyCollectionsApiResponse {
  custom_collections: ShopifyCollectionApiItem[]
}


//    Collection Products API
//    GET /shopify-collection/products/{collectionId}

export interface CollectionProductApiItem {
  id: string

  name: string

  preview: string
  png_image: string

  collectionId: string

  dataX: string
}

export interface CollectionProductsPageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  lastCursor: string
  startCursor: string
  productCount: number
}

export interface CollectionProductsApiResponse {
  success: boolean

  collectionId: string

  totalProducts: number

  products: CollectionProductApiItem[]

  pageInfo: CollectionProductsPageInfo
}