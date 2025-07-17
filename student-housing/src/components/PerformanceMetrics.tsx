import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Database, 
  Clock, 
  Trash2, 
  RefreshCw,
  TrendingUp,
  Server,
  Zap
} from 'lucide-react';
import { useCacheMetrics } from '../hooks/useOptimizedData';
import { cn } from '@/lib/utils';

interface PerformanceMetricsProps {
  className?: string;
  compact?: boolean;
}

export function PerformanceMetrics({ className, compact = false }: PerformanceMetricsProps) {
  const { metrics, clearCache } = useCacheMetrics();
  const [lastClearTime, setLastClearTime] = useState<Date | null>(null);

  const handleClearCache = () => {
    clearCache();
    setLastClearTime(new Date());
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;
  const formatTime = (date: Date) => date.toLocaleTimeString();

  if (compact) {
    return (
      <div className={cn("flex items-center space-x-4 text-sm", className)}>
        <div className="flex items-center space-x-1">
          <Database className="h-4 w-4 text-blue-500" />
          <span>Cache: {metrics.active}/{metrics.total}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Activity className="h-4 w-4 text-green-500" />
          <span>Usage: {formatPercentage(metrics.usage)}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCache}
          className="h-6 px-2"
        >
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cache actif */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Actif</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.active}</div>
            <p className="text-xs text-gray-500">sur {metrics.total} entrées</p>
          </CardContent>
        </Card>

        {/* Cache expiré */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Expiré</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.expired}</div>
            <p className="text-xs text-gray-500">à nettoyer</p>
          </CardContent>
        </Card>

        {/* Usage du cache */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(metrics.usage)}
            </div>
            <Progress value={metrics.usage} className="mt-2" />
          </CardContent>
        </Card>

        {/* Capacité maximale */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacité Max</CardTitle>
            <Server className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{metrics.maxSize}</div>
            <p className="text-xs text-gray-500">entrées maximum</p>
          </CardContent>
        </Card>
      </div>

      {/* Statut du cache */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span>État du Cache</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant={metrics.active > 0 ? "default" : "secondary"}>
                {metrics.active > 0 ? "Actif" : "Vide"}
              </Badge>
              
              <div className="text-sm text-gray-600">
                Efficacité: {metrics.total > 0 ? formatPercentage((metrics.active / metrics.total) * 100) : "0%"}
              </div>
              
              {lastClearTime && (
                <div className="text-sm text-gray-500">
                  Dernière purge: {formatTime(lastClearTime)}
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearCache}
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Vider le cache</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Détails Techniques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Entrées totales:</span>
              <span className="ml-2">{metrics.total}</span>
            </div>
            <div>
              <span className="font-medium">Entrées actives:</span>
              <span className="ml-2 text-green-600">{metrics.active}</span>
            </div>
            <div>
              <span className="font-medium">Entrées expirées:</span>
              <span className="ml-2 text-orange-600">{metrics.expired}</span>
            </div>
            <div>
              <span className="font-medium">Taux d'utilisation:</span>
              <span className="ml-2">{formatPercentage(metrics.usage)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant de surveillance en temps réel
export function RealTimePerformanceMonitor() {
  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState({
    loadTime: 0,
    queriesCount: 0,
    cacheHitRate: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simuler la collecte de données de performance
      setPerformanceData(prev => ({
        ...prev,
        loadTime: Math.random() * 100 + 50,
        queriesCount: prev.queriesCount + Math.floor(Math.random() * 3),
        cacheHitRate: Math.random() * 100,
        lastUpdate: new Date()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Activity className="h-4 w-4 mr-1" />
        Monitoring
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center space-x-1">
            <Activity className="h-4 w-4" />
            <span>Monitoring Temps Réel</span>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Temps de chargement:</span>
            <span className="font-medium">{performanceData.loadTime.toFixed(0)}ms</span>
          </div>
          <div className="flex justify-between">
            <span>Requêtes:</span>
            <span className="font-medium">{performanceData.queriesCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Cache Hit Rate:</span>
            <span className="font-medium">{performanceData.cacheHitRate.toFixed(1)}%</span>
          </div>
          <div className="text-xs text-gray-500 pt-1">
            Dernière mise à jour: {performanceData.lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}