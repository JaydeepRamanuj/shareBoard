import express from 'express';
import {
    createBookmark,
    getBookmarks,
    searchBookmarks,
    updateBookmark,
    bulkMoveBookmarks,
    bulkDeleteBookmarks
} from '../controllers/bookmarks';
import * as CollectionController from '../controllers/collections';
import { getPreview } from '../controllers/preview';

const router = express.Router();

// Bookmarks
router.post('/bookmarks', createBookmark);
router.get('/bookmarks', getBookmarks); // ?collectionId=...
router.put('/bookmarks/:id', updateBookmark);
router.post('/bookmarks/bulk-move', bulkMoveBookmarks);
router.post('/bookmarks/bulk-delete', bulkDeleteBookmarks);

// Collections
router.get('/collections', CollectionController.getCollections);
router.post('/collections', CollectionController.createCollection);
router.put('/collections/:id', CollectionController.updateCollection);
router.delete('/collections/:id', CollectionController.deleteCollection);
router.get('/collections/stats', CollectionController.getStats);

// Search
router.get('/search', searchBookmarks); // ?q=...

// Preview
router.post('/preview', getPreview);

export default router;
