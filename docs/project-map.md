# Project Map

> "Start anywhere and understand where to go next."

## 1. Frontend Entry Point (`app/`)
-   **`App.tsx`**: The Root component. It sets up the `ThemeProvider`, `NavigationContainer`, and `SafeAreaProvider`.
-   **`src/navigation/AppNavigator.tsx`**: Defines the navigation structure (Bottom Tabs + Stacks). **Start here to see the screen hierarchy.**

## 2. Screen-to-Screen Navigation
-   **Tab: Home** (`HomeScreen.tsx`)
    -   Displays "Recent Collections" and "Unsorted Bookmarks".
    -   *Navigates to* -> `CollectionDetailScreen` (when clicking a collection card).
    -   *Navigates to* -> `AddBookmarkScreen` (via Floating Action Button).
    -   *Navigates to* -> `SettingsScreen` (via Top Bar).
    
-   **Tab: Collections** (`CollectionsScreen.tsx`)
    -   Displays a grid of all collections.
    -   *Opens* -> "Create New Collection" Drawer (Modal).
    -   *Navigates to* -> `CollectionDetailScreen` (when clicking a collection).

-   **Tab: Settings** (`SettingsScreen.tsx`)
    -   Static settings page (Dark Mode toggle, About).

-   **Screen: Collection Detail** (`CollectionDetailScreen.tsx`)
    -   The deep-view of a specific collection.
    -   Handles renaming, recoloring, and bulk management of bookmarks.

-   **Screen: Add Bookmark** (`AddBookmarkScreen.tsx`)
    -   A modal screen to input a URL and save it.
    -   Auto-pastes from clipboard on open.

## 3. Backend Entry Point (`server/`)
-   **`src/index.ts`**: The entry point. Initializes Express, Database, and Routes.
-   **`src/routes/index.ts`**: Main router file. Groups routes into `/bookmarks` and `/collections`.

## 4. Key Services & Controllers
-   **Metadata Extraction**:
    -   `POST /api/preview` -> `metadataService.ts`
    -   *Why?* Keeps scraping logic off the main thread and centralized.

-   **Bookmark Management**:
    -   `controllers/bookmarks.ts` -> `models/Bookmark.ts`
    -   Handles Create, Read (by Collection), Search, Bulk Move, Bulk Delete.

-   **Collection Management**:
    -   `controllers/collections.ts` -> `models/Collection.ts`
    -   Handles CRUD for folders (Collections).

## 5. Directory Structure Quick-Ref
```
app/
├── src/
│   ├── api/            # Axios client setup
│   ├── components/     # Reusable UI (Cards, Modals)
│   ├── constants/      # Theme colors, Layout config
│   ├── context/        # ThemeProvider (Global State)
│   ├── navigation/     # Navigators (Tabs, Stacks)
│   ├── screens/        # Page-level components
│   └── utils/          # Helpers (validation, formatting)

server/
├── src/
│   ├── controllers/    # Request handlers (Logic)
│   ├── models/         # Mongoose Schemas (Data)
│   ├── routes/         # Express Routes (API Shape)
│   ├── services/       # Business Logic (Scraping)
│   └── index.ts        # App Entry
```
