import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, Star, Euro, Ruler, Wifi, Car, Users, Phone, Mail, Eye, Heart, Map, List } from "lucide-react";
import type { Chambre, FiltreRecherche } from "../../shared/types";
import { equipementLabels } from "../data/mockData";
import { useChambres } from "../hooks/useData";
import GaleriePhotos from "./GaleriePhotos";
import CarteInteractive from "./CarteInteractive";

export default function RechercheChambres() {
  const [filtres, setFiltres] = useState<FiltreRecherche>({
    prixMin: 50000,
    prixMax: 250000,
    superficieMin: 10,
    disponibleUniquement: true,
    noteMin: 3
  });

  const { chambres, loading } = useChambres();
  const [chambresFiltrees, setChambresFiltrees] = useState<Chambre[]>([]);
  const [vueMode, setVueMode] = useState<'liste' | 'carte'>('liste');
  const [chambreSélectionnée, setChambreSélectionnée] = useState<Chambre | null>(null);

  const appliquerFiltres = () => {
    let resultats = chambres.filter(chambre => {
      if (filtres.prixMin && chambre.prix < filtres.prixMin) return false;
      if (filtres.prixMax && chambre.prix > filtres.prixMax) return false;
      if (filtres.superficieMin && chambre.superficie < filtres.superficieMin) return false;
      if (filtres.disponibleUniquement && !chambre.disponible) return false;
      if (filtres.noteMin && chambre.note < filtres.noteMin) return false;
      if (filtres.ville && !chambre.cite.ville.toLowerCase().includes(filtres.ville.toLowerCase())) return false;
      return true;
    });
    setChambresFiltrees(resultats);
  };

  // Appliquer les filtres automatiquement au changement
  useEffect(() => {
    if (!loading) {
      appliquerFiltres();
    }
  }, [filtres, chambres, loading]);



  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rechercher un logement
          </h2>
          <p className="text-gray-600 text-lg">
            Chargement des données...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Rechercher un logement
        </h2>
        <p className="text-gray-600 text-lg">
          Utilisez nos filtres pour trouver la chambre parfaite selon vos critères
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Panneau de filtres */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Filtres de recherche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  placeholder="Ex: Lyon, Paris..."
                  value={filtres.ville || ""}
                  onChange={(e) => setFiltres({ ...filtres, ville: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Type de logement</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="T1">T1</SelectItem>
                    <SelectItem value="chambre_partagee">Chambre partagée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Prix mensuel: {filtres.prixMin}€ - {filtres.prixMax}€</Label>
                <div className="px-2">
                  <Slider
                    min={30000}
                    max={300000}
                    step={10000}
                    value={[filtres.prixMin || 50000, filtres.prixMax || 250000]}
                    onValueChange={([min, max]) => 
                      setFiltres({ ...filtres, prixMin: min, prixMax: max })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Superficie minimum: {filtres.superficieMin}m²</Label>
                <div className="px-2">
                  <Slider
                    min={8}
                    max={50}
                    step={2}
                    value={[filtres.superficieMin || 10]}
                    onValueChange={([value]) => 
                      setFiltres({ ...filtres, superficieMin: value })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Note minimum: {filtres.noteMin}/5</Label>
                <div className="px-2">
                  <Slider
                    min={1}
                    max={5}
                    step={0.5}
                    value={[filtres.noteMin || 3]}
                    onValueChange={([value]) => 
                      setFiltres({ ...filtres, noteMin: value })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="disponible"
                  checked={filtres.disponibleUniquement}
                  onCheckedChange={(checked) => 
                    setFiltres({ ...filtres, disponibleUniquement: checked as boolean })
                  }
                />
                <Label htmlFor="disponible">Disponible uniquement</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des résultats */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {chambresFiltrees.length} logement{chambresFiltrees.length > 1 ? "s" : ""} trouvé{chambresFiltrees.length > 1 ? "s" : ""}
            </p>
            
            {/* Boutons pour changer la vue */}
            <div className="flex rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setVueMode('liste')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  vueMode === 'liste'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                Liste
              </button>
              <button
                onClick={() => setVueMode('carte')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  vueMode === 'carte'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                Carte
              </button>
            </div>
          </div>

          {/* Vue Liste */}
          {vueMode === 'liste' && (
            <div className="grid gap-6">
              {chambresFiltrees.map((chambre) => (
                <Card key={chambre.id} className={`hover:shadow-lg transition-all duration-300 ${
                  chambreSélectionnée?.id === chambre.id ? 'ring-2 ring-blue-500' : ''
                }`}>
                  <div className="grid md:grid-cols-3 gap-6 p-6">
                    {/* Photo */}
                    <div className="md:col-span-1">
                      <div className="relative">
                        <GaleriePhotos 
                          photos={chambre.photos}
                          titre={chambre.titre}
                          disponible={chambre.disponible}
                        />
                        <div className="absolute top-3 right-3">
                          <Button size="sm" variant="outline" className="bg-white/80 hover:bg-white">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {chambre.titre}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {chambre.cite.ville}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {chambre.note}/5 ({chambre.nombreAvis} avis)
                          </div>
                          <div className="flex items-center gap-1">
                            <Ruler className="w-4 h-4" />
                            {chambre.superficie}m²
                          </div>
                        </div>
                        <p className="text-gray-600 line-clamp-2">
                          {chambre.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {chambre.equipements.slice(0, 4).map((equipement) => (
                          <Badge key={equipement} variant="outline" className="text-xs">
                            {equipementLabels[equipement] || equipement}
                          </Badge>
                        ))}
                        {chambre.equipements.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{chambre.equipements.length - 4} autres
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <div className="flex items-center gap-1 text-2xl font-bold text-blue-600">
                            <Euro className="w-6 h-6" />
                            {chambre.prix}
                          </div>
                          <div className="text-sm text-gray-500">
                            /mois {chambre.chargesIncluses ? "charges incluses" : "+ charges"}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setChambreSélectionnée(chambre);
                              setVueMode('carte');
                            }}
                          >
                            <MapPin className="w-4 h-4 mr-2" />
                            Voir sur carte
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </Button>
                          <Button size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Contacter
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Vue Carte */}
          {vueMode === 'carte' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Carte */}
              <div className="lg:col-span-2">
                <Card className="p-0 overflow-hidden">
                  <CarteInteractive
                    chambres={chambresFiltrees}
                    hauteur="600px"
                    onMarkerClick={(chambre) => setChambreSélectionnée(chambre)}
                  />
                </Card>
              </div>
              
              {/* Panneau détails de la chambre sélectionnée */}
              <div className="lg:col-span-1">
                {chambreSélectionnée ? (
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Chambre sélectionnée
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <GaleriePhotos 
                        photos={chambreSélectionnée.photos}
                        titre={chambreSélectionnée.titre}
                        disponible={chambreSélectionnée.disponible}
                      />
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {chambreSélectionnée.titre}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          <span>{chambreSélectionnée.cite.nom} - {chambreSélectionnée.cite.ville}</span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {chambreSélectionnée.description}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{chambreSélectionnée.note}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Ruler className="w-4 h-4" />
                          <span>{chambreSélectionnée.superficie}m²</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {chambreSélectionnée.equipements.slice(0, 3).map((equipement) => (
                          <Badge key={equipement} variant="outline" className="text-xs">
                            {equipementLabels[equipement] || equipement}
                          </Badge>
                        ))}
                        {chambreSélectionnée.equipements.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{chambreSélectionnée.equipements.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-1 text-xl font-bold text-blue-600 mb-1">
                          <Euro className="w-5 h-5" />
                          {chambreSélectionnée.prix}€
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          /mois {chambreSélectionnée.chargesIncluses ? "charges incluses" : "+ charges"}
                        </div>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            <Phone className="w-4 h-4 mr-2" />
                            Contacter
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir tous les détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="sticky top-24">
                    <CardContent className="p-8 text-center">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Sélectionnez une chambre
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Cliquez sur un marqueur de la carte pour voir les détails d'une chambre.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {chambresFiltrees.length === 0 && (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun logement trouvé
              </h3>
              <p className="text-gray-600">
                Essayez de modifier vos critères de recherche pour voir plus de résultats.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}