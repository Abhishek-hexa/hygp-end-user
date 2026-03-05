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

## Current State Architecture

The current app has a single state domain rooted at `StateManager`.

```text
StateManager
|- DesignManager
   |- ProductManager
      |- SizeManager
      |- BuckleManager
      |- EngravingManager
      |- WebbingTextManager
      |  |- FontManager
      |- TextureManager
```

- Root manager: `src/state/StateManager.ts`
- Design domain manager: `src/state/design/DesignManager.ts`
- Product manager: `src/state/product/ProductManager.ts`
- Product sub-managers: `src/state/product/managers/*`

## Manager Details

### `StateManager`

File: `src/state/StateManager.ts`

- Owns `designManager`
- Exposes `get designManager()`

### `DesignManager`

File: `src/state/design/DesignManager.ts`

- Owns `productManager`
- Tracks UI feature state:
  - `availableFeatures` (derived from product config, excluding `FETCH`)
  - `activeFeature`
- API:
  - `setActiveFeature(feature | null)`

### `ProductManager`

File: `src/state/product/ProductManager.ts`

- Owns product selection and all product feature managers:
  - `sizeManager`
  - `buckleManager`
  - `engravingManager`
  - `webbingText`
  - `textureManager`
- API:
  - `setProduct(productId)` (resets all feature managers)
  - `getAllFeatures()`
  - `getModelPath()` (returns selected size model or `null`)
  - `resetAll()`

### `SizeManager`

File: `src/state/product/managers/SizeManager.ts`

- State:
  - selected size + available sizes map
  - selected leash length + available lengths
- API:
  - `setSize`, `setAvailableSizes`
  - `setLength`, `setAvailableLengths`
  - `reset`

### `BuckleManager`

File: `src/state/product/managers/BuckleManager.ts`

- State:
  - buckle type + available buckle types
  - selected buckle color
  - metal/plastic/breakaway color options
- API:
  - `setType`, `setAvailableBuckles`
  - `setMetalColors`, `setPlasticColors`, `setBreakawayColors`
  - `setSelectedColor`
  - `reset`
- Computed helper:
  - `currentColors` returns colors for active buckle type

### `EngravingManager`

File: `src/state/product/managers/EngravingManager.ts`

- State:
  - engraving lines (`max 4`)
  - available engraving fonts map
- API:
  - `setLines`, `setAvailableFonts`, `reset`

### `WebbingTextManager`

File: `src/state/product/managers/WebbingTextManager.ts`

- State:
  - text value
  - text size (`SMALL` | `MEDIUM` | `LARGE`)
  - nested `FontManager`
- API:
  - `setText`, `setSize`, `setFont`, `reset`
- Forwarded getters:
  - `availableFonts`
  - `selectedFont`

### `FontManager`

File: `src/state/product/managers/FontManager.ts`

- State:
  - selected font
  - selected font id
  - available fonts map (`name -> URL`)
- API:
  - `setFont`, `setFontId`, `setAvailableFonts`, `clearFont`, `reset`

### `TextureManager`

File: `src/state/product/managers/TextureManager.ts`

- State:
  - available collections map
  - selected collection id
  - available patterns per collection
  - selected pattern id
- API:
  - `setAvailableCollections`, `setSelectedCollection`
  - `setAvailablePatterns`, `setSelectedPattern`
  - `reset`

## Product Feature Configuration

Source: `src/state/product/productConfig.ts`

- `DOG_COLLAR`: `SIZE`, `DESIGN`, `BUCKLE`, `ENGRAVING`, `COLLAR_TEXT`, `FETCH`
- `CAT_COLLAR`: `SIZE`, `DESIGN`, `HARDWARE`, `COLLAR_TEXT`, `BUCKLE`, `FETCH`
- `LEASH`: `HARDWARE`, `FETCH`
- `MARTINGALE`: `HARDWARE`, `FETCH`
- `BANDANA`: `FETCH`
- `HARNESS`: `FETCH`

`DesignManager.availableFeatures` removes `FETCH`, so tab rendering only uses configurable features.

## API Initialization Flow

Source: `src/api/initializeDogCollarApis.ts`

On first `Viewer` mount, `initializeDogCollarApis(productManager)`:

1. Sets product to `DOG_COLLAR`
2. Fetches in parallel:
   - `/product/variants/8969048817879`
   - `/buckle`
   - `/engraving-fonts`
   - `/shopify-collection/`
3. Fetches first collection products:
   - `/shopify-collection/products/{collectionId}`
4. Parses responses into managers:
   - sizes -> `SizeManager`
   - buckle types/colors -> `BuckleManager`
   - fonts -> `WebbingTextManager` and `EngravingManager`
   - collections/patterns -> `TextureManager`

## UI Feature Tab Status

Source: `src/components/Viewer/ConfigurationTabs/*`

- Implemented:
  - `SizeTab`
  - `DesignTab`
  - `BuckleTab`
- Placeholder (currently empty):
  - `EngravingTab`
  - `CollarTextTab`
  - `HarnessTextTab`
  - `HardwareTab`

## Developer Notes

1. Read manager state via getters, not private fields.
2. Mutate state via manager methods (`set...`, `reset...`), not direct assignment.
3. Keep business rules in `ProductManager` + manager classes, not React components.
4. `MainContextProvider` creates `new StateManager()` inline; if provider rerenders, state reinitializes.
