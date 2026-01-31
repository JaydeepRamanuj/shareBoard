"use strict";
/**
 * WHAT: Service to fetch and parse URL metadata.
 * WHY: We need to preview links before saving them.
 * HOW: Uses 'open-graph-scraper' library.
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMetadata = void 0;
const open_graph_scraper_1 = __importDefault(require("open-graph-scraper"));
const fetchMetadata = (_a) => __awaiter(void 0, [_a], void 0, function* ({ url }) {
    try {
        const { result } = yield (0, open_graph_scraper_1.default)({
            url,
            fetchOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (compatible; ShareBoard/1.0; +http://localhost:4000)'
                }
            }
        });
        const title = result.ogTitle || result.twitterTitle || result.requestUrl;
        const description = result.ogDescription || result.twitterDescription || '';
        // Handle image: ogImage can be an array or object
        let image = null;
        if (result.ogImage) {
            if (Array.isArray(result.ogImage) && result.ogImage.length > 0) {
                image = result.ogImage[0].url;
            }
            else if (typeof result.ogImage === 'object' && result.ogImage.url) {
                image = result.ogImage.url;
            }
        }
        const domain = new URL(url).hostname.replace('www.', '');
        return {
            title: title || domain,
            description,
            image,
            domain,
            url,
        };
    }
    catch (error) {
        console.error('Metadata fetch error:', error);
        // Fallback if scraping fails
        const domain = new URL(url).hostname;
        return {
            title: domain,
            description: 'No preview available',
            image: null,
            domain,
            url,
        };
    }
});
exports.fetchMetadata = fetchMetadata;
