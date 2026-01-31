"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookmarks_1 = require("../controllers/bookmarks");
const CollectionController = __importStar(require("../controllers/collections"));
const preview_1 = require("../controllers/preview");
const router = express_1.default.Router();
// Bookmarks
router.post('/bookmarks', bookmarks_1.createBookmark);
router.get('/bookmarks', bookmarks_1.getBookmarks); // ?collectionId=...
router.put('/bookmarks/:id', bookmarks_1.updateBookmark);
router.post('/bookmarks/bulk-move', bookmarks_1.bulkMoveBookmarks);
router.post('/bookmarks/bulk-delete', bookmarks_1.bulkDeleteBookmarks);
// Collections
router.get('/collections', CollectionController.getCollections);
router.post('/collections', CollectionController.createCollection);
router.put('/collections/:id', CollectionController.updateCollection);
router.delete('/collections/:id', CollectionController.deleteCollection);
router.get('/collections/stats', CollectionController.getStats);
// Search
router.get('/search', bookmarks_1.searchBookmarks); // ?q=...
// Preview
router.post('/preview', preview_1.getPreview);
exports.default = router;
