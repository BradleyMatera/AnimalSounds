// Importing functions from utilities.js
import { initializeSoundButtons, handleKeyboardEvents, addSoundButtons } from './utilities.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeSoundButtons();
    document.addEventListener('keydown', handleKeyboardEvents); // Handling keyboard events
    addSoundButtons(); // Add more sound buttons via JavaScript
});
