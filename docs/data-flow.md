# Data Flow Documentation

This document explains the lifecycle of data for key user actions in plain English.

## 1. Adding a Bookmark

1.  **User Interaction**: User taps the "Add" button (FAB) or navigates to the "Add Bookmark" screen.
2.  **App Check**: The app checks the clipboard. If a URL is found, it prepopulates the input field.
3.  **Preview Generation**:
    *   App sends a POST request to `/api/preview` with the URL.
    *   **Backend** (`metadataService.ts`) uses Cheerio to fetch the page HTML.
    *   **Backend** extracts Open Graph tags (`og:title`, `og:image`, etc.).
    *   **Backend** returns a normalized JSON object (title, description, image, domain) to the app.
4.  **Display**: App shows a skeleton loader while fetching, then displays the preview card.
5.  **User Confirmation**: User reviews the data and taps "Save".
6.  **Persistence**:
    *   App sends a POST request to `/api/bookmarks`.
    *   **Backend** (`controllers/bookmarks.ts`) creates a new `Bookmark` document in MongoDB.
    *   Data is tagged with `collectionId: null` (Action: Save to Unsorted).
7.  **Feedback**: App closes the modal and refreshes the "Unsorted Bookmarks" list on the Home Screen.

## 2. Fetching Bookmarks (Home Screen)

1.  **Screen Load**: `HomeScreen` mounts or gains focus.
2.  **Parallel Requests**:
    *   **Request A**: GET `/api/collections` (for "Recent Collections").
    *   **Request B**: GET `/api/bookmarks?collectionId=unsorted` (for "Unsorted Bookmarks").
3.  **Backend Processing**:
    *   **Request A**: MongoDB finds all collections for the user.
    *   **Request B**: MongoDB finds bookmarks where `collectionId` is null.
4.  **Display**: App renders the list. If empty, a specific "No bookmarks" empty state illustration is shown.

## 3. Moving Bookmarks (Bulk)

1.  **Selection**: User long-presses a bookmark to enter "Selection Mode".
2.  **Interaction**: User selects multiple bookmarks and taps "Move".
3.  **Modal Open**: `MoveBookmarksModal` opens and fetches the list of available collections.
4.  **User Choice**: User picks a target collection (e.g., "Design Inspiration").
5.  **API Call**:
    *   App sends POST `/api/bookmarks/bulk-move`.
    *   Payload: `{ bookmarkIds: [...], targetCollectionId: "..." }`.
6.  **Backend Update**:
    *   Backend executes `Bookmark.updateMany`.
    *   Sets `collectionId` to the new target for all matching IDs.
7.  **Refresh**:
    *   App exits selection mode.
    *   App re-fetches the current view (items disappear from the old list).

## 4. Deleting a Collection

1.  **Action**: User taps "Delete Collection" inside `CollectionDetailScreen`.
2.  **Confirmation**: A custom `ConfirmModal` warns that bookmarks will be moved to Unsorted.
3.  **API Call**: DELETE `/api/collections/:id`.
4.  **Backend Logic** (Note: Current implementation detail):
    *   Mongoose deletes the Collection document.
    *   *Implicit behavior*: Orphaned bookmarks (bookmarks pointing to the deleted ID) effectively become "unsorted" or ghosted depending on query logic.
    *   *Best Practice*: Backend *should* ideally update linked bookmarks to `collectionId: null`. (See `design-decisions.md` regarding cascading deletes vs. unlinking).
5.  **Navigation**: User is navigated back to the previous screen.
