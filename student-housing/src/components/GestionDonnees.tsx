import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Download, Upload, Database, RefreshCw, AlertTriangle, 
  CheckCircle, Info, Trash2, HardDrive 
} from "lucide-react";
import { DataService } from "../data/dataService";
import { useStatistiques } from "../hooks/useData";

interface GestionDonneesProps {
  onDataChange?: () => void;
}

export default function GestionDonnees({ onDataChange }: GestionDonneesProps) {
  const { stats, recharger: rechargerStats } = useStatistiques();
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const afficherMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  // Exporter les données vers un fichier JSON
  const exporterDonnees = () => {
    try {
      const donnees = DataService.exporterDonnees();
      const blob = new Blob([JSON.stringify(donnees, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `studyrooms-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      afficherMessage('success', 'Données exportées avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'exportation:', error);
      afficherMessage('error', 'Erreur lors de l\'exportation des données.');
    }
  };

  // Importer les données depuis un fichier JSON
  const importerDonnees = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const donnees = JSON.parse(e.target?.result as string);
        
        // Valider la structure des données
        if (!donnees.chambres && !donnees.cites) {
          throw new Error('Format de fichier invalide');
        }
        
        const succes = DataService.importerDonnees(donnees);
        
        if (succes) {
          afficherMessage('success', `Données importées : ${donnees.chambres?.length || 0} chambres, ${donnees.cites?.length || 0} cités`);
          rechargerStats();
          onDataChange?.();
        } else {
          throw new Error('Échec de l\'importation');
        }
      } catch (error) {
        console.error('Erreur lors de l\'importation:', error);
        afficherMessage('error', 'Erreur lors de l\'importation. Vérifiez le format du fichier.');
      } finally {
        setIsLoading(false);
        // Réinitialiser l'input file
        event.target.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  // Réinitialiser toutes les données
  const reinitialiserDonnees = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les données ? Cette action est irréversible.')) {
      try {
        DataService.reinitialiserDonnees();
        afficherMessage('info', 'Toutes les données ont été supprimées. Rechargez la page pour voir les données par défaut.');
        rechargerStats();
        onDataChange?.();
      } catch (error) {
        console.error('Erreur lors de la réinitialisation:', error);
        afficherMessage('error', 'Erreur lors de la réinitialisation des données.');
      }
    }
  };

  // Calculer la taille du stockage
  const getTailleStockage = () => {
    try {
      const chambresData = localStorage.getItem('studyrooms_chambres') || '';
      const citesData = localStorage.getItem('studyrooms_cites') || '';
      const compteursData = localStorage.getItem('studyrooms_compteurs') || '';
      
      const totalBytes = new Blob([chambresData + citesData + compteursData]).size;
      const totalKB = (totalBytes / 1024).toFixed(2);
      
      return `${totalKB} KB`;
    } catch {
      return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={`border-l-4 ${
          message.type === 'success' ? 'border-green-500 bg-green-50' :
          message.type === 'error' ? 'border-red-500 bg-red-50' :
          'border-blue-500 bg-blue-50'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {message.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
            {message.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
            <AlertDescription className={
              message.type === 'success' ? 'text-green-800' :
              message.type === 'error' ? 'text-red-800' :
              'text-blue-800'
            }>
              {message.text}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Statistiques du stockage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Statistiques du stockage local
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalChambres}</div>
              <div className="text-sm text-gray-600">Chambres</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.chambresDisponibles}</div>
              <div className="text-sm text-gray-600">Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalCites}</div>
              <div className="text-sm text-gray-600">Cités</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.prixMoyen}€</div>
              <div className="text-sm text-gray-600">Prix moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.noteMoyenne}/5</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>Taille du stockage:</span>
              </div>
              <Badge variant="outline">{getTailleStockage()}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sauvegarde et restauration */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter les données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Téléchargez toutes vos données (chambres et cités) dans un fichier JSON pour les sauvegarder ou les transférer.
            </p>
            <Button onClick={exporterDonnees} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Télécharger la sauvegarde
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Importer les données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Restaurez vos données depuis un fichier de sauvegarde. Les données existantes seront remplacées.
            </p>
            <div>
              <Label htmlFor="file-import">Fichier de sauvegarde (JSON)</Label>
              <Input
                id="file-import"
                type="file"
                accept=".json"
                onChange={importerDonnees}
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Importation en cours...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Zone de danger */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            Zone de danger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Réinitialiser toutes les données</h4>
            <p className="text-red-700 text-sm mb-3">
              Cette action supprimera définitivement toutes les chambres et cités que vous avez ajoutées. 
              Les données par défaut seront restaurées au prochain rechargement.
            </p>
            <Button
              variant="destructive"
              onClick={reinitialiserDonnees}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer toutes les données
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informations techniques */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">À propos du stockage local</p>
              <p>
                Vos données sont sauvegardées localement dans votre navigateur. Elles persistent entre les sessions 
                mais peuvent être perdues si vous videz le cache de votre navigateur. Pensez à exporter régulièrement 
                vos données importantes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}