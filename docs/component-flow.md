# Component Flow (Frontend)

This document describes the React Native component hierarchy and how data moves between them.

## 1. High-Level Hierarchy

```
App (Root)
├── ThemeProvider (Context: Colors, Dark Mode)
├── SafeAreaProvider
└── NavigationContainer
    └── StackNavigator
        ├── TabNavigator (Main)
        │   ├── HomeScreen
        │   ├── CollectionsScreen
        │   └── SettingsScreen
        ├── AddBookmarkScreen (Modal)
        └── CollectionDetailScreen (Stack)
```

## 2. Key Component Responsibilities

### `HomeScreen.tsx`
-   **Role**: Dashboard.
-   **State**: `recentCollections`, `unsortedBookmarks`, `isSelectionMode`.
-   **Key Children**:
    -   `CollectionCard` (Horizontal List)
    -   `BookmarkCard` (Vertical List)
    -   `MoveBookmarksModal` (Hidden until triggered)
    -   `ConfirmModal`
-   **Events**:
    -   `onRefresh` -> Refetches data.
    -   `onLongPress` (Bookmark) -> Enters Selection Mode.

### `CollectionsScreen.tsx`
-   **Role**: Organizing Hub.
-   **State**: `collections`, `searchQuery`, `isDrawerOpen`.
-   **Key Children**:
    -   `CollectionCard` (Grid)
    -   "Create New Collection" Drawer (Custom Modal implementation)
-   **Events**:
    -   `onCreateCollection` -> Calls API, then refreshes list.

### `CollectionDetailScreen.tsx`
-   **Role**: Deep Dive.
-   **State**: `bookmarks`, `isSelectionMode`, `editModalVisible`.
-   **Key Children**:
    -   `BookmarkCard`
    -   `EditCollectionModal` (Renaming/Recoloring)
-   **Events**:
    -   `onBackPress` -> Handles custom back logic if in Selection Mode.

### `MoveBookmarksModal.tsx`
-   **Role**: Smart Action.
-   **State**: `targetCollectionId`, `isCreatingNew`.
-   **Logic**:
    -   Fetches all collections on mount.
    -   Allows creating a *new* collection inline while moving.
    -   Returns `onMoveSuccess` callback to parent to refresh parent's list.

## 3. Data Flow Pattern

**Fetch-on-Focus**:
We use `useIsFocused()` or `useFocusEffect()` to trigger data fetching.
*   *Why?* Ensures data is always fresh when ensuring navigating back from another tab or screen (like "Add Bookmark") without complex global state management (Redux/Zustand) for this MVP.

**Props vs. State**:
-   **Bookmarks Data** is local state in Screens (`HomeScreen`, `CollectionDetailScreen`).
-   **Theme** is Global Context (`useTheme`).
-   **Navigation Params** pass strictly minimal data (e.g., `collectionId`). The screen is responsible for fetching full details if needed to ensure source-of-truth accuracy.
