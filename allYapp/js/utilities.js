/**
 * Animal Sounds Soundboard - Utility Modules
 * Modern modular architecture with event-driven design
 */

/**
 * Event Emitter base class for module communication
 */
class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }

    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event callback for ${event}:`, error);
                }
            });
        }
    }

    off(event, callback) {
        if (this.events.has(event)) {
            const callbacks = this.events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
}

/**
 * Sound Manager - Handles all audio operations
 */
export class SoundManager extends EventEmitter {
    constructor() {
        super();
        this.sounds = new Map();
        this.currentlyPlaying = new Set();
        this.volume = 1;
        this.totalPlays = 0;
        this.isInitialized = false;
        
        // Sound configurations
        this.soundConfigs = {
            LionRoar: { path: './allYapp/audio/LionRoar.mp3', animal: 'lion', preload: true },
            ElephantTrumpet: { path: './allYapp/audio/ElephantTrumpet.mp3', animal: 'elephant', preload: true },
            DogBark: { path: './allYapp/audio/DogBark.mp3', animal: 'dog', preload: true },
            CatMeow: { path: './allYapp/audio/CatMeow.mp3', animal: 'cat', preload: false },
            BirdChirp: { path: './allYapp/audio/BirdChirp.mp3', animal: 'bird', preload: false },
            FrogCroak: { path: './allYapp/audio/FrogCroak.mp3', animal: 'frog', preload: false }
        };
    }

    async init() {
        console.log('🔊 Initializing Sound Manager...');
        
        // Initialize audio context for better cross-browser support
        this.initializeAudioContext();
        
        // Load sounds
        await this.loadSounds();
        
        // Setup global audio event handlers
        this.setupGlobalHandlers();
        
        this.isInitialized = true;
        console.log('✅ Sound Manager initialized');
    }

    initializeAudioContext() {
        // Create audio context for Web Audio API features
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    async loadSounds() {
        const loadPromises = Object.entries(this.soundConfigs).map(([id, config]) => {
            return this.loadSound(id, config);
        });

        await Promise.allSettled(loadPromises);
        console.log(`Loaded ${this.sounds.size} sounds`);
    }

    async loadSound(id, config) {
        try {
            const audio = new Audio();
            
            // Set up audio properties
            audio.preload = config.preload ? 'auto' : 'metadata';
            audio.volume = this.volume;
            audio.crossOrigin = 'anonymous';
            
            // Event handlers
            audio.addEventListener('loadeddata', () => {
                console.log(`✅ Loaded sound: ${id}`);
            });
            
            audio.addEventListener('error', (error) => {
                console.error(`❌ Failed to load sound ${id}:`, error);
            });
            
            audio.addEventListener('ended', () => {
                this.currentlyPlaying.delete(id);
                this.updatePlayingStates();
                this.emit('soundEnded', { id, animal: config.animal });
            });
            
            audio.addEventListener('play', () => {
                this.currentlyPlaying.add(id);
                this.updatePlayingStates();
            });
            
            audio.addEventListener('pause', () => {
                this.currentlyPlaying.delete(id);
                this.updatePlayingStates();
            });

            // Load the audio
            audio.src = config.path;
            
            // Store sound with metadata
            this.sounds.set(id, {
                audio,
                config,
                lastPlayed: null,
                playCount: 0
            });

            // Preload if specified
            if (config.preload) {
                await new Promise((resolve, reject) => {
                    audio.addEventListener('canplaythrough', resolve, { once: true });
                    audio.addEventListener('error', reject, { once: true });
                    audio.load();
                });
            }

        } catch (error) {
            console.error(`Failed to load sound ${id}:`, error);
        }
    }

    async playSound(soundId, metadata = {}) {
        if (!this.sounds.has(soundId)) {
            console.warn(`Sound ${soundId} not found`);
            return;
        }

        try {
            // Resume audio context if needed
            if (this.audioContext && this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            const soundData = this.sounds.get(soundId);
            const { audio, config } = soundData;

            // Stop if already playing
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }

            // Update metadata
            soundData.lastPlayed = Date.now();
            soundData.playCount++;
            this.totalPlays++;

            // Play the sound
            await audio.play();

            // Emit event with enriched data
            const eventData = {
                id: soundId,
                animal: config.animal,
                title: metadata.title || config.animal,
                timestamp: soundData.lastPlayed,
                playCount: soundData.playCount,
                duration: audio.duration
            };

            this.emit('soundPlay', eventData);
            console.log(`🎵 Playing sound: ${soundId}`);

        } catch (error) {
            console.error(`Failed to play sound ${soundId}:`, error);
            this.emit('soundError', { id: soundId, error: error.message });
        }
    }

    stopAllSounds() {
        let stoppedCount = 0;
        
        for (const [id, soundData] of this.sounds) {
            const { audio } = soundData;
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
                stoppedCount++;
            }
        }

        this.currentlyPlaying.clear();
        this.updatePlayingStates();
        this.emit('soundStop', { stoppedCount });
        
        console.log(`🔇 Stopped ${stoppedCount} sounds`);
    }

    pauseAllSounds() {
        for (const [id, soundData] of this.sounds) {
            const { audio } = soundData;
            if (!audio.paused) {
                audio.pause();
            }
        }
        this.emit('soundsPaused');
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        for (const soundData of this.sounds.values()) {
            soundData.audio.volume = this.volume;
        }

        this.emit('volumeChange', this.volume);
        console.log(`🔊 Volume set to ${Math.round(this.volume * 100)}%`);
    }

    getVolume() {
        return this.volume;
    }

    getTotalPlays() {
        return this.totalPlays;
    }

    getSoundStats() {
        const stats = {};
        for (const [id, soundData] of this.sounds) {
            stats[id] = {
                playCount: soundData.playCount,
                lastPlayed: soundData.lastPlayed,
                duration: soundData.audio.duration
            };
        }
        return stats;
    }

    updatePlayingStates() {
        // Update UI states for playing sounds
        document.querySelectorAll('.md-sound-card').forEach(card => {
            const isPlaying = this.currentlyPlaying.has(card.id);
            card.classList.toggle('playing', isPlaying);
        });
    }

    setupGlobalHandlers() {
        // Handle audio interruption (mobile)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllSounds();
            }
        });
    }

    cleanup() {
        this.stopAllSounds();
        
        for (const soundData of this.sounds.values()) {
            soundData.audio.removeAttribute('src');
            soundData.audio.load();
        }
        
        this.sounds.clear();
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}

/**
 * Theme Manager - Handles dark/light theme switching
 */
export class ThemeManager extends EventEmitter {
    constructor() {
        super();
        this.currentTheme = 'light';
        this.themeKey = 'animal-sounds-theme';
    }

    async init() {
        console.log('🎨 Initializing Theme Manager...');
        
        // Load saved theme or detect system preference
        this.loadTheme();
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        console.log(`✅ Theme Manager initialized (${this.currentTheme} theme)`);
    }

    loadTheme() {
        // Try to load saved theme
        const savedTheme = localStorage.getItem(this.themeKey);
        
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
            this.currentTheme = savedTheme;
        } else {
            // Detect system preference
            this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('.material-icons');
            if (icon) {
                icon.textContent = this.currentTheme === 'dark' ? 'light_mode' : 'dark_mode';
            }
            themeToggle.setAttribute('aria-label', 
                `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} mode`
            );
        }

        // Update meta theme color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.content = this.currentTheme === 'dark' ? '#141218' : '#6750A4';
        }

        this.emit('themeChanged', this.currentTheme);
        console.log(`🎨 Applied ${this.currentTheme} theme`);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        
        // Emit event with transition effect
        this.emit('themeToggled', this.currentTheme);
    }

    saveTheme() {
        localStorage.setItem(this.themeKey, this.currentTheme);
    }

    watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Only update if user hasn't manually set a theme
            if (!localStorage.getItem(this.themeKey)) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }

    getCurrentTheme() {
        return this.currentTheme;
    }
}

/**
 * Navigation Manager - Handles app navigation and routing
 */
export class NavigationManager extends EventEmitter {
    constructor() {
        super();
        this.currentSection = 'soundboard';
        this.isDrawerOpen = false;
    }

    async init() {
        console.log('🧭 Initializing Navigation Manager...');
        
        this.setupNavigationEvents();
        this.setupDrawerEvents();
        this.handleInitialNavigation();
        
        console.log('✅ Navigation Manager initialized');
    }

    setupNavigationEvents() {
        // Handle navigation item clicks
        document.addEventListener('click', (event) => {
            const navItem = event.target.closest('[href^="#"]');
            if (navItem) {
                this.handleNavigation(event);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            this.handleHashChange();
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });
    }

    setupDrawerEvents() {
        // Menu button
        const menuButton = document.getElementById('menu-button');
        if (menuButton) {
            menuButton.addEventListener('click', () => {
                this.toggleDrawer();
            });
        }

        // Drawer scrim
        const scrim = document.getElementById('nav-scrim');
        if (scrim) {
            scrim.addEventListener('click', () => {
                this.closeDrawer();
            });
        }

        // Close drawer on navigation
        this.on('navigationChanged', () => {
            this.closeDrawer();
        });

        // Escape key to close drawer
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isDrawerOpen) {
                this.closeDrawer();
            }
        });
    }

    handleNavigation(event) {
        const link = event.target.closest('[href^="#"]');
        if (!link) return;

        event.preventDefault();
        
        const targetSection = link.getAttribute('href').substring(1);
        this.navigateToSection(targetSection);
    }

    navigateToSection(section) {
        if (section === this.currentSection) return;

        // Validate section exists
        const targetElement = document.getElementById(section);
        if (!targetElement) {
            console.warn(`Section ${section} not found`);
            return;
        }

        // Update current section
        const previousSection = this.currentSection;
        this.currentSection = section;

        // Update URL hash
        history.pushState(null, '', `#${section}`);

        // Update navigation states
        this.updateNavigationStates();

        // Smooth scroll to section
        this.scrollToSection(section);

        // Emit navigation event
        this.emit('navigationChanged', {
            from: previousSection,
            to: section
        });

        console.log(`🧭 Navigated to: ${section}`);
    }

    updateNavigationStates() {
        // Update drawer navigation items
        document.querySelectorAll('.md-navigation-drawer__item').forEach(item => {
            const href = item.getAttribute('href');
            const isActive = href === `#${this.currentSection}`;
            item.classList.toggle('active', isActive);
        });

        // Update bottom navigation items
        document.querySelectorAll('.md-navigation-bar__item').forEach(item => {
            const href = item.getAttribute('href');
            const isActive = href === `#${this.currentSection}`;
            item.classList.toggle('active', isActive);
        });
    }

    scrollToSection(section) {
        const targetElement = document.getElementById(section);
        if (targetElement) {
            const headerOffset = 80; // Account for fixed header
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && hash !== this.currentSection) {
            this.navigateToSection(hash);
        }
    }

    handleInitialNavigation() {
        const initialHash = window.location.hash.substring(1);
        if (initialHash) {
            this.navigateToSection(initialHash);
        } else {
            this.updateNavigationStates();
        }
    }

    toggleDrawer() {
        if (this.isDrawerOpen) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    }

    openDrawer() {
        const drawer = document.getElementById('nav-drawer');
        const scrim = document.getElementById('nav-scrim');
        
        if (drawer) {
            drawer.classList.add('open');
            this.isDrawerOpen = true;
        }
        
        if (scrim) {
            scrim.classList.add('show');
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        this.emit('drawerOpened');
    }

    closeDrawer() {
        const drawer = document.getElementById('nav-drawer');
        const scrim = document.getElementById('nav-scrim');
        
        if (drawer) {
            drawer.classList.remove('open');
            this.isDrawerOpen = false;
        }
        
        if (scrim) {
            scrim.classList.remove('show');
        }

        // Restore body scroll
        document.body.style.overflow = '';
        
        this.emit('drawerClosed');
    }
}

/**
 * UI Manager - Handles UI updates and interactions
 */
export class UIManager extends EventEmitter {
    constructor() {
        super();
        this.snackbarTimeout = null;
        this.currentImage = null;
    }

    async init() {
        console.log('🎭 Initializing UI Manager...');
        
        this.setupDialogEvents();
        this.setupSnackbarEvents();
        
        console.log('✅ UI Manager initialized');
    }

    setupDialogEvents() {
        // Info button
        const infoButton = document.getElementById('info-button');
        const aboutDialog = document.getElementById('about-dialog');
        
        if (infoButton && aboutDialog) {
            infoButton.addEventListener('click', () => {
                this.showDialog('about-dialog');
            });
        }

        // Dialog close buttons
        document.addEventListener('click', (event) => {
            if (event.target.closest('.dialog-close')) {
                this.closeAllDialogs();
            }
        });

        // Dialog scrim clicks
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('md-dialog__scrim')) {
                this.closeAllDialogs();
            }
        });
    }

    setupSnackbarEvents() {
        // Snackbar close button
        document.addEventListener('click', (event) => {
            if (event.target.closest('.snackbar-action')) {
                this.hideSnackbar();
            }
        });
    }

    updateNowPlaying(data) {
        const nowPlaying = document.getElementById('now-playing');
        const nowPlayingTitle = nowPlaying?.querySelector('.now-playing-title');
        const nowPlayingSubtitle = nowPlaying?.querySelector('.now-playing-subtitle');
        
        if (nowPlayingTitle && nowPlayingSubtitle) {
            nowPlayingTitle.textContent = `Now Playing: ${data.title}`;
            nowPlayingSubtitle.textContent = `${data.animal} sound • Play #${data.playCount}`;
            nowPlaying.classList.add('active');
        }

        // Update live region for accessibility
        this.updateLiveRegion(`Now playing ${data.title} sound`);
    }

    clearNowPlaying() {
        const nowPlaying = document.getElementById('now-playing');
        const nowPlayingTitle = nowPlaying?.querySelector('.now-playing-title');
        const nowPlayingSubtitle = nowPlaying?.querySelector('.now-playing-subtitle');
        
        if (nowPlayingTitle && nowPlayingSubtitle) {
            nowPlayingTitle.textContent = 'Ready to Play';
            nowPlayingSubtitle.textContent = 'Select an animal sound above';
            nowPlaying.classList.remove('active');
        }
    }

    updateVolumeDisplay(volume) {
        const volumeDisplay = document.getElementById('volume-display');
        const volumeSlider = document.getElementById('volume-slider');
        const volumeIcon = document.getElementById('volume-icon');
        
        const percentage = Math.round(volume * 100);
        
        if (volumeDisplay) {
            volumeDisplay.textContent = `${percentage}%`;
        }
        
        if (volumeSlider) {
            volumeSlider.value = volume;
        }
        
        if (volumeIcon) {
            if (volume === 0) {
                volumeIcon.textContent = 'volume_off';
            } else if (volume < 0.5) {
                volumeIcon.textContent = 'volume_down';
            } else {
                volumeIcon.textContent = 'volume_up';
            }
        }
    }

    showImageLoading() {
        const placeholder = document.getElementById('image-placeholder');
        const container = document.getElementById('image-container');
        const loading = document.getElementById('loading-state');
        
        if (placeholder) placeholder.style.display = 'none';
        if (container) container.classList.remove('show');
        if (loading) loading.classList.add('show');
    }

    displayImage(imageData) {
        const placeholder = document.getElementById('image-placeholder');
        const container = document.getElementById('image-container');
        const loading = document.getElementById('loading-state');
        const img = document.getElementById('animal-img');
        const title = document.getElementById('image-title');
        const photographer = document.getElementById('image-photographer');
        const source = document.getElementById('image-source');
        
        if (loading) loading.classList.remove('show');
        
        if (img && imageData.url) {
            img.src = imageData.url;
            img.alt = `Beautiful ${imageData.alt || 'animal'} photograph`;
            
            if (title) title.textContent = imageData.title || 'Wildlife Photography';
            if (photographer) photographer.textContent = imageData.photographer ? `Photo by ${imageData.photographer}` : '';
            if (source) {
                source.href = imageData.sourceUrl || '#';
                source.style.display = imageData.sourceUrl ? 'inline-flex' : 'none';
            }
            
            if (container) {
                container.classList.add('show');
            }
            
            this.currentImage = imageData;
        } else {
            this.showImageError();
        }
    }

    showImageError() {
        const loading = document.getElementById('loading-state');
        const container = document.getElementById('image-container');
        const placeholder = document.getElementById('image-placeholder');
        
        if (loading) loading.classList.remove('show');
        if (container) container.classList.remove('show');
        if (placeholder) {
            placeholder.style.display = 'flex';
            const placeholderText = placeholder.querySelector('.placeholder-text');
            if (placeholderText) {
                placeholderText.textContent = 'Failed to load image. Try another sound!';
            }
        }
        
        this.showSnackbar('Failed to load image 📸', 3000);
    }

    updateFavoriteButton(animal, isFavorite) {
        const soundCard = document.querySelector(`[data-animal="${animal}"]`);
        if (soundCard) {
            const favoriteBtn = soundCard.querySelector('.favorite-btn');
            const icon = favoriteBtn?.querySelector('.material-icons');
            
            if (favoriteBtn && icon) {
                favoriteBtn.classList.toggle('active', isFavorite);
                icon.textContent = isFavorite ? 'favorite' : 'favorite_border';
                favoriteBtn.setAttribute('aria-label', 
                    isFavorite ? 'Remove from favorites' : 'Add to favorites'
                );
            }
        }
    }

    showSnackbar(message, duration = 4000) {
        const snackbar = document.getElementById('snackbar');
        const snackbarText = snackbar?.querySelector('.snackbar-text');
        
        if (snackbar && snackbarText) {
            snackbarText.textContent = message;
            snackbar.classList.add('show');
            
            // Auto-hide
            clearTimeout(this.snackbarTimeout);
            this.snackbarTimeout = setTimeout(() => {
                this.hideSnackbar();
            }, duration);
        }
    }

    hideSnackbar() {
        const snackbar = document.getElementById('snackbar');
        if (snackbar) {
            snackbar.classList.remove('show');
        }
        clearTimeout(this.snackbarTimeout);
    }

    showDialog(dialogId) {
        const dialog = document.getElementById(dialogId);
        if (dialog) {
            dialog.classList.add('show');
            dialog.setAttribute('aria-hidden', 'false');
            
            // Focus first focusable element
            const firstFocusable = dialog.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    closeAllDialogs() {
        document.querySelectorAll('.md-dialog').forEach(dialog => {
            dialog.classList.remove('show');
            dialog.setAttribute('aria-hidden', 'true');
        });
        
        // Restore body scroll
        document.body.style.overflow = '';
    }

    updateLiveRegion(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            // Clear and set to ensure screen reader announces
            liveRegion.textContent = '';
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        }
    }

    handleResize() {
        // Handle responsive updates if needed
        this.emit('resize', {
            width: window.innerWidth,
            height: window.innerHeight
        });
    }
}

/**
 * Favorites Manager - Handles user favorites
 */
export class FavoritesManager extends EventEmitter {
    constructor() {
        super();
        this.favorites = new Set();
        this.storageKey = 'animal-sounds-favorites';
    }

    async init() {
        console.log('❤️ Initializing Favorites Manager...');
        
        this.loadFavorites();
        this.updateFavoritesDisplay();
        
        console.log(`✅ Favorites Manager initialized (${this.favorites.size} favorites)`);
    }

    loadFavorites() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const favArray = JSON.parse(saved);
                this.favorites = new Set(favArray);
            }
        } catch (error) {
            console.error('Failed to load favorites:', error);
            this.favorites = new Set();
        }
    }

    saveFavorites() {
        try {
            const favArray = Array.from(this.favorites);
            localStorage.setItem(this.storageKey, JSON.stringify(favArray));
        } catch (error) {
            console.error('Failed to save favorites:', error);
        }
    }

    toggleFavorite(animal) {
        if (this.favorites.has(animal)) {
            this.removeFavorite(animal);
        } else {
            this.addFavorite(animal);
        }
    }

    addFavorite(animal) {
        if (!this.favorites.has(animal)) {
            this.favorites.add(animal);
            this.saveFavorites();
            this.updateFavoritesDisplay();
            this.emit('favoriteAdded', animal);
        }
    }

    removeFavorite(animal) {
        if (this.favorites.has(animal)) {
            this.favorites.delete(animal);
            this.saveFavorites();
            this.updateFavoritesDisplay();
            this.emit('favoriteRemoved', animal);
        }
    }

    isFavorite(animal) {
        return this.favorites.has(animal);
    }

    getFavorites() {
        return Array.from(this.favorites);
    }

    updateFavoritesDisplay() {
        const favoritesContainer = document.getElementById('favorites-container');
        if (!favoritesContainer) return;

        if (this.favorites.size === 0) {
            favoritesContainer.innerHTML = `
                <div class="empty-favorites">
                    <span class="material-icons">favorite_border</span>
                    <p>No favorites yet. Heart some sounds to see them here!</p>
                </div>
            `;
        } else {
            const favoritesGrid = document.createElement('div');
            favoritesGrid.className = 'favorites-grid';
            
            this.favorites.forEach(animal => {
                const favoriteCard = this.createFavoriteCard(animal);
                favoritesGrid.appendChild(favoriteCard);
            });
            
            favoritesContainer.innerHTML = '';
            favoritesContainer.appendChild(favoritesGrid);
        }
    }

    createFavoriteCard(animal) {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.innerHTML = `
            <div class="favorite-card-content">
                <span class="material-icons">favorite</span>
                <h4>${animal}</h4>
                <button class="play-favorite" data-animal="${animal}">
                    <span class="material-icons">play_arrow</span>
                    Play
                </button>
            </div>
        `;
        
        // Add click handler
        card.querySelector('.play-favorite').addEventListener('click', () => {
            const soundCard = document.querySelector(`[data-animal="${animal}"]`);
            if (soundCard) {
                soundCard.click();
            }
        });
        
        return card;
    }
}

/**
 * Keyboard Manager - Handles keyboard navigation and shortcuts
 */
export class KeyboardManager extends EventEmitter {
    constructor() {
        super();
        this.focusableElements = [];
        this.currentFocusIndex = -1;
    }

    async init() {
        console.log('⌨️ Initializing Keyboard Manager...');
        
        this.updateFocusableElements();
        this.setupKeyboardShortcuts();
        
        console.log('✅ Keyboard Manager initialized');
    }

    updateFocusableElements() {
        this.focusableElements = Array.from(document.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter(el => {
            return el.offsetParent !== null; // Only visible elements
        });
    }

    handleKeyPress(event) {
        const { key, code, ctrlKey, metaKey, shiftKey } = event;
        
        // Handle keyboard shortcuts
        if (ctrlKey || metaKey) {
            this.handleShortcuts(event);
            return;
        }

        // Handle navigation
        switch (code) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.handleArrowNavigation(event);
                break;
            
            case 'Enter':
            case 'Space':
                this.handleActivation(event);
                break;
            
            case 'Escape':
                this.handleEscape(event);
                break;
            
            case 'Tab':
                // Let browser handle tab navigation
                break;
            
            default:
                // Handle letter shortcuts
                this.handleLetterShortcuts(event);
        }
    }

    handleArrowNavigation(event) {
        const soundCards = document.querySelectorAll('.md-sound-card');
        const currentFocus = document.activeElement;
        
        // If focused on a sound card, navigate within them
        if (currentFocus && currentFocus.classList.contains('md-sound-card')) {
            event.preventDefault();
            
            const cards = Array.from(soundCards);
            let currentIndex = cards.indexOf(currentFocus);
            
            switch (event.code) {
                case 'ArrowRight':
                case 'ArrowDown':
                    currentIndex = (currentIndex + 1) % cards.length;
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                    break;
            }
            
            cards[currentIndex].focus();
        }
    }

    handleActivation(event) {
        const activeElement = document.activeElement;
        
        // If on a sound card, play it
        if (activeElement && activeElement.classList.contains('md-sound-card')) {
            event.preventDefault();
            activeElement.click();
        }
    }

    handleEscape(event) {
        // Close dialogs, drawers, etc.
        this.emit('escapePressed');
    }

    handleShortcuts(event) {
        const { key, ctrlKey, metaKey } = event;
        const modifier = ctrlKey || metaKey;
        
        if (modifier) {
            switch (key.toLowerCase()) {
                case 'm':
                    event.preventDefault();
                    this.emit('shortcutMute');
                    break;
                case 'r':
                    event.preventDefault();
                    this.emit('shortcutRandom');
                    break;
                case 'd':
                    event.preventDefault();
                    this.emit('shortcutToggleTheme');
                    break;
            }
        }
    }

    handleLetterShortcuts(event) {
        const { key } = event;
        
        // Quick navigation shortcuts
        switch (key.toLowerCase()) {
            case '1':
                this.navigateToSection('soundboard');
                break;
            case '2':
                this.navigateToSection('gallery');
                break;
            case '3':
                this.navigateToSection('favorites');
                break;
            case 's':
                if (!event.target.matches('input, textarea')) {
                    this.emit('shortcutStop');
                }
                break;
            case 'r':
                if (!event.target.matches('input, textarea')) {
                    event.preventDefault();
                    this.emit('shortcutRandom');
                }
                break;
        }
    }

    navigateToSection(section) {
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    setupKeyboardShortcuts() {
        // Display keyboard shortcuts help
        console.log('⌨️ Keyboard shortcuts available:');
        console.log('  • Arrow keys: Navigate sound cards');
        console.log('  • Enter/Space: Play sound');
        console.log('  • Escape: Close dialogs');
        console.log('  • Ctrl+M: Mute/Stop all');
        console.log('  • Ctrl+R: Random sound');
        console.log('  • Ctrl+D: Toggle theme');
        console.log('  • 1/2/3: Navigate sections');
        console.log('  • S: Stop all sounds');
        console.log('  • R: Random sound');
    }
}

/**
 * Analytics Manager - Tracks usage statistics
 * Simplified version without EventEmitter inheritance to avoid conflicts
 */
export class AnalyticsManager {
    constructor() {
        this.analyticsEvents = [];
        this.sessionStart = Date.now();
        this.storageKey = 'animal-sounds-analytics';
        this.eventListeners = new Map();
    }

    // Simple event handling without inheritance
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in analytics event callback for ${event}:`, error);
                }
            });
        }
    }

    async init() {
        console.log('📊 Initializing Analytics Manager...');
        
        this.loadStoredData();
        this.trackSession();
        
        console.log('✅ Analytics Manager initialized');
    }

    loadStoredData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                this.analyticsEvents = data.events || [];
            }
        } catch (error) {
            console.warn('Failed to load analytics data:', error);
        }
    }

    saveData() {
        try {
            const data = {
                events: this.analyticsEvents.slice(-1000), // Keep last 1000 events
                lastUpdated: Date.now()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save analytics data:', error);
        }
    }

    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            data: { ...data },
            sessionId: this.sessionStart
        };
        
        this.analyticsEvents.push(event);
        this.saveData();
        
        // Emit for real-time tracking
        this.emit('eventTracked', event);
        
        console.log(`📊 Tracked: ${eventName}`, data);
    }

    trackSession() {
        this.trackEvent('session_start', {
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
    }

    getStats() {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        const oneWeek = 7 * oneDay;
        
        const todayEvents = this.analyticsEvents.filter(e => now - e.timestamp < oneDay);
        const weekEvents = this.analyticsEvents.filter(e => now - e.timestamp < oneWeek);
        
        const soundPlays = this.analyticsEvents.filter(e => e.name === 'sound_played');
        const animalCounts = {};
        
        soundPlays.forEach(event => {
            const animal = event.data.animal;
            animalCounts[animal] = (animalCounts[animal] || 0) + 1;
        });
        
        return {
            totalEvents: this.analyticsEvents.length,
            todayEvents: todayEvents.length,
            weekEvents: weekEvents.length,
            totalSoundPlays: soundPlays.length,
            favoriteAnimal: Object.keys(animalCounts).reduce((a, b) => 
                animalCounts[a] > animalCounts[b] ? a : b, null),
            animalCounts,
            sessionDuration: now - this.sessionStart
        };
    }
}
