import express from 'express';
import { createBookmark, getBookmarks, searchBookmarks, updateBookmark } from '../controllers/bookmarks';
import { createCollection, getCollections, getStats } from '../controllers/collections';
import { getPreview } from '../controllers/preview';

const router = express.Router();

// Bookmarks
router.post('/bookmarks', createBookmark);
router.get('/bookmarks', getBookmarks); // ?collectionId=...
router.put('/bookmarks/:id', updateBookmark);

// Collections
router.get('/collections', getCollections);
router.post('/collections', createCollection);
router.get('/stats', getStats);

// Search
router.get('/search', searchBookmarks); // ?q=...

// Preview
router.post('/preview', getPreview);

export default router;
