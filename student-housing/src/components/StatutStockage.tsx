import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff, Database } from "lucide-react";

export default function StatutStockage() {
  const [estOnline, setEstOnline] = useState(navigator.onLine);
  const [derniereSync, setDerniereSync] = useState<Date | null>(null);
  const [tailleStockage, setTailleStockage] = useState("0 KB");

  useEffect(() => {
    const handleOnlineStatus = () => {
      setEstOnline(navigator.onLine);
    };

    const calculerTailleStockage = () => {
      try {
        const chambresData = localStorage.getItem('studyrooms_chambres') || '';
        const citesData = localStorage.getItem('studyrooms_cites') || '';
        const compteursData = localStorage.getItem('studyrooms_compteurs') || '';
        
        const totalBytes = new Blob([chambresData + citesData + compteursData]).size;
        const totalKB = (totalBytes / 1024).toFixed(2);
        
        setTailleStockage(`${totalKB} KB`);
      } catch {
        setTailleStockage('Erreur');
      }
    };

    const handleStorageChange = () => {
      setDerniereSync(new Date());
      calculerTailleStockage();
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    window.addEventListener('storage', handleStorageChange);

    // Vérifier la taille du stockage au démarrage
    calculerTailleStockage();
    setDerniereSync(new Date());

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "Jamais";
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="border-0 bg-gray-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {estOnline ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {estOnline ? "En ligne" : "Hors ligne"}
              </span>
            </div>
            
            <div className="h-4 w-px bg-gray-300" />
            
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">
                Stockage: {tailleStockage}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              Dernière sync: {formatDate(derniereSync)}
            </span>
            
            <Badge 
              variant="outline" 
              className="text-xs bg-white border-green-200 text-green-700"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
              Sauvegarde auto
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}