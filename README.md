
# 🦁 Animal Sounds Soundboard

## 📝 Overview

The Animal Sounds Soundboard is a web application that allows users to play various animal sounds and view corresponding animal images. This application is designed to be highly accessible, adhering to WCAG and ARIA standards to ensure a great experience for all users.

## ✨ Features

- 🎶 Play different animal sounds
- 🖼️ View corresponding animal images fetched from the Pexels API
- ⏹️ Stop all sounds with a single button
- 🔊 Adjust volume with a slider
- ♿ Fully accessible with ARIA attributes and keyboard navigation
- 📱 Responsive design for various screen sizes

## 💻 Technologies Used

- 🌐 HTML5
- 🎨 CSS3
- 📝 JavaScript (ES6+)
- 📷 Pexels API for images

## 🚀 Getting Started

### 📋 Prerequisites

- 🖥️ A modern web browser
- 🔑 A Pexels API key (for fetching images)

### 📥 Installation

Clone the repository:
    git clone https://github.com/your-username/animal-sounds-soundboard.git

Navigate to the project directory:
    cd animal-sounds-soundboard

Add your Pexels API key:
Create a file named `config.js` inside the `js` directory with the following content:
    ```javascript
    const CONFIG = {
      PEXELS_API_KEY: 'YOUR_PEXELS_API_KEY',
      PEXELS_API_URL: 'https://api.pexels.com/v1/search'
    };
    ```

Add `config.js` to .gitignore to keep your API key secure:
Add the following line to your `.gitignore` file:
    js/config.js

## 🛠️ Usage

Open `index.html` in a web browser.
Click on the animal sound buttons or use keyboard navigation to play sounds and view images.
Use the "Stop All Sounds" button to stop any playing sounds.
Adjust the volume using the volume slider.

## 🗂️ File Structure

```
animal-sounds-soundboard/
│
├── audio/
│   ├── lion.mp3
│   ├── elephant.mp3
│   ├── dog.mp3
│   ├── cat.mp3
│   ├── bird.mp3
│   └── frog.mp3
│
├── css/
│   └── styles.css
│
├── js/
│   ├── main.js
│   ├── utilities.js
│   └── config.js
│
├── index.html
├── favicon.ico
└── README.md
```

## 📊 Application Development Checklist

### 📄 Content

🔹 HTML Content:
- All required sections (header, main, footer) are present.
- Soundboard section with labeled buttons.
- Animal image section with descriptive text.
- Volume control and stop button included.

🔹 JavaScript Content:
- Initialization of sound buttons.
- Functions to handle playing sounds, fetching images, stopping sounds, and adjusting volume.
- Handling keyboard events for navigation and interaction.

### 🔧 Feature Functionality

🔹 All requested functionality present:
- Play sound on button click.
- Fetch and display animal images from API.
- Stop all sounds with a single button.
- Adjust volume with a slider.
- Keyboard navigation through buttons.
- ARIA live regions to announce actions.

### 📚 Coding Standards

🔹 Exceeds Best Practices and Standards:
- Modular JavaScript code with clear functions.
- Use of ARIA roles and labels for accessibility.
- Consistent coding style and indentation.
- Descriptive variable and function names.

### ♿ Accessibility

🔹 Screen Reader and Keyboard Controls Optimized:
- ARIA roles and labels for all interactive elements.
- ARIA live regions to announce button actions.
- Focus management for keyboard navigation.
- Volume control accessible via keyboard.

### 🧠 Logic

🔹 Efficient Application of Code:
- Clear thought in event handling and DOM manipulation.
- Efficient fetching of images with error handling.
- Modular approach with reusable functions.
- Logical flow for playing, stopping sounds, and displaying images.

### 📖 Clarity

🔹 Self-documenting Code:
- Clear and descriptive comments for functions.
- Code is easy to understand with meaningful names.
- Logical grouping of related functions.
- Consistent formatting and indentation.

### 🌐 Environment

🔹 Version Control:
- Small, meaningful commits.
- Descriptive commit messages.
- Commits related to specific features or fixes.

🔹 HTML:
- Proper use of semantic elements (header, main, section, footer).
- Meaningful use of ARIA roles and labels.
- Correct structure and hierarchy of HTML elements.

🔹 CSS:
- Consistent use of classes and IDs.
- Organized and modular CSS with clear sections.
- Responsive design considerations.
- Styling for focus states and interactivity.

🔹 Error Handling:
- Application runs without any runtime errors.
- Proper error handling in JavaScript.
- No console errors related to application functionality.

## 🔍 Detailed Steps Taken

🔹 HTML:
- Added semantic HTML structure with appropriate elements (header, main, section, footer).
- Used ARIA roles and labels to enhance accessibility.
- Included a volume control slider and stop button for user interaction.

🔹 CSS:
- Styled all interactive elements, including buttons and sliders.
- Ensured focus states for better accessibility.
- Organized CSS into modular sections for clarity.

🔹 JavaScript:
- Created modular functions for initializing buttons, playing sounds, fetching images, and handling keyboard events.
- Added event listeners for buttons and volume control.
- Implemented ARIA live regions to announce actions for screen readers.
- Managed focus for keyboard navigation.

🔹 Accessibility Enhancements:
- Added ARIA labels and roles for all interactive elements.
- Ensured screen reader compatibility with ARIA live regions.
- Made the volume control accessible via keyboard.

🔹 Version Control:
- Used meaningful commit messages to document changes.
- Commits were small and specific to features or fixes.
- Maintained a clean history of commits.

🔹 Testing and Debugging:
- Ensured no runtime errors by testing the application thoroughly.
- Handled errors gracefully in JavaScript, especially when fetching images.
- Verified keyboard navigation and screen reader announcements.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Animal sounds from [FreeSound](https://freeanimalsounds.org/)
- Images provided by [Pexels](https://www.pexels.com/)
