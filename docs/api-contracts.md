# API Contracts

Base URL: `/api`

## Bookmarks

### 1. Create Bookmark
**POST** `/bookmarks`

**Request Body**:
```json
{
  "url": "https://google.com",
  "title": "Google",
  "description": "Search engine",
  "image": "https://...",
  "domain": "google.com",
  "collectionId": "optional-mongo-id"
}
```

**Response (201)**:
```json
{
  "_id": "...",
  "userId": "demo-user-1",
  ...fields
}
```

### 2. Get Bookmarks
**GET** `/bookmarks?collectionId={id}`

**Query Params**:
- `collectionId`: "unsorted" | [mongo-id]

**Response (200)**: `[Bookmark]` (Array)

### 3. Search Bookmarks
**GET** `/search?q={query}`

**Response (200)**: `[Bookmark]` (Array - Limit 20)

### 4. Bulk Move
**POST** `/bookmarks/bulk-move`

**Request Body**:
```json
{
  "bookmarkIds": ["id1", "id2"],
  "targetCollectionId": "new-collection-id" // or null for unsorted
}
```

**Response (200)**: `{ "message": "Bookmarks moved successfully" }`

### 5. Bulk Delete
**POST** `/bookmarks/bulk-delete`

**Request Body**:
```json
{
  "bookmarkIds": ["id1", "id2"]
}
```

**Response (200)**: `{ "message": "Bookmarks deleted successfully" }`

---

## Collections

### 1. Get Collections
**GET** `/collections`

**Response (200)**: `[Collection]` (with `bookmarkCount` virtual field if implemented, currently just raw collection).

### 2. Create Collection
**POST** `/collections`

**Request Body**:
```json
{
  "name": "Design",
  "color": "#FF0000",
  "icon": "folder"
}
```

**Response (201)**: `Collection` object.

### 3. Update Collection
**PUT** `/collections/:id`

**Request Body**:
```json
{
  "name": "New Name",
  "color": "#00FF00"
}
```

**Response (200)**: Updated `Collection` object.

### 4. Delete Collection
**DELETE** `/collections/:id`

**Response (200)**: `{ "message": "Collection deleted" }`

---

## Utilities

### 1. Preview URL
**POST** `/preview`

**Request Body**:
```json
{ "url": "https://example.com" }
```

**Response (200)**:
```json
{
  "title": "Example Domain",
  "description": "",
  "image": null,
  "domain": "example.com",
  "url": "https://example.com"
}
```
