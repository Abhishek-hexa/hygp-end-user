import { ProductType } from '../../product/types';

export const allMeshNames = [
  'Buckle',
  'Cat_Buckle',
  'D_Ring',
  'Green',
  'greenplane',
  'Plane',
  'Red',
  'redplane',
  'Stiches',
  'Tri_Glide',
  'Tri_Glide1',
  'Tri_Glide2',
  'Web',
  'Web_Text',
  'Yellow',
  'yellowplane',
  'Hook',
  'Leash',
  'Martingle',
  'aLink',
  'base1',
  'base1Part',
  'base2',
  'belts',
  'bottom',
  'buckle1',
  'buckle2',
  'dLink',
  'glass',
  'triGlide1',
  'triGlide2',
  'Glass',
  'Base',
  'Stitches'
] as const;

export type MeshName = (typeof allMeshNames)[number];

export const visibleMeshNamesByProductType = {
  DOG_COLLAR: [
    'Buckle',
    'D_Ring',
    // 'Plane',
    'Stiches',
    'Tri_Glide',
    'Web',
    // 'Web_Text',
    'Glass',
  ],
  CAT_COLLAR: [
    'Buckle', // wil toggle buckle later
    'Cat_Buckle',
    'D_Ring',
    // 'Plane',
    'Stiches',
    'Tri_Glide',
    'Web',
    // 'Web_Text',
    'Glass',
  ],
  MARTINGALE: [
    'D_Ring',
    'Martingle',
    'Stiches',
    'Tri_Glide',
    'Tri_Glide1',
    'Tri_Glide2',
    'Web',
    'Web_Text',
  ],
  LEASH: [
    'Hook', 
    'Stiches', 
    'Leash', 
    'Web_Text'
  ],
  BANDANA: [
    'Base',
    // 'Stitches'
  ],
  HARNESS: [
    'aLink',
    'base1',
    'base1Part',
    'base2',
    'belts',
    'bottom',
    'buckle1',
    'buckle2',
    'dLink',
    'glass',
    'triGlide1',
    'triGlide2',
  ],
} as const satisfies Record<ProductType, readonly MeshName[]>;

export type ProductMeshNameMap = {
  [K in ProductType]: (typeof visibleMeshNamesByProductType)[K][number];
};
