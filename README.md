# HYGP End User

React + TypeScript + MobX configurator UI for Here You Go Pup products.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build production bundle:

```bash
npm run build
```

4. Required env var:

```bash
VITE_API_BASE_URL=<your-api-base-url>
```

## State Architecture

```text
StateManager
|- DesignManager
   |- ProductManager
      |- SizeManager
      |- BuckleManager
      |- EngravingManager
      |- WebbingTextManager
      |- TextureManager
```

- Root manager: `src/state/StateManager.ts`
- Design manager: `src/state/design/DesignManager.ts`
- Product manager: `src/state/product/ProductManager.ts`
- Product sub-managers: `src/state/product/managers/*`

## Manager Audit (Current)

Audit scope:
- `StateManager`
- `DesignManager`
- `ProductManager`
- `SizeManager`
- `BuckleManager`
- `EngravingManager`
- `WebbingTextManager`
- `TextureManager`

Audit result:
- `ProductManager` now exposes canonical `reset()` and uses it in `setProduct()`.
- All product sub-managers implement `reset()`.
- Fixed `TextureManager.reset()` to fully clear cached data:
  - clears `_availableCollections`
  - clears `_availablePatterns`
  - clears selected collection + selected pattern state

## ProductManager API

File: `src/state/product/ProductManager.ts`

- `setProduct(productId)`:
  - sets current product type
  - resets all feature managers
- `getAllFeatures()`
- `getModelPath()`
- `reset()`

## Product Feature Configuration

Source: `src/state/product/productConfig.ts`

- `DOG_COLLAR`: `SIZE`, `DESIGN`, `BUCKLE`, `ENGRAVING`, `COLLAR_TEXT`, `FETCH`
- `CAT_COLLAR`: `SIZE`, `DESIGN`, `HARDWARE`, `COLLAR_TEXT`, `MEOW`
- `LEASH`: `SIZE`, `DESIGN`, `HARDWARE`, `LEASH_TEXT`, `FETCH`
- `HARNESS`: `SIZE`, `DESIGN`, `HARNESS_TEXT`, `FETCH`
- `MARTINGALE`: `SIZE`, `DESIGN`, `HARDWARE`, `COLLAR_TEXT`, `FETCH`
- `BANDANA`: `FETCH`

`DesignManager.availableFeatures` excludes `FETCH` from tab rendering.

## API Initialization Flow

Source: `src/api/initializeProductApis.ts`

On product load/switch, call:

```ts
initializeProductApis(productManager, productType)
```

Flow:
1. `productManager.setProduct(productType)` -> resets all managers.
2. Resolve endpoints from `src/api/ApiEndPointMap.ts`.
3. Fetch in parallel:
   - product variants
   - buckle list (if endpoint exists)
   - engraving fonts
   - collections
4. Fetch first collection products.
5. Parse and store into managers:
   - sizes -> `SizeManager`
   - buckle types/colors -> `BuckleManager`
   - fonts -> `WebbingTextManager` + `EngravingManager`
   - collections/patterns -> `TextureManager`

## UI Tab Status

Renderer source: `src/components/Viewer/ConfigurationPanel/FeatureContentRenderer.tsx`

- `SIZE` -> `SizeTab`
- `DESIGN` -> `DesignTab`
- `BUCKLE` -> `BuckleTab`
- `HARDWARE` -> `HardwareTab` (currently reuses `BuckleTab`)
- `ENGRAVING` -> `EngravingTab`
- `COLLAR_TEXT` -> `WebbingTextTab target="collar"`
- `LEASH_TEXT` -> `WebbingTextTab target="leash"`
- `HARNESS_TEXT` -> `WebbingTextTab target="harness"`

## Notes

- `src/components/Viewer/ConfigurationTabs/HarnessTextTab.tsx` still exists but is not used by the renderer.
- `MEOW` feature exists in types/config/labels but does not have a dedicated tab component yet.
