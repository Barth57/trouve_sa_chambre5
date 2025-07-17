/**
 * Service de cache intelligent avec expiration automatique
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CacheConfig {
  defaultTTL: number; // Time To Live en millisecondes
  maxSize: number; // Taille maximale du cache
}

export class CacheService {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      defaultTTL: 5 * 60 * 1000, // 5 minutes par défaut
      maxSize: 100, // 100 entrées max
      ...config
    };
  }

  /**
   * Stocke une valeur dans le cache avec expiration
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.config.defaultTTL);

    // Nettoyage si le cache est plein
    if (this.cache.size >= this.config.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt
    });
  }

  /**
   * Récupère une valeur du cache si elle n'est pas expirée
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * Vérifie si une clé existe et n'est pas expirée
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Supprime une entrée du cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Invalide les entrées qui correspondent à un pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Nettoie les entrées expirées
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Retourne les statistiques du cache
   */
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const item of this.cache.values()) {
      if (now > item.expiresAt) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      maxSize: this.config.maxSize,
      usage: (this.cache.size / this.config.maxSize) * 100
    };
  }
}

// Instance globale du cache
export const cacheService = new CacheService({
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  maxSize: 200
});

// Clés de cache spécifiques
export const CACHE_KEYS = {
  CHAMBRES: 'chambres',
  CHAMBRES_FILTERED: 'chambres_filtered',
  CITES: 'cites',
  STATISTIQUES: 'statistiques',
  CHAMBRE_DETAILS: (id: string) => `chambre_${id}`,
  CITE_DETAILS: (id: string) => `cite_${id}`,
  SEARCH_RESULTS: (query: string) => `search_${query}`,
  PAGINATED_CHAMBRES: (page: number, limit: number, filters?: string) => 
    `chambres_page_${page}_${limit}${filters ? `_${filters}` : ''}`,
};