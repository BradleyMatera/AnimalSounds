/**
 * Animal Sounds Soundboard - Enhanced API Integration
 * Robust image fetching with caching, fallbacks, and error handling
 */

/**
 * ImageAPI class for managing all image-related API operations
 */
export class ImageAPI {
    constructor() {
        this.apiKey = '7ubxfcDgot68FA5qRB04KIl2pfIYKbIwVlEyo2dlj9G7iWEehYtsUAqe';
        this.baseUrl = 'https://api.pexels.com/v1';
        this.cache = new Map();
        this.isOnline = navigator.onLine;
        this.requestQueue = [];
        this.isProcessingQueue = false;
        
        // Request tracking
        this.requestCount = 0;
        this.lastRequestTime = 0;
        this.rateLimitDelay = 1000; // 1 second between requests
        
        // Fallback images for each animal - using simple SVG without emoji
        this.fallbackImages = {
            lion: {
                url: 'data:image/svg+xml;charset=utf-8,<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="%23FFB74D"/><text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="48" fill="white">LION</text></svg>',
                title: 'Lion - King of the Jungle',
                photographer: 'Animal Sounds Team',
                alt: 'Majestic lion illustration'
            },
            elephant: {
                url: 'data:image/svg+xml;charset=utf-8,<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="%2390A4AE"/><text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="36" fill="white">ELEPHANT</text></svg>',
                title: 'Elephant - Gentle Giant',
                photographer: 'Animal Sounds Team',
                alt: 'Wise elephant illustration'
            },
            dog: {
                url: 'data:image/svg+xml;charset=utf-8,<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="%23BCAAA4"/><text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="48" fill="white">DOG</text></svg>',
                title: 'Dog - Loyal Companion',
                photographer: 'Animal Sounds Team',
                alt: 'Friendly dog illustration'
            },
            cat: {
                url: 'data:image/svg+xml;charset=utf-8,<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="%23CE93D8"/><text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="48" fill="white">CAT</text></svg>',
                title: 'Cat - Independent Spirit',
                photographer: 'Animal Sounds Team',
                alt: 'Graceful cat illustration'
            },
            bird: {
                url: 'data:image/svg+xml;charset=utf-8,<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="%2381C784"/><text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="48" fill="white">BIRD</text></svg>',
                title: 'Bird - Freedom in Flight',
                photographer: 'Animal Sounds Team',
                alt: 'Beautiful bird illustration'
            },
            frog: {
                url: 'data:image/svg+xml;charset=utf-8,<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="%23AED581"/><text x="200" y="220" text-anchor="middle" font-family="Arial" font-size="48" fill="white">FROG</text></svg>',
                title: 'Frog - Pond Dweller',
                photographer: 'Animal Sounds Team',
                alt: 'Cheerful frog illustration'
            }
        };
        
        // Performance metrics
        this.metrics = {
            cacheHits: 0,
            cacheMisses: 0,
            apiCalls: 0,
            errors: 0,
            averageResponseTime: 0
        };
    }

    async init() {
        console.log('🖼️ Initializing Image API...');
        
        this.setupNetworkListeners();
        this.preloadFallbackImages();
        
        console.log('✅ Image API initialized');
    }

    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('🌐 Network connection restored');
            this.isOnline = true;
            this.processRequestQueue();
        });

        window.addEventListener('offline', () => {
            console.log('📴 Network connection lost');
            this.isOnline = false;
        });
    }

    preloadFallbackImages() {
        // Preload fallback images to ensure they're available immediately
        Object.values(this.fallbackImages).forEach(fallback => {
            const img = new Image();
            img.src = fallback.url;
        });
    }

    /**
     * Fetch animal image with comprehensive error handling and caching
     */
    async fetchAnimalImage(animal, options = {}) {
        const startTime = performance.now();
        
        try {
            // Normalize animal name
            animal = animal.toLowerCase().trim();
            
            // Check cache first
            const cacheKey = `${animal}_${options.size || 'medium'}`;
            if (this.cache.has(cacheKey)) {
                this.metrics.cacheHits++;
                console.log(`📦 Cache hit for ${animal}`);
                return this.cache.get(cacheKey);
            }
            
            this.metrics.cacheMisses++;
            
            // If offline, return fallback immediately
            if (!this.isOnline) {
                console.log(`📴 Offline: Using fallback for ${animal}`);
                return this.getFallbackImage(animal);
            }
            
            // Rate limiting
            await this.respectRateLimit();
            
            // Make API request
            const imageData = await this.makeImageRequest(animal, options);
            
            // Cache successful result
            if (imageData) {
                this.cache.set(cacheKey, imageData);
                
                // Limit cache size (keep most recent 50 images)
                if (this.cache.size > 50) {
                    const firstKey = this.cache.keys().next().value;
                    this.cache.delete(firstKey);
                }
            }
            
            // Update performance metrics
            const responseTime = performance.now() - startTime;
            this.updateMetrics(responseTime, true);
            
            return imageData;
            
        } catch (error) {
            console.error(`❌ Failed to fetch image for ${animal}:`, error);
            this.metrics.errors++;
            
            // Return fallback image on error
            return this.getFallbackImage(animal);
        }
    }

    async makeImageRequest(animal, options = {}) {
        const searchQuery = this.buildSearchQuery(animal);
        const size = options.size || 'medium';
        const perPage = options.multiple ? 5 : 1;
        
        const url = `${this.baseUrl}/search?query=${encodeURIComponent(searchQuery)}&per_page=${perPage}&orientation=${options.orientation || 'all'}`;
        
        console.log(`🌐 Fetching image for: ${animal}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': this.apiKey,
                    'Accept': 'application/json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            this.metrics.apiCalls++;
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data.photos || data.photos.length === 0) {
                throw new Error('No images found');
            }
            
            // Select best image
            const photo = options.multiple ? data.photos : data.photos[0];
            
            if (options.multiple) {
                return data.photos.map(p => this.formatImageData(p, size, animal));
            } else {
                return this.formatImageData(photo, size, animal);
            }
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timeout');
            }
            
            throw error;
        }
    }

    buildSearchQuery(animal) {
        // Enhanced search queries for better image results
        const searchTerms = {
            lion: 'wild lion african safari wildlife',
            elephant: 'wild elephant africa safari wildlife',
            dog: 'cute dog pet domestic animal',
            cat: 'beautiful cat pet domestic feline',
            bird: 'colorful bird wildlife nature',
            frog: 'green frog pond nature wildlife'
        };
        
        return searchTerms[animal] || `wild ${animal} wildlife nature`;
    }

    formatImageData(photo, size, animal) {
        return {
            url: photo.src[size] || photo.src.medium,
            width: photo.width,
            height: photo.height,
            title: `Beautiful ${animal.charAt(0).toUpperCase() + animal.slice(1)}`,
            photographer: photo.photographer,
            sourceUrl: photo.url,
            pexelsId: photo.id,
            alt: `Stunning ${animal} photograph by ${photo.photographer}`,
            originalUrl: photo.src.original,
            largeUrl: photo.src.large,
            mediumUrl: photo.src.medium,
            smallUrl: photo.src.small,
            average_color: photo.avg_color
        };
    }

    getFallbackImage(animal) {
        const fallback = this.fallbackImages[animal];
        
        if (fallback) {
            console.log(`🎨 Using fallback image for ${animal}`);
            return {
                ...fallback,
                isFallback: true,
                sourceUrl: null
            };
        }
        
        // Generic fallback
        return {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNFN0UwRUMiLz48dGV4dCB4PSIyMDAiIHk9IjIwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjY0IiBmaWxsPSIjOTM4Rjk5Ij7wn6aCPC90ZXh0Pjwvc3ZnPg==',
            title: `${animal.charAt(0).toUpperCase() + animal.slice(1)} - Wildlife Image`,
            photographer: 'Animal Sounds Team',
            alt: `Generic ${animal} illustration`,
            isFallback: true,
            sourceUrl: null
        };
    }

    async respectRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.rateLimitDelay) {
            const delay = this.rateLimitDelay - timeSinceLastRequest;
            console.log(`⏳ Rate limiting: waiting ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        this.lastRequestTime = Date.now();
    }

    updateMetrics(responseTime, success) {
        if (success) {
            this.metrics.averageResponseTime = 
                (this.metrics.averageResponseTime * this.metrics.apiCalls + responseTime) / 
                (this.metrics.apiCalls + 1);
        }
    }

    /**
     * Preload images for better performance
     */
    async preloadImages(animals) {
        console.log('🚀 Preloading images for better performance...');
        
        const preloadPromises = animals.map(animal => {
            return this.fetchAnimalImage(animal).catch(error => {
                console.warn(`Failed to preload ${animal}:`, error);
            });
        });
        
        await Promise.allSettled(preloadPromises);
        console.log('✅ Image preloading completed');
    }

    /**
     * Get multiple images for an animal
     */
    async getImageGallery(animal, count = 5) {
        return this.fetchAnimalImage(animal, { 
            multiple: true,
            count 
        });
    }

    /**
     * Search for images with custom query
     */
    async searchImages(query, options = {}) {
        return this.makeImageRequest(query, {
            ...options,
            multiple: true
        });
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 Image cache cleared');
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    /**
     * Get performance metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            cacheHitRate: this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses),
            isOnline: this.isOnline,
            cacheSize: this.cache.size
        };
    }

    /**
     * Queue request for when online
     */
    queueRequest(animal, options = {}) {
        this.requestQueue.push({ animal, options });
        console.log(`📋 Queued image request for ${animal}`);
    }

    async processRequestQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) return;
        
        this.isProcessingQueue = true;
        console.log(`🔄 Processing ${this.requestQueue.length} queued requests...`);
        
        while (this.requestQueue.length > 0 && this.isOnline) {
            const { animal, options } = this.requestQueue.shift();
            try {
                await this.fetchAnimalImage(animal, options);
                await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
            } catch (error) {
                console.warn(`Failed to process queued request for ${animal}:`, error);
            }
        }
        
        this.isProcessingQueue = false;
        console.log('✅ Request queue processed');
    }

    /**
     * Download image
     */
    async downloadImage(imageData, filename) {
        try {
            if (imageData.isFallback) {
                throw new Error('Cannot download fallback images');
            }
            
            const response = await fetch(imageData.url);
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || `${imageData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            console.log('💾 Image downloaded successfully');
        } catch (error) {
            console.error('Failed to download image:', error);
            throw error;
        }
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        this.clearCache();
        this.requestQueue = [];
    }
}

// Legacy function for backward compatibility
export const fetchAnimalImage = (animal) => {
    const api = new ImageAPI();
    return api.fetchAnimalImage(animal);
};
