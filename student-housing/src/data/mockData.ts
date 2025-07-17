import type { Chambre, Cite } from "../../shared/types";

export const citesData: Cite[] = [
  {
    id: "cite1",
    nom: "Résidence Les Érables",
    ville: "Yaoundé",
    adresse: "12 Avenue des Étudiants, Ngousso",
    coordonnees: { latitude: 3.8480, longitude: 11.5021 },
    description: "Résidence moderne et sécurisée au cœur de Yaoundé, proche de toutes commodités et des universités.",
    noteGlobale: 4.5,
    nombreAvis: 120,
    equipements: ["wifi", "salle_sport", "laverie", "parking"],
    transport: ["bus", "taxi"],
    photos: []
  },
  {
    id: "cite2",
    nom: "Cité Universitaire Nord",
    ville: "Douala",
    adresse: "45 Rue de l'Université, Bonanjo",
    coordonnees: { latitude: 4.0511, longitude: 9.7679 },
    description: "Grande cité universitaire avec restaurant, bibliothèque et espaces de détente. Ambiance étudiante garantie !",
    noteGlobale: 4.2,
    nombreAvis: 85,
    equipements: ["wifi", "restaurant", "bibliotheque", "salle_commune"],
    transport: ["bus"],
    photos: []
  },
  {
    id: "cite3",
    nom: "Campus Résidence",
    ville: "Buea",
    adresse: "78 University Road, Molyko",
    coordonnees: { latitude: 4.1559, longitude: 9.2669 },
    description: "Au cœur de Buea, proche de l'Université de Buea et des grandes écoles de la région.",
    noteGlobale: 4.7,
    nombreAvis: 200,
    equipements: ["wifi", "concierge", "salle_sport", "parking"],
    transport: ["bus", "moto_taxi"],
    photos: []
  }
];

export const chambresData: Chambre[] = [
  {
    id: "1",
    titre: "Studio moderne proche campus de Yaoundé",
    description: "Magnifique studio entièrement rénové, lumineux et moderne, à 5 minutes à pied du campus universitaire de Yaoundé. Parfait pour étudiant sérieux cherchant un cadre de vie agréable.",
    prix: 150000,
    superficie: 25,
    type: "studio",
    citeId: "cite1",
    cite: citesData[0],
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    ],
    equipements: ["wifi", "kitchenette", "douche", "meuble"],
    disponible: true,
    dateDisponibilite: new Date("2024-09-01"),
    caution: 150000,
    chargesIncluses: true,
    note: 4.7,
    nombreAvis: 15,
    contact: {
      nom: "Marie Dubois",
      email: "marie.dubois@email.com",
      telephone: "+237 6 12 34 56 78"
    },
    caracteristiques: {
      etage: 3,
      ascenseur: true,
      balcon: false,
      vue: "cour",
      orientation: "sud",
      meuble: true
    }
  },
  {
    id: "2",
    titre: "Chambre dans T3 partagé - Ambiance conviviale",
    description: "Belle chambre dans un appartement T3 partagé avec 2 autres étudiants. Ambiance conviviale, cuisine équipée et salon spacieux. Parfait pour créer des liens d'amitié !",
    prix: 80000,
    superficie: 12,
    type: "chambre_partagee",
    citeId: "cite2",
    cite: citesData[1],
    photos: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=300&fit=crop"
    ],
    equipements: ["wifi", "cuisine_partagee", "salon", "douche_partagee"],
    disponible: true,
    dateDisponibilite: new Date("2024-08-15"),
    caution: 80000,
    chargesIncluses: false,
    note: 4.3,
    nombreAvis: 8,
    contact: {
      nom: "Thomas Martin",
      email: "thomas.martin@email.com",
      telephone: "+237 6 98 76 54 32"
    },
    caracteristiques: {
      etage: 2,
      ascenseur: false,
      balcon: true,
      vue: "jardin",
      orientation: "est",
      meuble: true
    }
  },
  {
    id: "3",
    titre: "T1 rénové avec terrasse - Buea centre",
    description: "Superbe T1 de 30m² entièrement rénové avec une terrasse de 8m². Situé à Buea, proche de l'Université et de toutes les commodités.",
    prix: 200000,
    superficie: 30,
    type: "T1",
    citeId: "cite3",
    cite: citesData[2],
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop"
    ],
    equipements: ["wifi", "cuisine_equipee", "douche", "meuble", "terrasse"],
    disponible: true,
    dateDisponibilite: new Date("2024-09-15"),
    caution: 200000,
    chargesIncluses: true,
    note: 4.9,
    nombreAvis: 22,
    contact: {
      nom: "Sophie Leroy",
      email: "sophie.leroy@email.com",
      telephone: "+237 6 45 67 89 12"
    },
    caracteristiques: {
      etage: 4,
      ascenseur: true,
      balcon: true,
      vue: "rue",
      orientation: "ouest",
      meuble: true
    }
  },
  {
    id: "4",
    titre: "Studio cosy proche centre-ville Douala",
    description: "Studio cosy et fonctionnel à 10 minutes du centre-ville de Douala. Idéal pour les étudiants qui souhaitent être bien connectés aux transports en commun.",
    prix: 120000,
    superficie: 22,
    type: "studio",
    citeId: "cite1",
    cite: citesData[0],
    photos: [
      "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=300&fit=crop"
    ],
    equipements: ["wifi", "kitchenette", "douche", "meuble", "parking"],
    disponible: false,
    dateDisponibilite: new Date("2024-10-01"),
    caution: 120000,
    chargesIncluses: true,
    note: 4.4,
    nombreAvis: 12,
    contact: {
      nom: "Jean Dupont",
      email: "jean.dupont@email.com",
      telephone: "+237 6 78 12 34 56"
    },
    caracteristiques: {
      etage: 1,
      ascenseur: false,
      balcon: false,
      vue: "cour",
      orientation: "nord",
      meuble: true
    }
  },
  {
    id: "5",
    titre: "Grande chambre en colocation Yaoundé",
    description: "Spacieuse chambre de 15m² dans une colocation de 4 étudiants. Maison avec jardin, parfaite pour les étudiants qui aiment les espaces verts et la vie en communauté.",
    prix: 60000,
    superficie: 15,
    type: "chambre_partagee",
    citeId: "cite2",
    cite: citesData[1],
    photos: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
    ],
    equipements: ["wifi", "cuisine_partagee", "jardin", "salon", "douche_partagee"],
    disponible: true,
    dateDisponibilite: new Date("2024-08-01"),
    caution: 60000,
    chargesIncluses: false,
    note: 4.6,
    nombreAvis: 18,
    contact: {
      nom: "Claire Moreau",
      email: "claire.moreau@email.com",
      telephone: "+237 6 55 44 33 22"
    },
    caracteristiques: {
      etage: 0,
      ascenseur: false,
      balcon: false,
      vue: "jardin",
      orientation: "sud",
      meuble: true
    }
  }
];

export const villesPopulaires = [
  "Yaoundé", "Douala", "Buea", "Bamenda", "Garoua", "Maroua", "Bafoussam", "Ngaoundéré", "Bertoua", "Ebolowa"
];

export const equipementLabels: Record<string, string> = {
  "wifi": "WiFi",
  "kitchenette": "Kitchenette",
  "cuisine_equipee": "Cuisine équipée",
  "cuisine_partagee": "Cuisine partagée",
  "douche": "Douche privée",
  "douche_partagee": "Douche partagée",
  "meuble": "Meublé",
  "salon": "Salon",
  "terrasse": "Terrasse",
  "jardin": "Jardin",
  "parking": "Parking",
  "salle_sport": "Salle de sport",
  "laverie": "Laverie",
  "restaurant": "Restaurant",
  "bibliotheque": "Bibliothèque",
  "salle_commune": "Salle commune",
  "concierge": "Concierge"
};

export const transportLabels: Record<string, string> = {
  "moto_taxi": "Moto-taxi",
  "taxi": "Taxi",
  "bus": "Bus",
  "transport_commun": "Transport en commun"
};

// Helper function pour formater les prix en FCFA
export const formatPrixFCFA = (prix: number): string => {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(prix).replace('XAF', 'FCFA');
};