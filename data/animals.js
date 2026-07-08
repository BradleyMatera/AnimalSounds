const animals = [
  {
    id: "lion",
    name: "Lion",
    scientificName: "Panthera leo",
    description:
      "Lions are apex predators known for their powerful roar that can be heard up to 8 km away.",
    habitat: "Savanna",
    continent: "Africa",
    region: "Sub-Saharan Africa",
    audio: "/audio/LionRoar.mp3",
    fallbackImage: "/images/lion.jpg",
    emoji: "🦁",
    status: "Vulnerable",
    soundType: "Roar",
    funFact: "A lion's roar is one of the loudest calls of any big cat — reaching 114 decibels.",
    accent: "from-orange-500/80 via-amber-500/80 to-rose-500/80"
  },
  {
    id: "elephant",
    name: "Elephant",
    scientificName: "Loxodonta africana",
    description:
      "The African elephant is the largest land mammal and communicates with low-frequency rumbles below human hearing.",
    habitat: "Savanna",
    continent: "Africa",
    region: "Eastern & Southern Africa",
    audio: "/audio/ElephantTrumpet.mp3",
    fallbackImage: "/images/elephant.jpg",
    emoji: "🐘",
    status: "Endangered",
    soundType: "Trumpet",
    funFact: "Elephants can hear rumbles through their feet from over 10 km away.",
    accent: "from-slate-500/80 via-blue-500/80 to-cyan-400/80"
  },
  {
    id: "dog",
    name: "Dog",
    scientificName: "Canis lupus familiaris",
    description:
      "Domestic dogs have evolved alongside humans for thousands of years, developing diverse vocalizations.",
    habitat: "Forest",
    continent: "Global",
    region: "Worldwide",
    audio: "/audio/DogBark.mp3",
    fallbackImage: "/images/dog.jpg",
    emoji: "🐶",
    status: "Domesticated",
    soundType: "Bark",
    funFact: "Dogs can understand over 150 words and intentionally use barks to communicate.",
    accent: "from-amber-500/80 via-orange-500/80 to-red-400/80"
  },
  {
    id: "cat",
    name: "Cat",
    scientificName: "Felis catus",
    description:
      "Cats communicate with a wide range of sounds including purring, meowing, chirping, and trilling.",
    habitat: "Forest",
    continent: "Global",
    region: "Worldwide",
    audio: "/audio/CatMeow.mp3",
    fallbackImage: "/images/cat.jpg",
    emoji: "🐱",
    status: "Domesticated",
    soundType: "Meow",
    funFact: "Adult cats mostly meow to communicate with humans, not other cats.",
    accent: "from-purple-500/80 via-violet-500/80 to-indigo-400/80"
  },
  {
    id: "bird",
    name: "Songbird",
    scientificName: "Passeriformes",
    description:
      "Songbirds produce complex melodies to mark territory, attract mates, and warn of danger.",
    habitat: "Forest",
    continent: "Global",
    region: "Worldwide",
    audio: "/audio/BirdChirp.mp3",
    fallbackImage: "/images/bird.jpg",
    emoji: "🐦",
    status: "Least Concern",
    soundType: "Chirp",
    funFact: "Some songbirds learn their songs the same way children learn speech.",
    accent: "from-emerald-500/80 via-teal-500/80 to-sky-400/80"
  },
  {
    id: "frog",
    name: "Tree Frog",
    scientificName: "Hyla cinerea",
    description:
      "Tree frogs use croaks, ribbits, and chirps to communicate during the night in humid environments.",
    habitat: "Wetlands",
    continent: "North America",
    region: "Eastern United States",
    audio: "/audio/FrogCroak.mp3",
    fallbackImage: "/images/frog.jpg",
    emoji: "🐸",
    status: "Least Concern",
    soundType: "Croak",
    funFact: "Many frogs can be identified by their unique call, like a vocal fingerprint.",
    accent: "from-lime-500/80 via-green-500/80 to-emerald-400/80"
  }
];

export const continents = ["All", "Africa", "Global", "North America"];
export const habitats = ["All", "Savanna", "Forest", "Wetlands"];
export const soundTypes = ["All", "Roar", "Trumpet", "Bark", "Meow", "Chirp", "Croak"];
export const statusBadges = {
  "Least Concern": "success",
  Vulnerable: "warning",
  Endangered: "danger",
  Domesticated: "primary"
};

export const HABITAT_DATA = [
  {
    id: "forest",
    name: "Forest",
    description: "Canopy choirs, rustling leaves, and hidden life beneath the trees.",
    gradient: "from-emerald-900 via-nature-800 to-teal-900",
    accent: "emerald",
    animalCount: 2,
    soundCount: 2
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Whale songs, dolphin clicks, and the rhythm of the deep blue.",
    gradient: "from-blue-950 via-sky-950 to-cyan-950",
    accent: "sky",
    animalCount: 0,
    soundCount: 0
  },
  {
    id: "savanna",
    name: "Savanna",
    description: "Roaring lions, rumbling elephants, and golden grasslands.",
    gradient: "from-orange-950 via-amber-950 to-yellow-950",
    accent: "amber",
    animalCount: 2,
    soundCount: 2
  },
  {
    id: "wetlands",
    name: "Wetlands",
    description: "Frog choruses, waterbirds, and life at the water's edge.",
    gradient: "from-lime-950 via-green-950 to-emerald-950",
    accent: "lime",
    animalCount: 1,
    soundCount: 1
  }
];

export default animals;
