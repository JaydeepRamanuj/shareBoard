# Database Models

We use **MongoDB** with **Mongoose** for data modeling.
The schema is designed for **single-tenancy MVP** but includes `userId` fields for future multi-tenancy support.

## 1. Bookmark Model (`models/Bookmark.ts`)

**Purpose**: Represents a single saved URL.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique identifier (Auto-generated). |
| `userId` | String | Yes | Owner ID (Hardcoded to 'demo-user-1' for MVP). |
| `url` | String | Yes | The original link saved. |
| `title` | String | Yes | Display title (fetched from OG data). |
| `description` | String | No | Short summary (fetched from OG data). |
| `image` | String | No | URL to the preview image. |
| `domain` | String | Yes | The hostname (e.g., 'youtube.com') for visual context. |
| `collectionId` | ObjectId | No | Reference to a `Collection`. If `null`, it is "Unsorted". |
| `createdAt` | Date | Yes | Timestamp for sorting (Newest first). |

**Indexes**:
-   Text Index on `title`, `description`, `url` (for Search performance).

---

## 2. Collection Model (`models/Collection.ts`)

**Purpose**: Represents a folder or category for grouping bookmarks.

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Unique identifier. |
| `userId` | String | Yes | Owner ID. |
| `name` | String | Yes | Display name (e.g., "Recipes"). |
| `icon` | String | No | Icon name (compatible with Ionicons). Default: 'folder'. |
| `color` | String | No | Hex color code for branding the folder. Default: '#FFFFFF'. |
| `createdAt` | Date | Yes | Timestamp. |

**Relationships**:
-   **One-to-Many**: One Collection has many Bookmarks.
-   The relationship is stored on the *child* (Bookmark) via `collectionId`. This allows moving bookmarks easily without updating a massive array on the parent Collection.
