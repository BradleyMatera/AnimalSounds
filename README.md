# 🦁 Animal Sounds Soundboard (Demo)  
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge)]()  
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=for-the-badge)]()  
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=for-the-badge)]()  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)  

> A **demo soundboard web app** that plays animal sounds, displays images via the **Pexels API**, and is fully accessible (ARIA/WCAG compliant).  

---

## 📝 Overview
- 🎶 Play animal sounds  
- 🖼️ Display images fetched from Pexels API  
- ⏹️ Stop all sounds with one button  
- 🔊 Adjustable volume slider  
- ♿ Screen reader + keyboard accessible  
- 📱 Responsive across devices  
- 🚀 Auto-deployed to **GitHub Pages** via GitHub Actions  

---

## 💻 Technologies Used
- 🌐 HTML5  
- 🎨 CSS3  
- 📝 JavaScript (ES6+)  
- 📷 Pexels API for animal images  
- 🤖 GitHub Actions for deployment  

---

## 🚀 Getting Started

### 📋 Prerequisites
- Modern browser  
- [Pexels API Key](https://www.pexels.com/api/)  

### 📥 Installation
```bash
# Clone repo
git clone https://github.com/your-username/animal-sounds-soundboard.git
cd animal-sounds-soundboard
```

Add your API key in `js/config.js`:  
```javascript
const CONFIG = {
  PEXELS_API_KEY: 'YOUR_PEXELS_API_KEY',
  PEXELS_API_URL: 'https://api.pexels.com/v1/search'
};
```

Add to `.gitignore`:  
```
js/config.js
```

---

## 🛠️ Usage
- Open `index.html` in a browser  
- Click or use keyboard to play sounds + fetch images  
- Use **Stop All Sounds** button to halt playback  
- Adjust volume with slider  

---

## 🗂️ File Structure
```plaintext
animal-sounds-soundboard/
├── audio/
│   ├── lion.mp3
│   ├── elephant.mp3
│   ├── dog.mp3
│   ├── cat.mp3
│   ├── bird.mp3
│   └── frog.mp3
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── utilities.js
│   └── config.js
├── index.html
├── favicon.ico
└── README.md
```

---

## 📊 Development Checklist

### 📄 Content
- Semantic HTML (header, main, footer)  
- Buttons + labels for soundboard  
- Animal images with descriptive alt text  
- Volume slider + stop button  

### 🔧 Functionality
- Play/stop sounds  
- Fetch/display Pexels images  
- Keyboard + ARIA accessible  
- Announcements via ARIA live regions  

### 📚 Standards
- Modular JS with functions  
- Consistent formatting  
- Semantic HTML + ARIA roles  

### ♿ Accessibility
- ARIA roles/labels for all elements  
- Screen reader compatible  
- Full keyboard navigation  
- Volume slider keyboard operable  

### 🧠 Logic
- Efficient event handling  
- Clear DOM manipulation  
- Error handling for API fetches  

### 📖 Clarity
- Self-documented with comments  
- Consistent, meaningful names  

### 🌐 Environment
- Version control with meaningful commits  
- Responsive design CSS  
- Error-free execution  

---

## 🔍 Steps Taken
- Semantic HTML structure with ARIA roles  
- Styled buttons/sliders with focus states  
- Modular JS with reusable functions  
- Screen reader support + ARIA live regions  
- Small, descriptive commits  
- Thorough testing, error handling  

---

## 🤝 Contributing
Contributions welcome → fork repo, branch, PR.  

---

## 📄 License
MIT License → see [LICENSE](LICENSE).  

---

## 🙏 Acknowledgements
- Sounds: [FreeAnimalSounds](https://freeanimalsounds.org/)  
- Images: [Pexels](https://www.pexels.com/)  

---

## 🚀 Deployment
- Auto-deployed to **GitHub Pages** with GitHub Actions on push to main branch.  

---

## 📬 Contact (Demo Owner)
- **Email**: matera.bradley@gmail.com  
- **GitHub**: [BradleyMatera](https://github.com/BradleyMatera)  
- **LinkedIn**: [Brad Matera](https://www.linkedin.com/in/championingempatheticwebsolutionsthroughcode/)  
