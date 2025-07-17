/**
 * Types pour la pagination et les optimisations
 */

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface SearchParams {
  query?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CacheableQuery extends SearchParams, PaginationParams {
  cacheKey?: string;
  ttl?: number;
}

export interface PerformanceMetrics {
  queryTime: number;
  cacheHit: boolean;
  resultsCount: number;
  fromCache: boolean;
}

export interface OptimizedHookConfig {
  enableCache: boolean;
  defaultPageSize: number;
  debounceMs: number;
  staleTime: number;
  refetchOnWindowFocus: boolean;
}