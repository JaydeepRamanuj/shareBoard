# Data Flow

## 1. Flow: Add Bookmark
1. **User Action**: User pastes URL in `AddBookmarkScreen`.
2. **Preview**: App sends `POST /api/preview` -> Backend scrapes OG data.
3. **Edit**: User selects a **Collection** (or leaves as "Unsorted").
4. **Save**: App sends `POST /api/bookmarks`.
5. **Persistence**: Saved to MongoDB `bookmarks` collection.

## 2. Flow: View Collections
1. **User Action**: App opens `CollectionsScreen`.
2. **Fetch**: `GET /api/collections`.
3. **Render**: Grid of collections with bookmark counts.

## 3. Flow: Search
1. **User Action**: typing in `SearchScreen`.
2. **Query**: `GET /api/search?q=...`.
3. **Result**: Backend performs regex search on Title/URL/Desc.
