import { useState, useEffect, useCallback } from 'react';
import type { Chambre, Cite } from '../../shared/types';
import { SupabaseService } from '../services/supabaseService';

// Configuration pour utiliser Supabase ou localStorage en fallback
const USE_SUPABASE = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;

// Hook pour gérer les données des chambres avec Supabase
export function useChambres() {
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les chambres depuis Supabase ou localStorage
  const chargerChambres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_SUPABASE) {
        const chambresChargees = await SupabaseService.getChambres();
        setChambres(chambresChargees);
      } else {
        // Fallback vers localStorage
        const { DataService } = await import('../data/dataService');
        const chambresChargees = DataService.getChambres();
        setChambres(chambresChargees);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des chambres:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      // En cas d'erreur avec Supabase, fallback vers localStorage
      if (USE_SUPABASE) {
        try {
          const { DataService } = await import('../data/dataService');
          const chambresChargees = DataService.getChambres();
          setChambres(chambresChargees);
        } catch (fallbackError) {
          console.error('Erreur fallback localStorage:', fallbackError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter une nouvelle chambre
  const ajouterChambre = useCallback(async (nouvelleChambre: Omit<Chambre, 'id'>) => {
    try {
      if (USE_SUPABASE) {
        const chambreAjoutee = await SupabaseService.ajouterChambre(nouvelleChambre);
        setChambres(prev => [...prev, chambreAjoutee]);
        return chambreAjoutee;
      } else {
        const { DataService } = await import('../data/dataService');
        const chambreAjoutee = DataService.ajouterChambre(nouvelleChambre);
        setChambres(prev => [...prev, chambreAjoutee]);
        return chambreAjoutee;
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la chambre:', error);
      throw error;
    }
  }, []);

  // Modifier une chambre existante
  const modifierChambre = useCallback(async (id: string, chambreModifiee: Partial<Chambre>) => {
    try {
      if (USE_SUPABASE) {
        const succes = await SupabaseService.modifierChambre(id, chambreModifiee);
        if (succes) {
          setChambres(prev => prev.map(c => 
            c.id === id ? { ...c, ...chambreModifiee } : c
          ));
        }
        return succes;
      } else {
        const { DataService } = await import('../data/dataService');
        const succes = DataService.modifierChambre(id, chambreModifiee);
        if (succes) {
          setChambres(prev => prev.map(c => 
            c.id === id ? { ...c, ...chambreModifiee } : c
          ));
        }
        return succes;
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la chambre:', error);
      throw error;
    }
  }, []);

  // Supprimer une chambre
  const supprimerChambre = useCallback(async (id: string) => {
    try {
      if (USE_SUPABASE) {
        const succes = await SupabaseService.supprimerChambre(id);
        if (succes) {
          setChambres(prev => prev.filter(c => c.id !== id));
        }
        return succes;
      } else {
        const { DataService } = await import('../data/dataService');
        const succes = DataService.supprimerChambre(id);
        if (succes) {
          setChambres(prev => prev.filter(c => c.id !== id));
        }
        return succes;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la chambre:', error);
      throw error;
    }
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    chargerChambres();
  }, [chargerChambres]);

  // Écouter les changements dans localStorage (pour compatibilité)
  useEffect(() => {
    if (!USE_SUPABASE) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'studyrooms_chambres') {
          chargerChambres();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [chargerChambres]);

  return {
    chambres,
    loading,
    error,
    ajouterChambre,
    modifierChambre,
    supprimerChambre,
    recharger: chargerChambres
  };
}

// Hook pour gérer les données des cités avec Supabase
export function useCites() {
  const [cites, setCites] = useState<Cite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les cités depuis Supabase ou localStorage
  const chargerCites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_SUPABASE) {
        const citesChargees = await SupabaseService.getCites();
        setCites(citesChargees);
      } else {
        const { DataService } = await import('../data/dataService');
        const citesChargees = DataService.getCites();
        setCites(citesChargees);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des cités:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      // En cas d'erreur avec Supabase, fallback vers localStorage
      if (USE_SUPABASE) {
        try {
          const { DataService } = await import('../data/dataService');
          const citesChargees = DataService.getCites();
          setCites(citesChargees);
        } catch (fallbackError) {
          console.error('Erreur fallback localStorage:', fallbackError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Ajouter une nouvelle cité
  const ajouterCite = useCallback(async (nouvelleCite: Omit<Cite, 'id'>) => {
    try {
      if (USE_SUPABASE) {
        const citeAjoutee = await SupabaseService.ajouterCite(nouvelleCite);
        setCites(prev => [...prev, citeAjoutee]);
        return citeAjoutee;
      } else {
        const { DataService } = await import('../data/dataService');
        const citeAjoutee = DataService.ajouterCite(nouvelleCite);
        setCites(prev => [...prev, citeAjoutee]);
        return citeAjoutee;
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la cité:', error);
      throw error;
    }
  }, []);

  // Modifier une cité existante
  const modifierCite = useCallback(async (id: string, citeModifiee: Partial<Cite>) => {
    try {
      if (USE_SUPABASE) {
        const succes = await SupabaseService.modifierCite(id, citeModifiee);
        if (succes) {
          setCites(prev => prev.map(c => 
            c.id === id ? { ...c, ...citeModifiee } : c
          ));
        }
        return succes;
      } else {
        const { DataService } = await import('../data/dataService');
        const succes = DataService.modifierCite(id, citeModifiee);
        if (succes) {
          setCites(prev => prev.map(c => 
            c.id === id ? { ...c, ...citeModifiee } : c
          ));
        }
        return succes;
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la cité:', error);
      throw error;
    }
  }, []);

  // Supprimer une cité
  const supprimerCite = useCallback(async (id: string) => {
    try {
      if (USE_SUPABASE) {
        const succes = await SupabaseService.supprimerCite(id);
        if (succes) {
          setCites(prev => prev.filter(c => c.id !== id));
        }
        return succes;
      } else {
        const { DataService } = await import('../data/dataService');
        const succes = DataService.supprimerCite(id);
        if (succes) {
          setCites(prev => prev.filter(c => c.id !== id));
        }
        return succes;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la cité:', error);
      throw error;
    }
  }, []);

  // Charger les données au montage du composant
  useEffect(() => {
    chargerCites();
  }, [chargerCites]);

  // Écouter les changements dans localStorage (pour compatibilité)
  useEffect(() => {
    if (!USE_SUPABASE) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'studyrooms_cites') {
          chargerCites();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [chargerCites]);

  return {
    cites,
    loading,
    error,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chargerStatistiques = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_SUPABASE) {
        const statistiques = await SupabaseService.obtenirStatistiques();
        setStats(statistiques);
      } else {
        const { DataService } = await import('../data/dataService');
        const statistiques = DataService.obtenirStatistiques();
        setStats(statistiques);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerStatistiques();
    
    // Recharger les statistiques lorsque les données changent
    if (!USE_SUPABASE) {
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'studyrooms_chambres' || e.key === 'studyrooms_cites') {
          chargerStatistiques();
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [chargerStatistiques]);

  return { stats, loading, error, recharger: chargerStatistiques };
}

// Hook pour gérer la migration localStorage -> Supabase
export function useMigration() {
  const [migrationStatus, setMigrationStatus] = useState<{
    inProgress: boolean;
    completed: boolean;
    error: string | null;
    message: string;
  }>({
    inProgress: false,
    completed: false,
    error: null,
    message: ''
  });

  const migrerVersSupabase = useCallback(async () => {
    if (!USE_SUPABASE) {
      setMigrationStatus({
        inProgress: false,
        completed: false,
        error: 'Supabase non configuré',
        message: 'Veuillez configurer les variables d\'environnement Supabase'
      });
      return;
    }

    setMigrationStatus(prev => ({ ...prev, inProgress: true, error: null }));

    try {
      const result = await SupabaseService.migrerDepuisLocalStorage();
      setMigrationStatus({
        inProgress: false,
        completed: result.success,
        error: result.success ? null : result.message,
        message: result.message
      });
    } catch (error) {
      setMigrationStatus({
        inProgress: false,
        completed: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        message: 'Échec de la migration'
      });
    }
  }, []);

  return {
    migrationStatus,
    migrerVersSupabase,
    isSupabaseConfigured: USE_SUPABASE
  };
}