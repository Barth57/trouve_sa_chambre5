import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Star, Users, Shield, Search, Map } from "lucide-react";
import CarteInteractive from "./CarteInteractive";
import { useChambres, useStatistiques } from "../hooks/useData";

interface AccueilHeroProps {
  onNavigate: (tab: string) => void;
}

export default function AccueilHero({ onNavigate }: AccueilHeroProps) {
  const { chambres } = useChambres();
  const { stats } = useStatistiques();
  
  const statistiques = [
    { label: "Chambres disponibles", valeur: `${stats.chambresDisponibles}`, icone: MapPin },
    { label: "Cités partenaires", valeur: `${stats.totalCites}`, icone: Users },
    { label: "Note moyenne", valeur: `${stats.noteMoyenne}/5`, icone: Star },
    { label: "Total logements", valeur: `${stats.totalChambres}+`, icone: Shield }
  ];

  return (
    <div className="space-y-16">
      {/* Section Hero */}
      <section className="text-center space-y-8 py-16">
        <div className="space-y-6">
          <Badge variant="secondary" className="px-4 py-2 text-sm">
            🏠 Plateforme #1 pour les logements étudiants
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Trouvez votre
            <br />
            <span className="relative">
              chambre idéale
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez des milliers de chambres étudiantes vérifiées dans les meilleures cités universitaires. 
            Location simple, sécurisée et transparente.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
            onClick={() => onNavigate("recherche")}
          >
            <Search className="w-5 h-5 mr-2" />
            Rechercher un logement
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6 hover:bg-gray-50"
            onClick={() => onNavigate("admin")}
          >
            <Shield className="w-5 h-5 mr-2" />
            Espace Propriétaire
          </Button>
        </div>
      </section>

      {/* Statistiques */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statistiques.map((stat, index) => {
          const IconComponent = stat.icone;
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.valeur}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Prévisualisation carte */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explorez les logements sur la carte
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Visualisez instantanément l'emplacement de tous les logements disponibles
          </p>
        </div>
        
        <Card className="overflow-hidden">
          <CarteInteractive
            chambres={chambres.slice(0, 5)}
            hauteur="400px"
            onMarkerClick={() => {}}
          />
        </Card>
        
        <div className="text-center">
          <Button 
            onClick={() => onNavigate("recherche")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Map className="w-5 h-5 mr-2" />
            Explorer la carte complète
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Recherche Avancée</h3>
            <p className="text-gray-600">
              Filtrez par prix, localisation, équipements et trouvez exactement ce que vous cherchez.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Sécurité Garantie</h3>
            <p className="text-gray-600">
              Tous nos logements sont vérifiés et nos propriétaires certifiés pour votre sécurité.
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-8 space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Avis Vérifiés</h3>
            <p className="text-gray-600">
              Consultez les avis d'autres étudiants pour faire le meilleur choix en toute confiance.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}