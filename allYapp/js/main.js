// Importing functions from utilities.js
import { initializeSoundButtons, handleKeyboardEvents, addSoundButtons } from './utilities.js';

// Sound and image data
const soundData = {
    LionRoar: {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 9844694 (Initial commit: Animal Sounds Soundboard with GitHub Actions and updated README)
        audio: '/allYapp/audio/lion-roar.mp3',
        image: '/allYapp/img/lion.jpg',
        name: 'Lion Roar'
    },
    ElephantTrumpet: {
        audio: '/allYapp/audio/elephant-trumpet.mp3',
        image: '/allYapp/img/elephant.jpg',
        name: 'Elephant Trumpet'
    },
    DogBark: {
        audio: '/allYapp/audio/dog-bark.mp3',
        image: '/allYapp/img/dog.jpg',
        name: 'Dog Bark'
<<<<<<< HEAD
=======
=======
        audio: '/allYapp/audio/LionRoar.mp3',
        image: '/allYapp/img/lion.svg',
        name: 'Lion Roar'
    },
    ElephantTrumpet: {
        audio: '/allYapp/audio/ElephantTrumpet.mp3',
        image: '/allYapp/img/elephant.svg',
        name: 'Elephant Trumpet'
    },
    DogBark: {
        audio: '/allYapp/audio/DogBark.mp3',
        image: '/allYapp/img/dog.svg',
        name: 'Dog Bark'
    },
    CatMeow: {
        audio: '/allYapp/audio/CatMeow.mp3',
        image: '/allYapp/img/cat.svg',
        name: 'Cat Meow'
    },
    BirdChirp: {
        audio: '/allYapp/audio/BirdChirp.mp3',
        image: '/allYapp/img/bird.svg',
        name: 'Bird Chirp'
    },
    FrogCroak: {
        audio: '/allYapp/audio/FrogCroak.mp3',
        image: '/allYapp/img/frog.svg',
        name: 'Frog Croak'
>>>>>>> 72db770 (Initial commit: Animal Sounds Soundboard)
>>>>>>> 9844694 (Initial commit: Animal Sounds Soundboard with GitHub Actions and updated README)
    }
};

// Audio context and elements
let audioContext;
let currentSound = null;
const volumeSlider = document.getElementById('volume-slider');
const soundButtons = document.querySelectorAll('.sound-button');
const stopButton = document.getElementById('stopAllSounds');
const animalImg = document.getElementById('animal-img');
const loadingText = document.getElementById('loading-text');
const soundNameBox = document.getElementById('sound-name');
const liveRegion = document.getElementById('live-region');

// Initialize audio context
function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Play sound function
async function playSound(soundId) {
    try {
        // Stop any currently playing sound
        if (currentSound) {
            currentSound.stop();
        }

        // Initialize audio context if needed
        if (!audioContext) {
            initAudioContext();
        }

        // Create and load audio buffer
        const response = await fetch(soundData[soundId].audio);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Create source and gain nodes
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        // Set up audio nodes
        source.buffer = audioBuffer;
        gainNode.gain.value = volumeSlider.value;
        
        // Connect nodes
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play sound
        source.start(0);
        currentSound = source;

        // Update UI
        updateImage(soundId);
        updateSoundName(soundData[soundId].name);
        announceSound(soundData[soundId].name);

    } catch (error) {
        console.error('Error playing sound:', error);
        announceSound('Error playing sound');
    }
}

// Stop all sounds
function stopAllSounds() {
    if (currentSound) {
        currentSound.stop();
        currentSound = null;
    }
    announceSound('All sounds stopped');
}

// Update image display
function updateImage(soundId) {
    loadingText.style.display = 'none';
    animalImg.src = soundData[soundId].image;
    animalImg.style.display = 'block';
}

// Update sound name display
function updateSoundName(name) {
    soundNameBox.textContent = name;
}

// Announce sound name for screen readers
function announceSound(name) {
    liveRegion.textContent = name;
}

// Event listeners
soundButtons.forEach(button => {
    button.addEventListener('click', () => {
        playSound(button.id);
    });
});

stopButton.addEventListener('click', stopAllSounds);

volumeSlider.addEventListener('input', (e) => {
    if (currentSound) {
        const gainNode = currentSound.gain;
        if (gainNode) {
            gainNode.gain.value = e.target.value;
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAudioContext();
    initializeSoundButtons();
    document.addEventListener('keydown', handleKeyboardEvents); // Handling keyboard events
    addSoundButtons(); // Add more sound buttons via JavaScript
});
