// Maps our local animal IDs to better API Ninjas search terms
export const ANIMAL_LOOKUP = {
  dog: {
    searchTerms: ["domestic dog", "Canis lupus familiaris", "dog"],
    override: {
      name: "Dog",
      taxonomy: {
        kingdom: "Animalia",
        phylum: "Chordata",
        class: "Mammalia",
        order: "Carnivora",
        family: "Canidae",
        genus: "Canis",
        scientific_name: "Canis lupus familiaris"
      },
      locations: ["Global"],
      characteristics: {
        common_name: "Domestic Dog",
        slogan: "Man's best friend with hundreds of distinct breeds!",
        diet: "Omnivore",
        habitat: "Human settlements worldwide",
        lifespan: "10 - 13 years",
        weight: "1kg - 80kg (2lbs - 175lbs)",
        group: "Mammal",
        group_behavior: "Pack",
        skin_type: "Fur",
        most_distinctive_feature: "Incredible variety of shapes, sizes, and vocalizations",
        top_speed: "45 mph",
        estimated_population_size: "900 million"
      }
    }
  },
  cat: {
    searchTerms: ["domestic cat", "Felis catus", "cat"],
    override: {
      name: "Cat",
      taxonomy: {
        kingdom: "Animalia",
        phylum: "Chordata",
        class: "Mammalia",
        order: "Carnivora",
        family: "Felidae",
        genus: "Felis",
        scientific_name: "Felis catus"
      },
      locations: ["Global"],
      characteristics: {
        common_name: "Domestic Cat",
        slogan: "Purrs, meows, chirps, and trills — all for humans!",
        diet: "Carnivore",
        habitat: "Human settlements worldwide",
        lifespan: "12 - 18 years",
        weight: "2kg - 8kg (4lbs - 18lbs)",
        group: "Mammal",
        group_behavior: "Solitary",
        skin_type: "Fur",
        most_distinctive_feature: "Flexible body and a wide range of vocal communications",
        top_speed: "30 mph",
        estimated_population_size: "600 million"
      }
    }
  },
  bird: {
    searchTerms: ["songbird", "Passeriformes", "sparrow"],
    override: {
      name: "Songbird",
      taxonomy: {
        kingdom: "Animalia",
        phylum: "Chordata",
        class: "Aves",
        order: "Passeriformes",
        family: "Passeridae"
      },
      locations: ["Global"],
      characteristics: {
        common_name: "Songbird",
        slogan: "Nature's musicians with complex melodies!",
        diet: "Omnivore",
        habitat: "Forests, grasslands, wetlands, gardens",
        lifespan: "2 - 10 years",
        weight: "10g - 1kg (0.3oz - 2.2lbs)",
        group: "Bird",
        group_behavior: "Flock",
        skin_type: "Feathers",
        most_distinctive_feature: "Complex vocal learning used for territory and mating songs",
        top_speed: "25 mph",
        estimated_population_size: "5,000+ species"
      }
    }
  }
};

export default ANIMAL_LOOKUP;
