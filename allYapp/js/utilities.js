import { fetchAnimalImage } from './api.js';

// Audio files setup
const sounds = {
    LionRoar: new Audio('/allYapp/audio/LionRoar.mp3'),
    ElephantTrumpet: new Audio('/allYapp/audio/ElephantTrumpet.mp3'),
    DogBark: new Audio('/allYapp/audio/DogBark.mp3'),
    CatMeow: new Audio('/allYapp/audio/CatMeow.mp3'),
    BirdChirp: new Audio('/allYapp/audio/BirdChirp.mp3'),
    FrogCroak: new Audio('/allYapp/audio/FrogCroak.mp3')
};

// Mapping sound IDs to animal names for fetching images
const animalNames = {
    LionRoar: 'lion',
    ElephantTrumpet: 'elephant',
    DogBark: 'dog',
    CatMeow: 'cat',
    BirdChirp: 'bird',
    FrogCroak: 'frog'
};

// Initializing sound buttons with click event listeners
const initializeSoundButtons = () => {
    const soundButtons = Array.from(document.querySelectorAll('.sound-button'));
    soundButtons.forEach(button => {
        button.addEventListener('click', () => {
            playSound(button.id);
            fetchAndDisplayImage(button.id); // Fetch and display animal image
            updateLiveRegion(button.textContent); // Update ARIA live region
            displaySoundName(button.textContent); // Display sound name in text box
        });
    });
};

// Function to play sound
const playSound = (soundId) => {
    const sound = sounds[soundId];
    if (!sound.paused) {
        sound.pause();
        sound.currentTime = 0;
    }
    setTimeout(() => {
        sound.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }, 100); // Adding a slight delay before playing the sound again
};

// Function to fetch and display animal image
const fetchAndDisplayImage = (soundId) => {
    const animalName = animalNames[soundId];
    const loadingText = document.getElementById('loading-text');
    const animalImg = document.getElementById('animal-img');
    
    // Show loading text and hide image while fetching
    loadingText.textContent = 'Loading...';
    animalImg.style.display = 'none';

    fetchAnimalImage(animalName)
        .then(imageUrl => {
            if (imageUrl) {
                animalImg.src = imageUrl;
                animalImg.style.display = 'block';
                loadingText.style.display = 'none';
            } else {
                loadingText.textContent = 'No image found.';
                animalImg.style.display = 'none';
            }
        })
        .catch(() => {
            loadingText.textContent = 'Failed to load image.';
            animalImg.style.display = 'none';
        });
};

// Function to stop all sounds
const stopAllSounds = () => {
    Object.values(sounds).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
    });
};

// Function to set volume
const setVolume = (volume) => {
    Object.values(sounds).forEach(sound => {
        sound.volume = volume;
    });
};

// Function to update ARIA live region
const updateLiveRegion = (text) => {
    const liveRegion = document.getElementById('live-region');
    liveRegion.textContent = text;
};

// Function to display sound name in text box
const displaySoundName = (soundName) => {
    const soundNameBox = document.getElementById('sound-name');
    soundNameBox.textContent = `Playing: ${soundName}`;
};

// Handling keyboard events for navigation and interaction
const handleKeyboardEvents = (event) => {
    const soundButtons = Array.from(document.querySelectorAll('.sound-button, #stopAllSounds'));
    let currentButtonIndex = soundButtons.findIndex(button => document.activeElement === button);

    switch (event.code) {
        case 'ArrowRight':
        case 'ArrowDown':
            currentButtonIndex = (currentButtonIndex + 1) % soundButtons.length;
            soundButtons[currentButtonIndex].focus(); // Move focus to next button
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            currentButtonIndex = (currentButtonIndex - 1 + soundButtons.length) % soundButtons.length;
            soundButtons[currentButtonIndex].focus(); // Move focus to previous button
            break;
        case 'Enter':
        case 'Space':
            document.activeElement.click(); // Trigger click event on focused button
            break;
        case 'KeyM':
            stopAllSounds(); // Mute all sounds
            break;
        case 'KeyV':
            setVolume(0.5); // Example volume control (set to 50%)
            break;
        default:
            break;
    }
};

// Adding more sound buttons via JavaScript
const addSoundButtons = () => {
    const soundButtonsContainer = document.getElementById('sound-buttons');
    const additionalSounds = ['CatMeow', 'BirdChirp', 'FrogCroak'];

    additionalSounds.forEach(sound => {
        const button = document.createElement('button');
        button.id = sound;
        button.className = 'sound-button';
        button.setAttribute('aria-label', sound);
        button.textContent = sound;
        button.tabIndex = 0;
        button.addEventListener('click', () => {
            playSound(button.id);
            fetchAndDisplayImage(button.id); // Fetch and display animal image
            updateLiveRegion(button.textContent); // Update ARIA live region
            displaySoundName(button.textContent); // Display sound name in text box
        });
        soundButtonsContainer.appendChild(button); // Adding new button to the DOM
    });
};

// Adding event listener for "Stop All Sounds" button
document.getElementById('stopAllSounds').addEventListener('click', () => {
    stopAllSounds();
    updateLiveRegion('All sounds stopped');
    displaySoundName('All sounds stopped');
});

// Adding event listener for volume slider
document.getElementById('volume-slider').addEventListener('input', (event) => {
    setVolume(event.target.value);
});

// Exporting functions for use in main.js
export { initializeSoundButtons, handleKeyboardEvents, addSoundButtons, fetchAndDisplayImage };
