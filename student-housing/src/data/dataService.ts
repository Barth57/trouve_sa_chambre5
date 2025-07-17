import type { Chambre, Cite } from "../../shared/types";
import { chambresData as chambresInitiales, citesData as citesInitiales } from "./mockData";

export class DataService {
  private static readonly CHAMBRES_KEY = 'studyrooms_chambres';
  private static readonly CITES_KEY = 'studyrooms_cites';
  private static readonly COMPTEUR_KEY = 'studyrooms_compteurs';

  // Récupérer les compteurs pour générer des IDs uniques
  private static getCompteurs() {
    try {
      const compteurs = localStorage.getItem(this.COMPTEUR_KEY);
      return compteurs ? JSON.parse(compteurs) : { chambres: chambresInitiales.length, cites: citesInitiales.length };
    } catch {
      return { chambres: chambresInitiales.length, cites: citesInitiales.length };
    }
  }

  // Sauvegarder les compteurs
  private static setCompteurs(compteurs: { chambres: number; cites: number }) {
    localStorage.setItem(this.COMPTEUR_KEY, JSON.stringify(compteurs));
  }

  // Générer un nouvel ID pour une chambre
  private static genererIdChambre(): string {
    const compteurs = this.getCompteurs();
    compteurs.chambres += 1;
    this.setCompteurs(compteurs);
    return `chambre_${compteurs.chambres}`;
  }

  // Générer un nouvel ID pour une cité
  private static genererIdCite(): string {
    const compteurs = this.getCompteurs();
    compteurs.cites += 1;
    this.setCompteurs(compteurs);
    return `cite_${compteurs.cites}`;
  }

  // GESTION DES CITÉS

  static getCites(): Cite[] {
    try {
      const citesStockees = localStorage.getItem(this.CITES_KEY);
      if (citesStockees) {
        return JSON.parse(citesStockees);
      }
      // Si pas de données stockées, initialiser avec les données par défaut
      this.setCites(citesInitiales);
      return citesInitiales;
    } catch (error) {
      console.error('Erreur lors de la récupération des cités:', error);
      return citesInitiales;
    }
  }

  static setCites(cites: Cite[]): void {
    try {
      localStorage.setItem(this.CITES_KEY, JSON.stringify(cites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des cités:', error);
    }
  }

  static ajouterCite(nouvelleCite: Omit<Cite, 'id'>): Cite {
    const cites = this.getCites();
    const cite: Cite = {
      ...nouvelleCite,
      id: this.genererIdCite()
    };
    
    cites.push(cite);
    this.setCites(cites);
    return cite;
  }

  static modifierCite(id: string, citeModifiee: Partial<Cite>): boolean {
    const cites = this.getCites();
    const index = cites.findIndex(c => c.id === id);
    
    if (index !== -1) {
      cites[index] = { ...cites[index], ...citeModifiee };
      this.setCites(cites);
      return true;
    }
    return false;
  }

  static supprimerCite(id: string): boolean {
    const cites = this.getCites();
    const nouvellesCites = cites.filter(c => c.id !== id);
    
    if (nouvellesCites.length !== cites.length) {
      this.setCites(nouvellesCites);
      // Supprimer aussi toutes les chambres de cette cité
      const chambres = this.getChambres();
      const nouvellesChambres = chambres.filter(ch => ch.citeId !== id);
      this.setChambres(nouvellesChambres);
      return true;
    }
    return false;
  }

  // GESTION DES CHAMBRES

  static getChambres(): Chambre[] {
    try {
      const chambresStockees = localStorage.getItem(this.CHAMBRES_KEY);
      if (chambresStockees) {
        const chambres = JSON.parse(chambresStockees);
        // Mettre à jour les références des cités pour assurer la cohérence
        const cites = this.getCites();
        return chambres.map((chambre: Chambre) => {
          const cite = cites.find(c => c.id === chambre.citeId);
          return cite ? { ...chambre, cite } : chambre;
        });
      }
      // Si pas de données stockées, initialiser avec les données par défaut
      this.setChambres(chambresInitiales);
      return chambresInitiales;
    } catch (error) {
      console.error('Erreur lors de la récupération des chambres:', error);
      return chambresInitiales;
    }
  }

  static setChambres(chambres: Chambre[]): void {
    try {
      localStorage.setItem(this.CHAMBRES_KEY, JSON.stringify(chambres));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des chambres:', error);
    }
  }

  static ajouterChambre(nouvelleChambre: Omit<Chambre, 'id'>): Chambre {
    const chambres = this.getChambres();
    const chambre: Chambre = {
      ...nouvelleChambre,
      id: this.genererIdChambre(),
      dateDisponibilite: nouvelleChambre.dateDisponibilite || new Date()
    };
    
    chambres.push(chambre);
    this.setChambres(chambres);
    return chambre;
  }

  static modifierChambre(id: string, chambreModifiee: Partial<Chambre>): boolean {
    const chambres = this.getChambres();
    const index = chambres.findIndex(c => c.id === id);
    
    if (index !== -1) {
      chambres[index] = { ...chambres[index], ...chambreModifiee };
      this.setChambres(chambres);
      return true;
    }
    return false;
  }

  static supprimerChambre(id: string): boolean {
    const chambres = this.getChambres();
    const nouvellesChambres = chambres.filter(c => c.id !== id);
    
    if (nouvellesChambres.length !== chambres.length) {
      this.setChambres(nouvellesChambres);
      return true;
    }
    return false;
  }

  // UTILITAIRES

  static exporterDonnees(): { chambres: Chambre[]; cites: Cite[] } {
    return {
      chambres: this.getChambres(),
      cites: this.getCites()
    };
  }

  static importerDonnees(donnees: { chambres?: Chambre[]; cites?: Cite[] }): boolean {
    try {
      if (donnees.cites) {
        this.setCites(donnees.cites);
      }
      if (donnees.chambres) {
        this.setChambres(donnees.chambres);
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation des données:', error);
      return false;
    }
  }

  static reinitialiserDonnees(): void {
    try {
      localStorage.removeItem(this.CHAMBRES_KEY);
      localStorage.removeItem(this.CITES_KEY);
      localStorage.removeItem(this.COMPTEUR_KEY);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  }

  static obtenirStatistiques() {
    const chambres = this.getChambres();
    const cites = this.getCites();
    
    return {
      totalChambres: chambres.length,
      chambresDisponibles: chambres.filter(c => c.disponible).length,
      totalCites: cites.length,
      prixMoyen: chambres.length > 0 
        ? Math.round(chambres.reduce((sum, c) => sum + c.prix, 0) / chambres.length)
        : 0,
      noteMoyenne: chambres.length > 0
        ? Number((chambres.reduce((sum, c) => sum + c.note, 0) / chambres.length).toFixed(1))
        : 0
    };
  }
}