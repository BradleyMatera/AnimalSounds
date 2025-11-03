const animals = [
  {
    id: "lion",
    name: "Lion",
    scientificName: "Panthera leo",
    description:
      "Lions are apex predators known for their powerful roar that can be heard up to 5 miles away.",
    habitat: "Savannas, grasslands, and woodlands",
    continent: "Africa",
    audio: "/audio/LionRoar.mp3",
  fallbackImage: "/images/lion.svg",
    accent: "from-orange-500/80 via-amber-500/80 to-rose-500/80",
    emoji: "🦁"
  },
  {
    id: "elephant",
    name: "Elephant",
    scientificName: "Loxodonta africana",
    description:
      "The African elephant is the largest land mammal and communicates with low-frequency rumbles.",
    habitat: "Savannas, forests, and deserts",
    continent: "Africa",
    audio: "/audio/ElephantTrumpet.mp3",
  fallbackImage: "/images/elephant.svg",
    accent: "from-slate-500/80 via-blue-500/80 to-cyan-400/80",
    emoji: "🐘"
  },
  {
    id: "dog",
    name: "Dog",
    scientificName: "Canis lupus familiaris",
    description:
      "Domestic dogs have evolved alongside humans for thousands of years, developing diverse vocalizations.",
    habitat: "Human settlements worldwide",
    continent: "Global",
    audio: "/audio/DogBark.mp3",
  fallbackImage: "/images/dog.svg",
    accent: "from-amber-500/80 via-orange-500/80 to-red-400/80",
    emoji: "🐶"
  },
  {
    id: "cat",
    name: "Cat",
    scientificName: "Felis catus",
    description:
      "Cats communicate with a wide range of sounds including purring, meowing, chirping, and trilling.",
    habitat: "Human settlements worldwide",
    continent: "Global",
    audio: "/audio/CatMeow.mp3",
  fallbackImage: "/images/cat.svg",
    accent: "from-purple-500/80 via-violet-500/80 to-indigo-400/80",
    emoji: "🐱"
  },
  {
    id: "bird",
    name: "Songbird",
    scientificName: "Passeriformes",
    description:
      "Songbirds produce complex melodies to mark territory, attract mates, and warn of danger.",
    habitat: "Forests, grasslands, wetlands",
    continent: "Global",
    audio: "/audio/BirdChirp.mp3",
  fallbackImage: "/images/bird.svg",
    accent: "from-emerald-500/80 via-teal-500/80 to-sky-400/80",
    emoji: "🐦"
  },
  {
    id: "frog",
    name: "Tree Frog",
    scientificName: "Hyla cinerea",
    description:
      "Tree frogs use croaks, ribbits, and chirps to communicate during the night in humid environments.",
    habitat: "Wetlands, forests",
    continent: "North America",
    audio: "/audio/FrogCroak.mp3",
  fallbackImage: "/images/frog.svg",
    accent: "from-lime-500/80 via-green-500/80 to-emerald-400/80",
    emoji: "🐸"
  }
];

export const continents = [
  "All",
  "Africa",
  "Global",
  "North America"
];

export default animals;
