"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookmarks_1 = require("../controllers/bookmarks");
const collections_1 = require("../controllers/collections");
const preview_1 = require("../controllers/preview");
const router = express_1.default.Router();
// Bookmarks
router.post('/bookmarks', bookmarks_1.createBookmark);
router.get('/bookmarks', bookmarks_1.getBookmarks); // ?collectionId=...
router.put('/bookmarks/:id', bookmarks_1.updateBookmark);
// Collections
router.get('/collections', collections_1.getCollections);
router.post('/collections', collections_1.createCollection);
router.get('/stats', collections_1.getStats);
// Search
router.get('/search', bookmarks_1.searchBookmarks); // ?q=...
// Preview
router.post('/preview', preview_1.getPreview);
exports.default = router;
