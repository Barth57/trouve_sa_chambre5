import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, Cloud, Upload, Download, AlertTriangle, 
  CheckCircle, Info, Settings, Key, Copy, ExternalLink,
  Loader2, RefreshCw
} from "lucide-react";
import { useMigration } from "../hooks/useSupabaseData";
import NotificationSuccess from "./NotificationSuccess";

interface Props {
  onMigrationComplete?: () => void;
}

export default function ConfigurationSupabase({ onMigrationComplete }: Props) {
  const { migrationStatus, migrerVersSupabase, isSupabaseConfigured } = useMigration();
  const [notification, setNotification] = useState({ visible: false, message: "" });
  const [urlSupabase, setUrlSupabase] = useState(import.meta.env.VITE_SUPABASE_URL || "");
  const [cleSupabase, setCleSupabase] = useState(import.meta.env.VITE_SUPABASE_ANON_KEY || "");

  const afficherNotification = (message: string) => {
    setNotification({ visible: true, message });
  };

  const copierSchema = () => {
    const schema = `-- Schéma SQL pour Trouvé sa chambre
-- À exécuter dans l'éditeur SQL de votre projet Supabase

-- Table des cités universitaires
CREATE TABLE cites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom VARCHAR NOT NULL,
  ville VARCHAR NOT NULL,
  adresse TEXT NOT NULL,
  description TEXT,
  latitude FLOAT,
  longitude FLOAT,
  equipements TEXT[],
  transport TEXT[],
  photos TEXT[],
  note_globale FLOAT DEFAULT 0,
  nombre_avis INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des chambres
CREATE TABLE chambres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cite_id UUID REFERENCES cites(id) ON DELETE CASCADE,
  titre VARCHAR NOT NULL,
  description TEXT NOT NULL,
  prix INTEGER NOT NULL,
  superficie INTEGER NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('studio', 'T1', 'T2', 'chambre_partagee')),
  equipements TEXT[],
  disponible BOOLEAN DEFAULT true,
  charges_incluses BOOLEAN DEFAULT false,
  caution INTEGER DEFAULT 0,
  photos TEXT[],
  note FLOAT DEFAULT 0,
  nombre_avis INTEGER DEFAULT 0,
  date_disponibilite DATE DEFAULT CURRENT_DATE,
  contact_nom VARCHAR NOT NULL,
  contact_email VARCHAR NOT NULL,
  contact_telephone VARCHAR NOT NULL,
  etage INTEGER DEFAULT 1,
  ascenseur BOOLEAN DEFAULT false,
  balcon BOOLEAN DEFAULT false,
  vue VARCHAR,
  orientation VARCHAR,
  meuble BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE cites ENABLE ROW LEVEL SECURITY;
ALTER TABLE chambres ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès public (ajustez selon vos besoins)
CREATE POLICY "Public read access" ON cites FOR SELECT TO public USING (true);
CREATE POLICY "Public write access" ON cites FOR ALL TO public USING (true);
CREATE POLICY "Public read access" ON chambres FOR SELECT TO public USING (true);
CREATE POLICY "Public write access" ON chambres FOR ALL TO public USING (true);`;

    navigator.clipboard.writeText(schema);
    afficherNotification("Schéma SQL copié dans le presse-papiers !");
  };

  const genererEnvExample = () => {
    const envContent = `# Configuration Supabase pour Trouvé sa chambre
VITE_SUPABASE_URL=${urlSupabase || 'https://votre-projet.supabase.co'}
VITE_SUPABASE_ANON_KEY=${cleSupabase || 'votre-cle-anonyme'}

# Autres variables
VITE_APP_NAME="Trouvé sa chambre"
VITE_APP_DESCRIPTION="Plateforme de logement étudiant au Cameroun"`;

    navigator.clipboard.writeText(envContent);
    afficherNotification("Configuration .env copiée dans le presse-papiers !");
  };

  const handleMigration = async () => {
    await migrerVersSupabase();
    if (migrationStatus.completed && onMigrationComplete) {
      onMigrationComplete();
    }
  };

  return (
    <>
      <NotificationSuccess
        message={notification.message}
        visible={notification.visible}
        onClose={() => setNotification({ visible: false, message: "" })}
      />

      <div className="space-y-6">
        {/* Statut de configuration */}
        <Card className={isSupabaseConfigured ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isSupabaseConfigured ? "bg-green-600" : "bg-yellow-600"
              }`}>
                <Database className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${isSupabaseConfigured ? "text-green-800" : "text-yellow-800"}`}>
                  {isSupabaseConfigured ? "Supabase Configuré" : "Configuration Requise"}
                </h3>
                <p className={`text-sm ${isSupabaseConfigured ? "text-green-600" : "text-yellow-600"}`}>
                  {isSupabaseConfigured 
                    ? "Votre application utilise Supabase pour le stockage des données"
                    : "Configurez Supabase pour une base de données en ligne"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="setup" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="setup">Configuration</TabsTrigger>
            <TabsTrigger value="migration">Migration</TabsTrigger>
            <TabsTrigger value="schema">Schéma SQL</TabsTrigger>
          </TabsList>

          {/* Onglet Configuration */}
          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Étapes de configuration Supabase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <div>
                      <h4 className="font-medium text-blue-900">Créer un projet Supabase</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Allez sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">supabase.com</a> et créez un nouveau projet
                      </p>
                      <Button variant="outline" size="sm" className="mt-2" asChild>
                        <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ouvrir Supabase
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <div>
                      <h4 className="font-medium text-purple-900">Récupérer les clés API</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        Dans Settings → API, copiez l'URL du projet et la clé anonyme publique
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <div>
                      <h4 className="font-medium text-green-900">Exécuter le schéma SQL</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Dans l'éditeur SQL, exécutez le schéma pour créer les tables
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <div>
                      <h4 className="font-medium text-orange-900">Configurer les variables d'environnement</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        Ajoutez vos clés dans un fichier .env à la racine du projet
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formulaire de configuration */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Configuration des clés
                  </h4>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="supabase-url">URL du projet Supabase</Label>
                      <Input
                        id="supabase-url"
                        placeholder="https://votre-projet.supabase.co"
                        value={urlSupabase}
                        onChange={(e) => setUrlSupabase(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="supabase-key">Clé anonyme (publique)</Label>
                      <Input
                        id="supabase-key"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        value={cleSupabase}
                        onChange={(e) => setCleSupabase(e.target.value)}
                        type="password"
                      />
                    </div>
                  </div>

                  <Button onClick={genererEnvExample} variant="outline" className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copier la configuration .env
                  </Button>

                  <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
                    <strong>Important :</strong> Créez un fichier <code>.env</code> à la racine de votre projet et collez-y la configuration. 
                    Redémarrez ensuite votre serveur de développement.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Migration */}
          <TabsContent value="migration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Migration localStorage → Supabase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isSupabaseConfigured ? (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                      <p className="font-medium mb-1">Configuration Supabase requise</p>
                      <p>Veuillez d'abord configurer Supabase dans l'onglet Configuration avant de pouvoir migrer vos données.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Migration des données</p>
                        <p>Cette opération va transférer toutes vos chambres et cités stockées localement vers Supabase. 
                        Vos données actuelles resteront intactes en cas d'échec.</p>
                      </div>
                    </div>

                    {migrationStatus.inProgress && (
                      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium">Migration en cours...</p>
                          <p>Veuillez patienter pendant le transfert des données.</p>
                        </div>
                      </div>
                    )}

                    {migrationStatus.completed && (
                      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="text-sm text-green-700">
                          <p className="font-medium mb-1">Migration réussie !</p>
                          <p>{migrationStatus.message}</p>
                        </div>
                      </div>
                    )}

                    {migrationStatus.error && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div className="text-sm text-red-700">
                          <p className="font-medium mb-1">Erreur de migration</p>
                          <p>{migrationStatus.error}</p>
                        </div>
                      </div>
                    )}

                    <Button 
                      onClick={handleMigration}
                      disabled={migrationStatus.inProgress}
                      size="lg"
                      className="w-full"
                    >
                      {migrationStatus.inProgress ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <Cloud className="w-5 h-5 mr-2" />
                      )}
                      {migrationStatus.inProgress ? "Migration en cours..." : "Migrer vers Supabase"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Schéma */}
          <TabsContent value="schema" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Schéma SQL pour Supabase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-medium mb-1">Instructions</p>
                    <p>1. Copiez le schéma SQL ci-dessous</p>
                    <p>2. Ouvrez l'éditeur SQL dans votre dashboard Supabase</p>
                    <p>3. Collez et exécutez le schéma pour créer les tables</p>
                  </div>
                </div>

                <Button onClick={copierSchema} variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le schéma SQL
                </Button>

                <Textarea
                  value={`-- Schéma SQL pour Trouvé sa chambre (voir supabase/schema.sql pour la version complète)
-- Tables : cites, chambres
-- Avec RLS, index et triggers automatiques
-- À exécuter dans l'éditeur SQL de Supabase`}
                  readOnly
                  className="h-32 text-xs font-mono"
                />

                <p className="text-sm text-gray-600">
                  Le schéma complet est disponible dans le fichier <code>supabase/schema.txt</code> de votre projet.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}