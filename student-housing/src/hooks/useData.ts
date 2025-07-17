import { useState, useEffect, useCallback } from 'react';
import type { Chambre, Cite } from '../../shared/types';
import { DataService } from '../data/dataService';

// Hook pour gérer les données des chambres
export function useChambres() {
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les chambres depuis localStorage
  const chargerChambres = useCallback(() => {
    setLoading(true);
    try {
      const chambresChargees = DataService.getChambres();
      setChambres(chambresChargees);
    } catch (error) {
      console.error('Erreur lors du chargement des chambres:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter une nouvelle chambre
  const ajouterChambre = useCallback((nouvelleChambre: Omit<Chambre, 'id'>) => {
    try {
      const chambreAjoutee = DataService.ajouterChambre(nouvelleChambre);
      setChambres(prev => [...prev, chambreAjoutee]);
      return chambreAjoutee;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la chambre:', error);
      throw error;
    }
  }, []);

  // Modifier une chambre existante
  const modifierChambre = useCallback((id: string, chambreModifiee: Partial<Chambre>) => {
    try {
      const succes = DataService.modifierChambre(id, chambreModifiee);
      if (succes) {
        setChambres(prev => prev.map(c => 
          c.id === id ? { ...c, ...chambreModifiee } : c
        ));
      }
      return succes;
    } catch (error) {
      console.error('Erreur lors de la modification de la chambre:', error);
      throw error;
    }
  }, []);

  // Supprimer une chambre
  const supprimerChambre = useCallback((id: string) => {
    try {
      const succes = DataService.supprimerChambre(id);
      if (succes) {
        setChambres(prev => prev.filter(c => c.id !== id));
      }
      return succes;
    } catch (error) {
      console.error('Erreur lors de la suppression de la chambre:', error);
      throw error;
    }
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    chargerChambres();
  }, [chargerChambres]);

  // Écouter les changements dans localStorage (synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'studyrooms_chambres') {
        chargerChambres();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [chargerChambres]);

  return {
    chambres,
    loading,
    ajouterChambre,
    modifierChambre,
    supprimerChambre,
    recharger: chargerChambres
  };
}

// Hook pour gérer les données des cités
export function useCites() {
  const [cites, setCites] = useState<Cite[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les cités depuis localStorage
  const chargerCites = useCallback(() => {
    setLoading(true);
    try {
      const citesChargees = DataService.getCites();
      setCites(citesChargees);
    } catch (error) {
      console.error('Erreur lors du chargement des cités:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter une nouvelle cité
  const ajouterCite = useCallback((nouvelleCite: Omit<Cite, 'id'>) => {
    try {
      const citeAjoutee = DataService.ajouterCite(nouvelleCite);
      setCites(prev => [...prev, citeAjoutee]);
      return citeAjoutee;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la cité:', error);
      throw error;
    }
  }, []);

  // Modifier une cité existante
  const modifierCite = useCallback((id: string, citeModifiee: Partial<Cite>) => {
    try {
      const succes = DataService.modifierCite(id, citeModifiee);
      if (succes) {
        setCites(prev => prev.map(c => 
          c.id === id ? { ...c, ...citeModifiee } : c
        ));
      }
      return succes;
    } catch (error) {
      console.error('Erreur lors de la modification de la cité:', error);
      throw error;
    }
  }, []);

  // Supprimer une cité
  const supprimerCite = useCallback((id: string) => {
    try {
      const succes = DataService.supprimerCite(id);
      if (succes) {
        setCites(prev => prev.filter(c => c.id !== id));
      }
      return succes;
    } catch (error) {
      console.error('Erreur lors de la suppression de la cité:', error);
      throw error;
    }
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    chargerCites();
  }, [chargerCites]);

  // Écouter les changements dans localStorage (synchronisation entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'studyrooms_cites') {
        chargerCites();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [chargerCites]);

  return {
    cites,
    loading,
    ajouterCite,
    modifierCite,
    supprimerCite,
    recharger: chargerCites
  };
}

// Hook pour les statistiques
export function useStatistiques() {
  const [stats, setStats] = useState({
    totalChambres: 0,
    chambresDisponibles: 0,
    totalCites: 0,
    prixMoyen: 0,
    noteMoyenne: 0
  });

  const chargerStatistiques = useCallback(() => {
    try {
      const statistiques = DataService.obtenirStatistiques();
      setStats(statistiques);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }, []);

  useEffect(() => {
    chargerStatistiques();
    
    // Recharger les statistiques lorsque les données changent
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'studyrooms_chambres' || e.key === 'studyrooms_cites') {
        chargerStatistiques();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [chargerStatistiques]);

  return { stats, recharger: chargerStatistiques };
}