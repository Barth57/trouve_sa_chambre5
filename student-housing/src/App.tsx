import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Home, Shield, MapPin, Star, Plus, Zap, RotateCcw } from "lucide-react";
import RechercheChambres from "./components/RechercheChambres";
import RechercheChambresOptimized from "./components/RechercheChambresOptimized";
import AdminPanel from "./components/AdminPanel";
import AccueilHero from "./components/AccueilHero";
import StatutStockage from "./components/StatutStockage";
import { RealTimePerformanceMonitor } from "./components/PerformanceMetrics";

export default function App() {
  const [activeTab, setActiveTab] = useState("accueil");
  const [useOptimizedSearch, setUseOptimizedSearch] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Trouvé sa chambre
                </h1>
                {useOptimizedSearch && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Optimisé
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto">
                  <TabsTrigger value="accueil" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span className="hidden sm:inline">Accueil</span>
                  </TabsTrigger>
                  <TabsTrigger value="recherche" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="hidden sm:inline">Rechercher</span>
                    {useOptimizedSearch && (
                      <Zap className="w-3 h-3 ml-1 text-blue-500" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              {activeTab === "recherche" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUseOptimizedSearch(!useOptimizedSearch)}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {useOptimizedSearch ? 'Version Classique' : 'Version Optimisée'}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        <StatutStockage />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="accueil" className="mt-0">
            <AccueilHero onNavigate={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="recherche" className="mt-0">
            {useOptimizedSearch ? (
              <RechercheChambresOptimized />
            ) : (
              <RechercheChambres />
            )}
          </TabsContent>
          
          <TabsContent value="admin" className="mt-0">
            <AdminPanel />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Monitoring en temps réel */}
      {useOptimizedSearch && <RealTimePerformanceMonitor />}
    </div>
  );
}
