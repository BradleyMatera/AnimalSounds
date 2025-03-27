// Soundboard configuration
const SOUNDBOARD_CONFIG = {
    sounds: {
        lion: {
            audio: 'allYapp/audio/LionRoar.mp3',
            image: 'allYapp/img/lion.svg',
            name: 'Lion Roar'
        },
        elephant: {
            audio: 'allYapp/audio/ElephantTrumpet.mp3',
            image: 'allYapp/img/elephant.svg',
            name: 'Elephant Trumpet'
        },
        dog: {
            audio: 'allYapp/audio/DogBark.mp3',
            image: 'allYapp/img/dog.svg',
            name: 'Dog Bark'
        },
        cat: {
            audio: 'allYapp/audio/CatMeow.mp3',
            image: 'allYapp/img/cat.svg',
            name: 'Cat Meow'
        },
        bird: {
            audio: 'allYapp/audio/BirdChirp.mp3',
            image: 'allYapp/img/bird.svg',
            name: 'Bird Chirp'
        },
        frog: {
            audio: 'allYapp/audio/FrogCroak.mp3',
            image: 'allYapp/img/frog.svg',
            name: 'Frog Croak'
        }
    }
};

// State management
const state = {
    currentSound: null,
    audioContext: null,
    gainNode: null,
    volume: 0.5,
    isPlaying: false,
    currentSource: null
};

// DOM Elements
const elements = {
    soundButtons: document.querySelectorAll('.sound-button'),
    stopButton: document.getElementById('stop-button'),
    volumeSlider: document.getElementById('volume-slider'),
    volumeValue: document.getElementById('volume-value'),
    soundName: document.getElementById('sound-name'),
    animalImg: document.getElementById('animal-img'),
    loadingText: document.getElementById('loading-text')
};

// Initialize Web Audio API
async function initAudioContext() {
    try {
        state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        state.gainNode = state.audioContext.createGain();
        state.gainNode.connect(state.audioContext.destination);
        await state.audioContext.resume();
    } catch (error) {
        console.error('Error initializing audio context:', error);
        showError('Failed to initialize audio. Please try refreshing the page.');
    }
}

// Load and play sound
async function playSound(soundKey) {
    try {
        if (!state.audioContext) {
            await initAudioContext();
        }

        const sound = SOUNDBOARD_CONFIG.sounds[soundKey];
        if (!sound) {
            throw new Error('Sound not found');
        }

        // Stop current sound if playing
        if (state.isPlaying) {
            stopSound();
        }

        // Load and play new sound
        const response = await fetch(sound.audio);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await state.audioContext.decodeAudioData(arrayBuffer);
        
        const source = state.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        source.connect(state.gainNode);
        source.start(0);
        state.isPlaying = true;
        state.currentSound = soundKey;
        state.currentSource = source;

        // Update UI
        updateUI(sound);
    } catch (error) {
        console.error('Error playing sound:', error);
        showError('Failed to play sound. Please try again.');
    }
}

// Stop current sound
function stopSound() {
    if (state.isPlaying && state.currentSource) {
        try {
            state.currentSource.stop();
            state.currentSource.disconnect();
            state.currentSource = null;
            state.isPlaying = false;
            state.currentSound = null;
            updateUI();
        } catch (error) {
            console.error('Error stopping sound:', error);
            showError('Failed to stop sound. Please try again.');
        }
    }
}

// Update UI elements
function updateUI(sound = null) {
    if (sound) {
        elements.soundName.textContent = sound.name;
        elements.animalImg.src = sound.image;
        elements.animalImg.style.display = 'block';
        elements.loadingText.style.display = 'none';
    } else {
        elements.soundName.textContent = 'Click an animal to hear its sound!';
        elements.animalImg.style.display = 'none';
        elements.loadingText.style.display = 'block';
    }
}

// Update volume
function updateVolume(value) {
    state.volume = value / 100;
    if (state.gainNode) {
        state.gainNode.gain.value = state.volume;
        elements.volumeValue.textContent = `${value}%`;
    }
}

// Show error message
function showError(message) {
    elements.soundName.textContent = `Error: ${message}`;
    elements.soundName.style.color = '#f44336';
    setTimeout(() => {
        elements.soundName.style.color = '';
    }, 3000);
}

// Event Listeners
elements.soundButtons.forEach(button => {
    button.addEventListener('click', () => {
        const soundKey = button.dataset.sound;
        playSound(soundKey);
    });
});

elements.stopButton.addEventListener('click', stopSound);

elements.volumeSlider.addEventListener('input', (e) => {
    updateVolume(e.target.value);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAudioContext();
    updateUI();
});
