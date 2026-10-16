export type MenuCategory =
  | "Pizzas classiques"
  | "Pizzas signatures"
  | "Spécialités"
  | "Boissons"
  | "Suppléments";

export type MenuOption = {
  id: string;
  label: string;
  priceAr: number;
};

export type MenuProduct = {
  id: string;
  isExample: boolean;
  name: string;
  category: MenuCategory;
  description: string;
  image: string;
  imageAlt: string;
  sizes: MenuOption[];
  extras: MenuOption[];
};

export const siteConfig = {
  name: "Oh! La! La Pizza's",
  phoneDisplay: "032 88 539 96",
  phoneTel: "+261328853996",
  whatsappNumber: "261328853996",
  address: "P77R+7W7, rue Sainte-Marie, Antsiranana 201, Madagascar",
  mapsSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=Oh%21+La%21+La+Pizza%27s%2C+Rue+Sainte+Marie%2C+Antsiranana%2C+Madagascar",
  mapsEmbedUrl: "",
  mapsPlaceUrl: "",
  locationVerified: false,
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Oh%21+La%21+La+Pizza%27s%2C+P77R%2B7W7%2C+Rue+Sainte-Marie%2C+Antsiranana%2C+Madagascar",
  closingTimeNote: "Fermeture annoncée à 22 h — à confirmer auprès du propriétaire.",
  heroImage:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1800&q=88",
  storyImage:
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=82",
  storyText:
    "Les bons repas rapprochent les gens. Chez Oh! La! La Pizza's, chaque visite est une invitation à savourer de bons moments, à partager un repas et à créer de beaux souvenirs.",
  storyIsProposal: true,
  demoMode: true,
  pricesVerified: false,
  onlineOrderingEnabled: false,
  menuCategories: [
    "Pizzas classiques",
    "Pizzas signatures",
    "Spécialités",
    "Boissons",
    "Suppléments",
  ] satisfies MenuCategory[],
  socialLinks: [] as { label: string; href: string }[],
} as const;

const exampleImages = {
  margherita:
    "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=1000&q=82",
  signature:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=82",
  special:
    "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=1000&q=82",
  drink:
    "https://images.unsplash.com/photo-1634407094698-edb277926ef7?auto=format&fit=crop&w=1000&q=82",
  extra:
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1000&q=82",
};

/**
 * Tous les produits, formats, suppléments et tarifs ci-dessous sont fictifs.
 * Remplacez-les par la carte validée avant publication.
 */
export const menuProducts: MenuProduct[] = [
  {
    id: "classique-demo",
    isExample: true,
    name: "Pizza classique — exemple",
    category: "Pizzas classiques",
    description: "Nom, composition et description à remplacer par la carte réelle.",
    image: exampleImages.margherita,
    imageAlt: "Pizza photographiée pour illustrer une fiche de menu de démonstration",
    sizes: [
      { id: "solo", label: "Solo · exemple", priceAr: 22000 },
      { id: "partage", label: "À partager · exemple", priceAr: 34000 },
    ],
    extras: [{ id: "extra-demo", label: "Supplément · exemple", priceAr: 5000 }],
  },
  {
    id: "signature-demo",
    isExample: true,
    name: "Pizza signature — exemple",
    category: "Pizzas signatures",
    description: "Produit et ingrédients fictifs — à confirmer avec le propriétaire.",
    image: exampleImages.signature,
    imageAlt: "Pizza photographiée pour illustrer une fiche de menu de démonstration",
    sizes: [
      { id: "solo", label: "Solo · exemple", priceAr: 29000 },
      { id: "partage", label: "À partager · exemple", priceAr: 42000 },
    ],
    extras: [{ id: "extra-demo", label: "Supplément · exemple", priceAr: 6000 }],
  },
  {
    id: "specialite-demo",
    isExample: true,
    name: "Spécialité — exemple",
    category: "Spécialités",
    description: "Nom, recette et disponibilité à remplacer par les informations vérifiées.",
    image: exampleImages.special,
    imageAlt: "Pizza photographiée pour illustrer une spécialité de démonstration",
    sizes: [{ id: "portion", label: "Format · exemple", priceAr: 36000 }],
    extras: [],
  },
  {
    id: "boisson-demo",
    isExample: true,
    name: "Boisson — exemple",
    category: "Boissons",
    description: "Référence, format et disponibilité à confirmer.",
    image: exampleImages.drink,
    imageAlt: "Boisson photographiée pour illustrer une fiche de menu de démonstration",
    sizes: [{ id: "verre", label: "Format · exemple", priceAr: 8000 }],
    extras: [],
  },
  {
    id: "supplement-demo",
    isExample: true,
    name: "Supplément — exemple",
    category: "Suppléments",
    description: "Nom et tarif de démonstration — à remplacer avant publication.",
    image: exampleImages.extra,
    imageAlt: "Plat photographié pour illustrer un supplément de démonstration",
    sizes: [{ id: "portion", label: "Portion · exemple", priceAr: 5000 }],
    extras: [],
  },
];

export const ownerLaunchChecklist = [
  "Valider le vrai menu, les noms, ingrédients, formats et tarifs.",
  "Confirmer l'horaire de fermeture de 22 h et renseigner les autres horaires.",
  "Confirmer l'adresse et l'épingle Google Maps avant d'intégrer une carte.",
  "Autoriser ou non la prise de demandes via WhatsApp.",
  "Remplacer les photos d'illustration par des visuels autorisés du restaurant.",
  "Valider le texte de présentation et ajouter la véritable histoire.",
  "Ajouter les vrais liens sociaux, si disponibles.",
] as const;
