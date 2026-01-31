/**
 * WHAT: Service to fetch and parse URL metadata.
 * WHY: We need to preview links before saving them. 
 * HOW: Uses 'open-graph-scraper' library.
 */

import ogs from 'open-graph-scraper';

interface MetadataParams {
    url: string;
}

export interface MetadataResult {
    title: string;
    description: string;
    image: string | null;
    domain: string;
    url: string;
}

export const fetchMetadata = async ({ url }: MetadataParams): Promise<MetadataResult> => {
    try {
        const { result } = await ogs({
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
            } else if (typeof result.ogImage === 'object' && (result.ogImage as any).url) {
                image = (result.ogImage as any).url;
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
    } catch (error) {
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
};
