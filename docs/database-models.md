# Database Models

## 1. Bookmark
```typescript
{
  _id: ObjectId,
  userId: String,          // "demo-user-1"
  url: String,
  title: String,
  description: String,
  image: String | null,
  domain: String,
  collectionId: ObjectId | null, // Null = Unsorted
  createdAt: Date
}
```

## 2. Collection (Board)
```typescript
{
  _id: ObjectId,
  userId: String,
  name: String,
  icon: String | null,     // Optional: for future icons
  color: String | null,    // Optional: for future colors
  createdAt: Date
}
```
