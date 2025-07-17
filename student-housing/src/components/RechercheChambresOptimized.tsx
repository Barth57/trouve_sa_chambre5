import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Search, MapPin, Star, DollarSign, Ruler, Heart, Map, List, 
  Phone, Mail, Eye, Filter, RefreshCw, Loader2, Settings
} from "lucide-react";
import type { Chambre, FiltreRecherche } from "../../shared/types";
import { equipementLabels, formatPrixFCFA } from "../data/mockData";
import { useOptimizedChambres, useChambresSearch } from "../hooks/useOptimizedData";
import { LazyImage } from "./LazyImage";
import CarteInteractive from "./CarteInteractive";
import { Pagination, PaginationInfo, PageSizeSelector } from "./Pagination";
import { PerformanceMetrics } from "./PerformanceMetrics";
import { useDebounce } from "../hooks/useDebounce";

export default function RechercheChambresOptimized() {
  const [filtres, setFiltres] = useState<FiltreRecherche>({
    prixMin: 50000,
    prixMax: 250000,
    superficieMin: 10,
    disponibleUniquement: true,
    noteMin: 3
  });

  const [vueMode, setVueMode] = useState<'liste' | 'carte'>('liste');
  const [chambreSélectionnée, setChambreSélectionnée] = useState<Chambre | null>(null);
  const [showPerformanceMetrics, setShowPerformanceMetrics] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Hook optimisé pour la pagination
  const {
    chambres,
    pagination,
    loading,
    error,
    currentPage,
    goToPage,
    nextPage,
    previousPage,
    updateFilters,
    refresh,
    isEmpty,
    hasResults
  } = useOptimizedChambres({
    defaultPageSize: pageSize,
    debounceMs: 500,
    enableCache: true
  });

  // Hook pour la recherche textuelle
  const {
    query,
    setQuery,
    results: searchResults,
    pagination: searchPagination,
    loading: searchLoading,
    goToPage: goToSearchPage,
    isEmpty: searchIsEmpty,
    hasResults: searchHasResults
  } = useChambresSearch();

  // Utiliser le debounce pour la recherche
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Basculer entre mode recherche et mode filtre
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      setIsSearchMode(true);
      setQuery(debouncedSearchQuery);
    } else {
      setIsSearchMode(false);
    }
  }, [debouncedSearchQuery, setQuery]);

  // Mettre à jour les filtres avec debounce
  useEffect(() => {
    if (!isSearchMode) {
      updateFilters({
        filters: {
          prixMin: filtres.prixMin,
          prixMax: filtres.prixMax,
          type: filtres.type,
          disponible: filtres.disponibleUniquement,
          ville: filtres.ville,
          equipements: filtres.equipements
        }
      });
    }
  }, [filtres, isSearchMode, updateFilters]);

  // Données à afficher selon le mode
  const currentChambres = isSearchMode ? searchResults : chambres;
  const currentPagination = isSearchMode ? searchPagination : pagination;
  const currentLoading = isSearchMode ? searchLoading : loading;
  const currentIsEmpty = isSearchMode ? searchIsEmpty : isEmpty;
  const currentHasResults = isSearchMode ? searchHasResults : hasResults;

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    // Recharger avec la nouvelle taille
    updateFilters({
      filters: {
        prixMin: filtres.prixMin,
        prixMax: filtres.prixMax,
        type: filtres.type,
        disponible: filtres.disponibleUniquement,
        ville: filtres.ville,
        equipements: filtres.equipements
      }
    });
  };

  const renderChambreCard = (chambre: Chambre) => (
    <Card key={chambre.id} className={`hover:shadow-lg transition-all duration-300 ${
      chambreSélectionnée?.id === chambre.id ? 'ring-2 ring-blue-500' : ''
    }`}>
      <div className="grid md:grid-cols-3 gap-6 p-6">
        {/* Photo avec lazy loading */}
        <div className="md:col-span-1">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <LazyImage
              src={chambre.photos[0] || '/placeholder-room.jpg'}
              alt={chambre.titre}
              className="w-full h-full object-cover"
              threshold={0.1}
            />
            {!chambre.disponible && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Non disponible</Badge>
              </div>
            )}
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
                <DollarSign className="w-6 h-6" />
                {formatPrixFCFA(chambre.prix)}
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
                Détails
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
  );

  if (currentLoading && currentChambres.length === 0) {
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
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
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
          Trouvez la chambre parfaite avec notre système de recherche optimisé
        </p>
      </div>

      {/* Barre de recherche principale */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Rechercher par titre, description, ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
            <Button
              variant="outline"
              onClick={refresh}
              disabled={currentLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${currentLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPerformanceMetrics(!showPerformanceMetrics)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Métriques
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métriques de performance */}
      {showPerformanceMetrics && (
        <PerformanceMetrics compact />
      )}

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Panneau de filtres */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres avancés
                {isSearchMode && (
                  <Badge variant="secondary" className="ml-2">
                    Recherche active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input
                  placeholder="Ex: Yaoundé, Douala..."
                  value={filtres.ville || ""}
                  onChange={(e) => setFiltres({ ...filtres, ville: e.target.value })}
                  disabled={isSearchMode}
                />
              </div>

              <div className="space-y-2">
                <Label>Type de logement</Label>
                <Select 
                  value={Array.isArray(filtres.type) ? filtres.type[0] || "" : filtres.type || ""} 
                  onValueChange={(value) => setFiltres({ ...filtres, type: value as any })}
                  disabled={isSearchMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous types</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="T1">T1</SelectItem>
                    <SelectItem value="chambre_partagee">Chambre partagée</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Prix mensuel: {formatPrixFCFA(filtres.prixMin || 50000)} - {formatPrixFCFA(filtres.prixMax || 250000)}</Label>
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
                    disabled={isSearchMode}
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
                    disabled={isSearchMode}
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
                    disabled={isSearchMode}
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
                  disabled={isSearchMode}
                />
                <Label htmlFor="disponible">Disponible uniquement</Label>
              </div>

              {isSearchMode && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    Mode recherche actif. Videz la barre de recherche pour utiliser les filtres.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Liste des résultats */}
        <div className="lg:col-span-3 space-y-6">
          {/* En-tête des résultats */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <PaginationInfo
                currentPage={currentPagination.page}
                totalPages={currentPagination.totalPages}
                totalItems={currentPagination.total}
                itemsPerPage={currentPagination.limit}
              />
              {error && (
                <p className="text-red-600 text-sm mt-1">
                  Erreur: {error}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <PageSizeSelector
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                options={[5, 10, 20, 50]}
              />
              
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
          </div>

          {/* Vue Liste */}
          {vueMode === 'liste' && (
            <>
              <div className="grid gap-6">
                {currentChambres.map(renderChambreCard)}
              </div>

              {/* Pagination */}
              {currentPagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPagination.page}
                    totalPages={currentPagination.totalPages}
                    hasNextPage={currentPagination.hasNextPage}
                    hasPreviousPage={currentPagination.hasPreviousPage}
                    onPageChange={isSearchMode ? goToSearchPage : goToPage}
                  />
                </div>
              )}
            </>
          )}

          {/* Vue Carte */}
          {vueMode === 'carte' && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-0 overflow-hidden">
                  <CarteInteractive
                    chambres={currentChambres}
                    hauteur="600px"
                    onMarkerClick={(chambre) => setChambreSélectionnée(chambre)}
                  />
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                {chambreSélectionnée ? (
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Chambre sélectionnée
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <LazyImage
                        src={chambreSélectionnée.photos[0] || '/placeholder-room.jpg'}
                        alt={chambreSélectionnée.titre}
                        className="w-full h-48 object-cover rounded-lg"
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
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-1 text-xl font-bold text-blue-600 mb-1">
                          <DollarSign className="w-5 h-5" />
                          {formatPrixFCFA(chambreSélectionnée.prix)}
                        </div>
                        <div className="space-y-2">
                          <Button size="sm" className="w-full">
                            <Phone className="w-4 h-4 mr-2" />
                            Contacter
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
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
                        Cliquez sur un marqueur pour voir les détails.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* État vide */}
          {currentIsEmpty && !currentLoading && (
            <Card className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isSearchMode ? 'Aucun résultat de recherche' : 'Aucun logement trouvé'}
              </h3>
              <p className="text-gray-600">
                {isSearchMode 
                  ? 'Essayez des termes de recherche différents.'
                  : 'Modifiez vos critères de filtrage pour voir plus de résultats.'
                }
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}