// Service Supabase avec gestion des erreurs et fallback
import type { Chambre, Cite } from '../../shared/types';
import type { PaginationParams, PaginatedResponse, SearchParams } from '../types/pagination';
import { cacheService, CACHE_KEYS } from './cacheService';

// Vérifier si Supabase est configuré
const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

// Service Supabase avec gestion d'erreurs robuste
export class SupabaseService {
  private static supabase: any = null;
  private static initialized = false;

  // Initialiser Supabase de manière sécurisée
  private static async initialize() {
    if (this.initialized) return this.supabase;
    
    try {
      if (!isSupabaseConfigured()) {
        console.info('Supabase non configuré, utilisation du localStorage');
        return null;
      }

      // Import dynamique pour éviter les erreurs si le module n'est pas installé
      const { createClient } = await import('@supabase/supabase-js');
      
      this.supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      
      this.initialized = true;
      console.info('Supabase initialisé avec succès');
      return this.supabase;
    } catch (error) {
      console.warn('Erreur lors de l\'initialisation de Supabase:', error);
      console.info('Fallback vers localStorage');
      return null;
    }
  }

  // Fallback vers localStorage
  private static async fallbackToLocalStorage() {
    try {
      const { DataService } = await import('../data/dataService');
      return DataService;
    } catch (error) {
      console.error('Erreur lors du chargement du service localStorage:', error);
      throw new Error('Aucun service de données disponible');
    }
  }

  // ==================== GESTION DES CITÉS ====================
  
  static async getCites(): Promise<Cite[]> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.getCites();
      }

      const { data, error } = await supabase
        .from('cites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(this.transformDatabaseCiteToApp);
    } catch (error) {
      console.error('Erreur getCites, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.getCites();
    }
  }

  static async ajouterCite(nouvelleCite: Omit<Cite, 'id'>): Promise<Cite> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.ajouterCite(nouvelleCite);
      }

      const citeData = this.transformAppCiteToDatabase(nouvelleCite);
      
      const { data, error } = await supabase
        .from('cites')
        .insert(citeData)
        .select()
        .single();

      if (error) throw error;

      return this.transformDatabaseCiteToApp(data);
    } catch (error) {
      console.error('Erreur ajouterCite, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.ajouterCite(nouvelleCite);
    }
  }

  static async modifierCite(id: string, citeModifiee: Partial<Cite>): Promise<boolean> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.modifierCite(id, citeModifiee);
      }

      const citeData = this.transformAppCiteToDatabase(citeModifiee);
      
      const { error } = await supabase
        .from('cites')
        .update(citeData)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur modifierCite, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.modifierCite(id, citeModifiee);
    }
  }

  static async supprimerCite(id: string): Promise<boolean> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.supprimerCite(id);
      }

      const { error } = await supabase
        .from('cites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur supprimerCite, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.supprimerCite(id);
    }
  }

  // ==================== GESTION DES CHAMBRES ====================

  static async getChambres(): Promise<Chambre[]> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.getChambres();
      }

      const { data, error } = await supabase
        .from('chambres')
        .select(`
          *,
          cites (
            id, nom, ville, adresse, description,
            latitude, longitude, equipements, transport,
            photos, note_globale, nombre_avis
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(this.transformDatabaseChambreToApp);
    } catch (error) {
      console.error('Erreur getChambres, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.getChambres();
    }
  }

  static async ajouterChambre(nouvelleChambre: Omit<Chambre, 'id'>): Promise<Chambre> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.ajouterChambre(nouvelleChambre);
      }

      const chambreData = this.transformAppChambreToDatabase(nouvelleChambre);
      
      const { data, error } = await supabase
        .from('chambres')
        .insert(chambreData)
        .select(`
          *,
          cites (
            id, nom, ville, adresse, description,
            latitude, longitude, equipements, transport,
            photos, note_globale, nombre_avis
          )
        `)
        .single();

      if (error) throw error;

      return this.transformDatabaseChambreToApp(data);
    } catch (error) {
      console.error('Erreur ajouterChambre, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.ajouterChambre(nouvelleChambre);
    }
  }

  static async modifierChambre(id: string, chambreModifiee: Partial<Chambre>): Promise<boolean> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.modifierChambre(id, chambreModifiee);
      }

      const chambreData = this.transformAppChambreToDatabase(chambreModifiee);
      
      const { error } = await supabase
        .from('chambres')
        .update(chambreData)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur modifierChambre, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.modifierChambre(id, chambreModifiee);
    }
  }

  static async supprimerChambre(id: string): Promise<boolean> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.supprimerChambre(id);
      }

      const { error } = await supabase
        .from('chambres')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur supprimerChambre, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.supprimerChambre(id);
    }
  }

  // ==================== UTILITAIRES ====================

  static async obtenirStatistiques() {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        return localService.obtenirStatistiques();
      }

      const [chambresResult, citesResult] = await Promise.all([
        supabase.from('chambres').select('prix, note, disponible'),
        supabase.from('cites').select('id')
      ]);

      if (chambresResult.error) throw chambresResult.error;
      if (citesResult.error) throw citesResult.error;

      const chambres = chambresResult.data || [];
      const cites = citesResult.data || [];

      return {
        totalChambres: chambres.length,
        chambresDisponibles: chambres.filter((c: any) => c.disponible).length,
        totalCites: cites.length,
        prixMoyen: chambres.length > 0 
          ? Math.round(chambres.reduce((sum: number, c: any) => sum + c.prix, 0) / chambres.length)
          : 0,
        noteMoyenne: chambres.length > 0
          ? Number((chambres.reduce((sum: number, c: any) => sum + c.note, 0) / chambres.length).toFixed(1))
          : 0
      };
    } catch (error) {
      console.error('Erreur obtenirStatistiques, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      return localService.obtenirStatistiques();
    }
  }

  // ==================== MÉTHODES OPTIMISÉES AVEC CACHE ET PAGINATION ====================

  static async getChambresWithPagination(params: PaginationParams & SearchParams): Promise<PaginatedResponse<Chambre>> {
    const startTime = Date.now();
    const cacheKey = CACHE_KEYS.PAGINATED_CHAMBRES(
      params.page,
      params.limit,
      JSON.stringify(params.filters || {})
    );

    // Vérifier le cache
    const cached = cacheService.get<PaginatedResponse<Chambre>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        const allChambres = localService.getChambres();
        return this.paginateLocalData(allChambres, params);
      }

      const offset = (params.page - 1) * params.limit;
      let query = supabase
        .from('chambres')
        .select(`
          *,
          cites (
            id, nom, ville, adresse, description,
            latitude, longitude, equipements, transport,
            photos, note_globale, nombre_avis
          )
        `);

      // Ajouter les filtres
      if (params.filters) {
        query = this.applyFiltersToQuery(query, params.filters);
      }

      // Ajouter le tri
      if (params.sortBy) {
        query = query.order(params.sortBy, { ascending: params.sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      // Compter le total
      const { count } = await supabase
        .from('chambres')
        .select('*', { count: 'exact', head: true });

      // Appliquer la pagination
      const { data, error } = await query
        .range(offset, offset + params.limit - 1);

      if (error) throw error;

      const result: PaginatedResponse<Chambre> = {
        data: data.map(this.transformDatabaseChambreToApp),
        pagination: {
          page: params.page,
          limit: params.limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / params.limit),
          hasNextPage: offset + params.limit < (count || 0),
          hasPreviousPage: params.page > 1
        }
      };

      // Mettre en cache
      cacheService.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes
      
      return result;
    } catch (error) {
      console.error('Erreur getChambresWithPagination, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      const allChambres = localService.getChambres();
      return this.paginateLocalData(allChambres, params);
    }
  }

  static async searchChambres(query: string, params: PaginationParams = { page: 1, limit: 20 }): Promise<PaginatedResponse<Chambre>> {
    const cacheKey = CACHE_KEYS.SEARCH_RESULTS(`${query}_${params.page}_${params.limit}`);
    
    const cached = cacheService.get<PaginatedResponse<Chambre>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        const allChambres = localService.getChambres();
        const filtered = this.filterLocalData(allChambres, query);
        return this.paginateLocalData(filtered, params);
      }

      const offset = (params.page - 1) * params.limit;
      
      const { data, error, count } = await supabase
        .from('chambres')
        .select(`
          *,
          cites (
            id, nom, ville, adresse, description,
            latitude, longitude, equipements, transport,
            photos, note_globale, nombre_avis
          )
        `, { count: 'exact' })
        .or(`titre.ilike.%${query}%,description.ilike.%${query}%`)
        .range(offset, offset + params.limit - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const result: PaginatedResponse<Chambre> = {
        data: data.map(this.transformDatabaseChambreToApp),
        pagination: {
          page: params.page,
          limit: params.limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / params.limit),
          hasNextPage: offset + params.limit < (count || 0),
          hasPreviousPage: params.page > 1
        }
      };

      cacheService.set(cacheKey, result, 60 * 1000); // 1 minute pour les recherches
      
      return result;
    } catch (error) {
      console.error('Erreur searchChambres, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      const allChambres = localService.getChambres();
      const filtered = this.filterLocalData(allChambres, query);
      return this.paginateLocalData(filtered, params);
    }
  }

  static async getChambreById(id: string): Promise<Chambre | null> {
    const cacheKey = CACHE_KEYS.CHAMBRE_DETAILS(id);
    
    const cached = cacheService.get<Chambre>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        const localService = await this.fallbackToLocalStorage();
        const chambres = localService.getChambres();
        return chambres.find(c => c.id === id) || null;
      }

      const { data, error } = await supabase
        .from('chambres')
        .select(`
          *,
          cites (
            id, nom, ville, adresse, description,
            latitude, longitude, equipements, transport,
            photos, note_globale, nombre_avis
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      const result = this.transformDatabaseChambreToApp(data);
      cacheService.set(cacheKey, result, 10 * 60 * 1000); // 10 minutes
      
      return result;
    } catch (error) {
      console.error('Erreur getChambreById, fallback localStorage:', error);
      const localService = await this.fallbackToLocalStorage();
      const chambres = localService.getChambres();
      return chambres.find(c => c.id === id) || null;
    }
  }

  // Méthodes utilitaires pour le fallback localStorage
  private static paginateLocalData<T>(data: T[], params: PaginationParams): PaginatedResponse<T> {
    const offset = (params.page - 1) * params.limit;
    const paginatedData = data.slice(offset, offset + params.limit);
    
    return {
      data: paginatedData,
      pagination: {
        page: params.page,
        limit: params.limit,
        total: data.length,
        totalPages: Math.ceil(data.length / params.limit),
        hasNextPage: offset + params.limit < data.length,
        hasPreviousPage: params.page > 1
      }
    };
  }

  private static filterLocalData(chambres: Chambre[], query: string): Chambre[] {
    const searchTerm = query.toLowerCase();
    return chambres.filter(chambre => 
      chambre.titre.toLowerCase().includes(searchTerm) ||
      chambre.description.toLowerCase().includes(searchTerm) ||
      chambre.cite.nom.toLowerCase().includes(searchTerm) ||
      chambre.cite.ville.toLowerCase().includes(searchTerm)
    );
  }

  private static applyFiltersToQuery(query: any, filters: Record<string, any>): any {
    let filteredQuery = query;
    
    if (filters.prixMin !== undefined) {
      filteredQuery = filteredQuery.gte('prix', filters.prixMin);
    }
    
    if (filters.prixMax !== undefined) {
      filteredQuery = filteredQuery.lte('prix', filters.prixMax);
    }
    
    if (filters.type) {
      filteredQuery = filteredQuery.eq('type', filters.type);
    }
    
    if (filters.disponible !== undefined) {
      filteredQuery = filteredQuery.eq('disponible', filters.disponible);
    }
    
    if (filters.ville) {
      filteredQuery = filteredQuery.eq('cites.ville', filters.ville);
    }
    
    if (filters.equipements && filters.equipements.length > 0) {
      filteredQuery = filteredQuery.contains('equipements', filters.equipements);
    }
    
    return filteredQuery;
  }

  // Invalidation du cache
  static invalidateCache(pattern?: string): void {
    if (pattern) {
      cacheService.invalidatePattern(pattern);
    } else {
      cacheService.clear();
    }
  }

  // Statistiques du cache
  static getCacheStats() {
    return cacheService.getStats();
  }

  // ==================== MIGRATION ====================

  static async migrerDepuisLocalStorage(): Promise<{ success: boolean; message: string }> {
    try {
      const supabase = await this.initialize();
      
      if (!supabase) {
        return {
          success: false,
          message: "Supabase non configuré. Veuillez configurer les variables d'environnement."
        };
      }

      const localService = await this.fallbackToLocalStorage();
      const anciennesDonnees = localService.exporterDonnees();
      
      let citesImportees = 0;
      let chambresImportees = 0;

      // Importer les cités
      for (const cite of anciennesDonnees.cites) {
        try {
          await this.ajouterCite(cite);
          citesImportees++;
        } catch (error) {
          console.warn('Erreur lors de l\'import de la cité:', cite.nom, error);
        }
      }

      // Importer les chambres
      for (const chambre of anciennesDonnees.chambres) {
        try {
          await this.ajouterChambre(chambre);
          chambresImportees++;
        } catch (error) {
          console.warn('Erreur lors de l\'import de la chambre:', chambre.titre, error);
        }
      }

      return {
        success: true,
        message: `Migration réussie ! ${citesImportees} cités et ${chambresImportees} chambres importées.`
      };
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
      return {
        success: false,
        message: `Erreur lors de la migration: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  // ==================== TRANSFORMATEURS DE DONNÉES ====================

  private static transformDatabaseCiteToApp(dbCite: any): Cite {
    return {
      id: dbCite.id,
      nom: dbCite.nom,
      ville: dbCite.ville,
      adresse: dbCite.adresse,
      description: dbCite.description || '',
      coordonnees: {
        latitude: dbCite.latitude || 0,
        longitude: dbCite.longitude || 0
      },
      equipements: dbCite.equipements || [],
      transport: dbCite.transport || [],
      photos: dbCite.photos || [],
      noteGlobale: dbCite.note_globale || 0,
      nombreAvis: dbCite.nombre_avis || 0
    };
  }

  private static transformAppCiteToDatabase(appCite: Partial<Cite>): any {
    const dbCite: any = {};
    
    if (appCite.nom) dbCite.nom = appCite.nom;
    if (appCite.ville) dbCite.ville = appCite.ville;
    if (appCite.adresse) dbCite.adresse = appCite.adresse;
    if (appCite.description !== undefined) dbCite.description = appCite.description;
    if (appCite.coordonnees) {
      dbCite.latitude = appCite.coordonnees.latitude;
      dbCite.longitude = appCite.coordonnees.longitude;
    }
    if (appCite.equipements) dbCite.equipements = appCite.equipements;
    if (appCite.transport) dbCite.transport = appCite.transport;
    if (appCite.photos) dbCite.photos = appCite.photos;
    if (appCite.noteGlobale !== undefined) dbCite.note_globale = appCite.noteGlobale;
    if (appCite.nombreAvis !== undefined) dbCite.nombre_avis = appCite.nombreAvis;

    return dbCite;
  }

  private static transformDatabaseChambreToApp(dbChambre: any): Chambre {
    return {
      id: dbChambre.id,
      citeId: dbChambre.cite_id,
      cite: dbChambre.cites ? this.transformDatabaseCiteToApp(dbChambre.cites) : {} as Cite,
      titre: dbChambre.titre,
      description: dbChambre.description,
      prix: dbChambre.prix,
      superficie: dbChambre.superficie,
      type: dbChambre.type as any,
      equipements: dbChambre.equipements || [],
      disponible: dbChambre.disponible,
      chargesIncluses: dbChambre.charges_incluses,
      caution: dbChambre.caution,
      photos: dbChambre.photos || [],
      note: dbChambre.note,
      nombreAvis: dbChambre.nombre_avis,
      dateDisponibilite: new Date(dbChambre.date_disponibilite),
      contact: {
        nom: dbChambre.contact_nom,
        email: dbChambre.contact_email,
        telephone: dbChambre.contact_telephone
      },
      caracteristiques: {
        etage: dbChambre.etage,
        ascenseur: dbChambre.ascenseur,
        balcon: dbChambre.balcon,
        vue: dbChambre.vue || '',
        orientation: dbChambre.orientation || '',
        meuble: dbChambre.meuble
      }
    };
  }

  private static transformAppChambreToDatabase(appChambre: Partial<Chambre>): any {
    const dbChambre: any = {};
    
    if (appChambre.citeId) dbChambre.cite_id = appChambre.citeId;
    if (appChambre.titre) dbChambre.titre = appChambre.titre;
    if (appChambre.description) dbChambre.description = appChambre.description;
    if (appChambre.prix !== undefined) dbChambre.prix = appChambre.prix;
    if (appChambre.superficie !== undefined) dbChambre.superficie = appChambre.superficie;
    if (appChambre.type) dbChambre.type = appChambre.type;
    if (appChambre.equipements) dbChambre.equipements = appChambre.equipements;
    if (appChambre.disponible !== undefined) dbChambre.disponible = appChambre.disponible;
    if (appChambre.chargesIncluses !== undefined) dbChambre.charges_incluses = appChambre.chargesIncluses;
    if (appChambre.caution !== undefined) dbChambre.caution = appChambre.caution;
    if (appChambre.photos) dbChambre.photos = appChambre.photos;
    if (appChambre.note !== undefined) dbChambre.note = appChambre.note;
    if (appChambre.nombreAvis !== undefined) dbChambre.nombre_avis = appChambre.nombreAvis;
    if (appChambre.dateDisponibilite) dbChambre.date_disponibilite = appChambre.dateDisponibilite.toISOString().split('T')[0];
    
    if (appChambre.contact) {
      if (appChambre.contact.nom) dbChambre.contact_nom = appChambre.contact.nom;
      if (appChambre.contact.email) dbChambre.contact_email = appChambre.contact.email;
      if (appChambre.contact.telephone) dbChambre.contact_telephone = appChambre.contact.telephone;
    }
    
    if (appChambre.caracteristiques) {
      if (appChambre.caracteristiques.etage !== undefined) dbChambre.etage = appChambre.caracteristiques.etage;
      if (appChambre.caracteristiques.ascenseur !== undefined) dbChambre.ascenseur = appChambre.caracteristiques.ascenseur;
      if (appChambre.caracteristiques.balcon !== undefined) dbChambre.balcon = appChambre.caracteristiques.balcon;
      if (appChambre.caracteristiques.vue) dbChambre.vue = appChambre.caracteristiques.vue;
      if (appChambre.caracteristiques.orientation) dbChambre.orientation = appChambre.caracteristiques.orientation;
      if (appChambre.caracteristiques.meuble !== undefined) dbChambre.meuble = appChambre.caracteristiques.meuble;
    }

    return dbChambre;
  }

  // ==================== HELPERS ====================

  static isConfigured(): boolean {
    return isSupabaseConfigured();
  }

  static getStatus(): string {
    if (!isSupabaseConfigured()) {
      return 'Non configuré - Utilisation localStorage';
    }
    return 'Configuré et prêt';
  }
}