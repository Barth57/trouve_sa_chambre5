// Types pour l'application de logement étudiant

export interface Coordonnees {
  latitude: number;
  longitude: number;
}

export interface Cite {
  id: string;
  nom: string;
  ville: string;
  adresse: string;
  coordonnees: Coordonnees;
  description: string;
  noteGlobale: number;
  nombreAvis: number;
  equipements: string[];
  transport: string[];
  photos: string[];
}

export interface Chambre {
  id: string;
  titre: string;
  description: string;
  prix: number;
  superficie: number;
  type: 'studio' | 'T1' | 'T2' | 'chambre_partagee';
  citeId: string;
  cite: Cite;
  photos: string[];
  equipements: string[];
  disponible: boolean;
  dateDisponibilite: Date;
  caution: number;
  chargesIncluses: boolean;
  note: number;
  nombreAvis: number;
  contact: {
    nom: string;
    email: string;
    telephone: string;
  };
  caracteristiques: {
    etage: number;
    ascenseur: boolean;
    balcon: boolean;
    vue: string;
    orientation: string;
    meuble: boolean;
  };
}

export interface Avis {
  id: string;
  chambreId: string;
  auteur: string;
  note: number;
  commentaire: string;
  date: Date;
  photos?: string[];
}

export interface FiltreRecherche {
  ville?: string;
  prixMin?: number;
  prixMax?: number;
  superficieMin?: number;
  type?: string[];
  equipements?: string[];
  disponibleUniquement?: boolean;
  noteMin?: number;
}

export interface DonneesFormulaire {
  chambre: Partial<Chambre>;
  cite: Partial<Cite>;
  fichiers: File[];
}