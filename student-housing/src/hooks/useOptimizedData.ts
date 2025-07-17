import { useState, useEffect, useCallback, useMemo } from 'react';
import { SupabaseService } from '../services/supabaseService';
import type { Chambre, Cite, FiltreRecherche } from '../../shared/types';
import type { PaginationParams, PaginatedResponse, SearchParams, OptimizedHookConfig } from '../types/pagination';
import { useDebounce, useDebouncedCallback } from './useDebounce';

const DEFAULT_CONFIG: OptimizedHookConfig = {
  enableCache: true,
  defaultPageSize: 10,
  debounceMs: 300,
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: true
};

// Hook optimisé pour les chambres avec pagination
export function useOptimizedChambres(config: Partial<OptimizedHookConfig> = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [chambres, setChambres] = useState<PaginatedResponse<Chambre>>({
    data: [],
    pagination: {
      page: 1,
      limit: finalConfig.defaultPageSize,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchParams>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Fonction de chargement des données avec debounce
  const loadChambres = useDebouncedCallback(async (
    page: number = currentPage,
    searchFilters: SearchParams = filters
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params: PaginationParams & SearchParams = {
        page,
        limit: finalConfig.defaultPageSize,
        ...searchFilters
      };
      
      const result = await SupabaseService.getChambresWithPagination(params);
      setChambres(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, finalConfig.debounceMs);

  // Charger les données au montage du composant
  useEffect(() => {
    loadChambres(1, filters);
  }, []);

  // Fonctions de navigation
  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    loadChambres(page, filters);
  }, [filters, loadChambres]);

  const nextPage = useCallback(() => {
    if (chambres.pagination.hasNextPage) {
      goToPage(currentPage + 1);
    }
  }, [chambres.pagination.hasNextPage, currentPage, goToPage]);

  const previousPage = useCallback(() => {
    if (chambres.pagination.hasPreviousPage) {
      goToPage(currentPage - 1);
    }
  }, [chambres.pagination.hasPreviousPage, currentPage, goToPage]);

  // Fonction de mise à jour des filtres
  const updateFilters = useCallback((newFilters: SearchParams) => {
    setFilters(newFilters);
    setCurrentPage(1);
    loadChambres(1, newFilters);
  }, [loadChambres]);

  // Fonction de rafraîchissement
  const refresh = useCallback(() => {
    SupabaseService.invalidateCache('chambres');
    loadChambres(currentPage, filters);
  }, [currentPage, filters, loadChambres]);

  return {
    chambres: chambres.data,
    pagination: chambres.pagination,
    loading,
    error,
    currentPage,
    filters,
    // Actions
    goToPage,
    nextPage,
    previousPage,
    updateFilters,
    refresh,
    // Métriques
    isEmpty: chambres.data.length === 0,
    hasResults: chambres.data.length > 0
  };
}

// Hook pour la recherche de chambres avec debounce
export function useChambresSearch(initialQuery: string = '') {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PaginatedResponse<Chambre>>({
    data: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  const search = useCallback(async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setResults({
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false
        }
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await SupabaseService.searchChambres(searchQuery, { page, limit: 20 });
      setResults(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, []);

  // Déclencher la recherche quand la query débounced change
  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  const goToPage = useCallback((page: number) => {
    search(debouncedQuery, page);
  }, [debouncedQuery, search]);

  return {
    query,
    setQuery,
    results: results.data,
    pagination: results.pagination,
    loading,
    error,
    goToPage,
    isEmpty: results.data.length === 0 && !!debouncedQuery.trim(),
    hasResults: results.data.length > 0
  };
}

// Hook pour une chambre spécifique avec cache
export function useChambre(id: string | null) {
  const [chambre, setChambre] = useState<Chambre | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setChambre(null);
      return;
    }

    const loadChambre = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await SupabaseService.getChambreById(id);
        setChambre(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    loadChambre();
  }, [id]);

  return {
    chambre,
    loading,
    error,
    refresh: () => {
      if (id) {
        SupabaseService.invalidateCache(`chambre_${id}`);
        // Redéclencher le useEffect
        setChambre(null);
      }
    }
  };
}

// Hook pour les statistiques optimisées
export function useOptimizedStatistiques() {
  const [stats, setStats] = useState({
    totalChambres: 0,
    chambresDisponibles: 0,
    totalCites: 0,
    prixMoyen: 0,
    noteMoyenne: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await SupabaseService.obtenirStatistiques();
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh: () => {
      SupabaseService.invalidateCache('statistiques');
      loadStats();
    }
  };
}

// Hook pour surveiller les performances du cache
export function useCacheMetrics() {
  const [metrics, setMetrics] = useState(SupabaseService.getCacheStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(SupabaseService.getCacheStats());
    }, 10000); // Mise à jour toutes les 10 secondes

    return () => clearInterval(interval);
  }, []);

  const clearCache = useCallback(() => {
    SupabaseService.invalidateCache();
    setMetrics(SupabaseService.getCacheStats());
  }, []);

  return {
    metrics,
    clearCache
  };
}