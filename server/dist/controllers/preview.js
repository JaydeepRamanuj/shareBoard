"use strict";
/**
 * WHAT: Controller for URL Preview.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreview = void 0;
const metadataService_1 = require("../services/metadataService");
// POST /api/preview
const getPreview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        const metadata = yield (0, metadataService_1.fetchMetadata)({ url });
        res.json(metadata);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch preview' });
    }
});
exports.getPreview = getPreview;
