/**
 * Animal Sounds Soundboard - Main Application Entry Point
 * Modern ES6+ implementation with enhanced UX and accessibility
 */

// Import modules
import { 
    SoundManager, 
    ThemeManager, 
    NavigationManager, 
    UIManager,
    FavoritesManager,
    KeyboardManager,
    AnalyticsManager 
} from './utilities.js';
import { ImageAPI } from './api.js';

/**
 * Application class to manage the entire soundboard
 */
class AnimalSoundsApp {
    constructor() {
        this.isInitialized = false;
        this.modules = new Map();
        this.eventListeners = new Map();
        
        // Performance tracking
        this.performanceMarks = {
            appStart: performance.now()
        };
        
        // Bind methods
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            console.log('🎵 Initializing Animal Sounds Soundboard...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve, { once: true });
                });
            }

            // Initialize core modules
            await this.initializeModules();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup global handlers
            this.setupGlobalHandlers();
            
            // Initialize additional sound buttons
            this.addDynamicSoundButtons();
            
            // Mark as initialized
            this.isInitialized = true;
            
            // Performance tracking
            this.performanceMarks.appReady = performance.now();
            const initTime = this.performanceMarks.appReady - this.performanceMarks.appStart;
            console.log(`✅ App initialized in ${initTime.toFixed(2)}ms`);
            
            // Show welcome message
            this.showWelcomeMessage();
            
            // Analytics
            this.modules.get('analytics')?.trackEvent('app_initialized', { 
                initTime,
                userAgent: navigator.userAgent,
                screenSize: `${screen.width}x${screen.height}`
            });

        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleInitError(error);
        }
    }

    /**
     * Initialize all application modules
     */
    async initializeModules() {
        const moduleInitPromises = [
            this.initModule('sound', () => new SoundManager()),
            this.initModule('theme', () => new ThemeManager()),
            this.initModule('navigation', () => new NavigationManager()),
            this.initModule('ui', () => new UIManager()),
            this.initModule('favorites', () => new FavoritesManager()),
            this.initModule('keyboard', () => new KeyboardManager()),
            this.initModule('analytics', () => new AnalyticsManager()),
            this.initModule('imageAPI', () => new ImageAPI())
        ];

        await Promise.all(moduleInitPromises);
        
        // Cross-module dependencies
        this.setupModuleDependencies();
    }

    /**
     * Initialize a single module with error handling
     */
    async initModule(name, factory) {
        try {
            const module = factory();
            await module.init?.();
            this.modules.set(name, module);
            console.log(`✅ ${name} module initialized`);
        } catch (error) {
            console.error(`❌ Failed to initialize ${name} module:`, error);
            // Continue with other modules
        }
    }

    /**
     * Setup dependencies between modules
     */
    setupModuleDependencies() {
        const sound = this.modules.get('sound');
        const ui = this.modules.get('ui');
        const favorites = this.modules.get('favorites');
        const imageAPI = this.modules.get('imageAPI');
        const analytics = this.modules.get('analytics');

        // Connect sound events to UI updates
        if (sound && ui) {
            sound.on('soundPlay', (data) => {
                ui.updateNowPlaying(data);
                analytics?.trackEvent('sound_played', data);
            });
            
            sound.on('soundStop', () => {
                ui.clearNowPlaying();
            });
            
            sound.on('volumeChange', (volume) => {
                ui.updateVolumeDisplay(volume);
            });
        }

        // Connect sound events to image loading
        if (sound && imageAPI && ui) {
            sound.on('soundPlay', async (data) => {
                try {
                    ui.showImageLoading();
                    const imageData = await imageAPI.fetchAnimalImage(data.animal);
                    ui.displayImage(imageData);
                } catch (error) {
                    ui.showImageError();
                    console.error('Failed to load image:', error);
                }
            });
        }

        // Connect favorites to UI
        if (favorites && ui) {
            favorites.on('favoriteAdded', (animal) => {
                ui.updateFavoriteButton(animal, true);
                ui.showSnackbar(`${animal} added to favorites! ❤️`);
            });
            
            favorites.on('favoriteRemoved', (animal) => {
                ui.updateFavoriteButton(animal, false);
                ui.showSnackbar(`${animal} removed from favorites`);
            });
        }
    }

    /**
     * Setup main application event listeners
     */
    setupEventListeners() {
        // Sound button clicks
        this.addEventListener(document, 'click', this.handleSoundButtonClick.bind(this));
        
        // Control button clicks
        this.addEventListener(document, 'click', this.handleControlButtonClick.bind(this));
        
        // Favorite button clicks
        this.addEventListener(document, 'click', this.handleFavoriteButtonClick.bind(this));
        
        // Navigation
        this.addEventListener(document, 'click', this.handleNavigationClick.bind(this));
        
        // Volume control
        this.addEventListener(document, 'input', this.handleVolumeChange.bind(this));
        
        // Keyboard events
        const keyboard = this.modules.get('keyboard');
        if (keyboard) {
            this.addEventListener(document, 'keydown', keyboard.handleKeyPress.bind(keyboard));
        }
        
        // Theme toggle
        this.addEventListener(document, 'click', this.handleThemeToggle.bind(this));
    }

    /**
     * Setup global event handlers
     */
    setupGlobalHandlers() {
        // Visibility change (for pausing sounds when tab is hidden)
        this.addEventListener(document, 'visibilitychange', this.handleVisibilityChange);
        
        // Window resize (for responsive updates)
        this.addEventListener(window, 'resize', this.handleWindowResize);
        
        // Before unload (for cleanup)
        this.addEventListener(window, 'beforeunload', this.handleBeforeUnload);
        
        // Online/offline detection
        this.addEventListener(window, 'online', () => {
            this.modules.get('ui')?.showSnackbar('Connection restored! 🌐');
        });
        
        this.addEventListener(window, 'offline', () => {
            this.modules.get('ui')?.showSnackbar('You are offline 📴');
        });
    }

    /**
     * Add event listener with cleanup tracking
     */
    addEventListener(target, event, handler, options = {}) {
        target.addEventListener(event, handler, options);
        
        // Track for cleanup
        const listeners = this.eventListeners.get(target) || [];
        listeners.push({ event, handler, options });
        this.eventListeners.set(target, listeners);
    }

    /**
     * Handle sound button clicks
     */
    handleSoundButtonClick(event) {
        const soundButton = event.target.closest('.md-sound-card');
        if (!soundButton) return;

        event.preventDefault();
        
        const soundId = soundButton.id;
        const animalName = soundButton.dataset.animal;
        
        if (soundId && animalName) {
            const sound = this.modules.get('sound');
            sound?.playSound(soundId, {
                animal: animalName,
                title: soundButton.querySelector('.sound-title')?.textContent || animalName
            });
        }
    }

    /**
     * Handle control button clicks
     */
    handleControlButtonClick(event) {
        const button = event.target.closest('button');
        if (!button) return;

        if (button.id === 'stop-all-sounds') {
            event.preventDefault();
            this.modules.get('sound')?.stopAllSounds();
            this.modules.get('ui')?.showSnackbar('All sounds stopped 🔇');
        }
        
        if (button.id === 'random-sound' || button.id === 'fab-random') {
            event.preventDefault();
            this.playRandomSound();
        }
    }

    /**
     * Handle favorite button clicks
     */
    handleFavoriteButtonClick(event) {
        const favoriteBtn = event.target.closest('.favorite-btn');
        if (!favoriteBtn) return;

        event.preventDefault();
        event.stopPropagation();
        
        const soundCard = favoriteBtn.closest('.md-sound-card');
        const animalName = soundCard?.dataset.animal;
        
        if (animalName) {
            const favorites = this.modules.get('favorites');
            favorites?.toggleFavorite(animalName);
        }
    }

    /**
     * Handle navigation clicks
     */
    handleNavigationClick(event) {
        const navItem = event.target.closest('[href^="#"]');
        if (!navItem) return;

        const navigation = this.modules.get('navigation');
        navigation?.handleNavigation(event);
    }

    /**
     * Handle volume change
     */
    handleVolumeChange(event) {
        if (event.target.id === 'volume-slider') {
            const volume = parseFloat(event.target.value);
            this.modules.get('sound')?.setVolume(volume);
        }
    }

    /**
     * Handle theme toggle
     */
    handleThemeToggle(event) {
        if (event.target.closest('#theme-toggle')) {
            event.preventDefault();
            this.modules.get('theme')?.toggleTheme();
        }
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause sounds when tab is hidden
            this.modules.get('sound')?.pauseAllSounds();
        }
    }

    /**
     * Handle window resize
     */
    handleWindowResize() {
        // Debounce resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.modules.get('ui')?.handleResize();
        }, 250);
    }

    /**
     * Handle before unload
     */
    handleBeforeUnload() {
        this.cleanup();
    }

    /**
     * Add dynamic sound buttons for additional animals
     */
    addDynamicSoundButtons() {
        const additionalAnimals = [
            { id: 'CatMeow', animal: 'cat', title: 'Cat', description: 'Soft meow', icon: 'pets' },
            { id: 'BirdChirp', animal: 'bird', title: 'Bird', description: 'Sweet chirp', icon: 'flutter_dash' },
            { id: 'FrogCroak', animal: 'frog', title: 'Frog', description: 'Pond croak', icon: 'water_drop' }
        ];

        const soundGrid = document.getElementById('sound-buttons');
        if (!soundGrid) return;

        additionalAnimals.forEach(animal => {
            const button = this.createSoundButton(animal);
            soundGrid.appendChild(button);
        });

        // Update stats
        const soundsCountEl = document.getElementById('sounds-count');
        if (soundsCountEl) {
            soundsCountEl.textContent = document.querySelectorAll('.md-sound-card').length;
        }
    }

    /**
     * Create a sound button element
     */
    createSoundButton({ id, animal, title, description, icon }) {
        const button = document.createElement('button');
        button.id = id;
        button.className = `md-sound-card ${animal}`;
        button.dataset.animal = animal;
        button.setAttribute('tabindex', '0');
        button.setAttribute('aria-label', `Play ${title} sound`);

        button.innerHTML = `
            <div class="sound-card-visual">
                <div class="sound-icon">
                    <span class="material-icons">${icon}</span>
                </div>
                <div class="sound-waves">
                    <span class="wave"></span>
                    <span class="wave"></span>
                    <span class="wave"></span>
                </div>
            </div>
            <div class="sound-card-content">
                <h3 class="sound-title">${title}</h3>
                <p class="sound-description">${description}</p>
                <div class="sound-actions">
                    <span class="material-icons play-icon">play_arrow</span>
                    <button class="favorite-btn" aria-label="Add to favorites">
                        <span class="material-icons">favorite_border</span>
                    </button>
                </div>
            </div>
        `;

        return button;
    }

    /**
     * Play a random sound
     */
    playRandomSound() {
        const soundCards = document.querySelectorAll('.md-sound-card');
        if (soundCards.length === 0) return;

        const randomIndex = Math.floor(Math.random() * soundCards.length);
        const randomCard = soundCards[randomIndex];
        
        randomCard.click();
        
        this.modules.get('ui')?.showSnackbar(`🎲 Playing random sound: ${randomCard.dataset.animal}`);
        this.modules.get('analytics')?.trackEvent('random_sound_played', {
            animal: randomCard.dataset.animal
        });
    }

    /**
     * Show welcome message
     */
    showWelcomeMessage() {
        // Check if first visit
        const isFirstVisit = !localStorage.getItem('animal-sounds-visited');
        
        if (isFirstVisit) {
            localStorage.setItem('animal-sounds-visited', 'true');
            
            setTimeout(() => {
                this.modules.get('ui')?.showSnackbar(
                    '🎵 Welcome to Animal Sounds! Click any animal to hear its sound.',
                    5000
                );
            }, 1000);
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitError(error) {
        console.error('Initialization error:', error);
        
        // Show error message to user
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <h3>⚠️ Something went wrong</h3>
            <p>The app failed to initialize properly. Please refresh the page to try again.</p>
            <button onclick="location.reload()" class="md-filled-button">Refresh Page</button>
        `;
        
        document.body.insertBefore(errorMessage, document.body.firstChild);
        
        // Track error
        this.modules.get('analytics')?.trackEvent('initialization_error', {
            error: error.message,
            stack: error.stack
        });
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        console.log('🧹 Cleaning up app resources...');
        
        // Stop all sounds
        this.modules.get('sound')?.cleanup();
        
        // Remove event listeners
        for (const [target, listeners] of this.eventListeners) {
            for (const { event, handler, options } of listeners) {
                target.removeEventListener(event, handler, options);
            }
        }
        this.eventListeners.clear();
        
        // Cleanup modules
        for (const [name, module] of this.modules) {
            try {
                module.cleanup?.();
            } catch (error) {
                console.warn(`Failed to cleanup ${name} module:`, error);
            }
        }
        
        // Clear timers
        clearTimeout(this.resizeTimeout);
    }

    /**
     * Get app statistics
     */
    getStats() {
        const sound = this.modules.get('sound');
        const favorites = this.modules.get('favorites');
        const analytics = this.modules.get('analytics');
        
        return {
            isInitialized: this.isInitialized,
            soundsAvailable: document.querySelectorAll('.md-sound-card').length,
            totalPlays: sound?.getTotalPlays() || 0,
            favorites: favorites?.getFavorites() || [],
            initTime: this.performanceMarks.appReady - this.performanceMarks.appStart,
            analytics: analytics?.getStats() || {}
        };
    }
}

// Initialize app
const app = new AnimalSoundsApp();

// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    app.modules.get('analytics')?.trackEvent('runtime_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    app.modules.get('analytics')?.trackEvent('promise_rejection', {
        reason: event.reason?.toString()
    });
});

// Export for debugging/testing
if (typeof window !== 'undefined') {
    window.AnimalSoundsApp = app;
}

// Auto-initialize when script loads
app.init().catch(error => {
    console.error('Failed to auto-initialize app:', error);
});

export default app;
