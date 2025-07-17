import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, Upload, X, Star, MapPin, DollarSign, Ruler, 
  Building, Users, Wifi, Car, Coffee, Dumbbell,
  Shield, Eye, Edit, Trash2, Image
} from "lucide-react";
import type { Chambre, Cite } from "../../shared/types";
import { equipementLabels, formatPrixFCFA, transportLabels } from "../data/mockData";
import { useChambres, useCites } from "../hooks/useData";
import NotificationSuccess from "./NotificationSuccess";
import GestionDonnees from "./GestionDonnees";
import ConfigurationSupabase from "./ConfigurationSupabase";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("chambres");
  
  // État pour le formulaire de chambre
  const [nouvelleChambre, setNouvelleChambre] = useState<Partial<Chambre>>({
    titre: "",
    description: "",
    prix: 0,
    superficie: 0,
    type: "studio",
    equipements: [],
    disponible: true,
    chargesIncluses: false,
    caution: 0,
    contact: {
      nom: "",
      email: "",
      telephone: ""
    },
    caracteristiques: {
      etage: 1,
      ascenseur: false,
      balcon: false,
      vue: "",
      orientation: "",
      meuble: false
    }
  });

  // État pour le formulaire de cité
  const [nouvelleCite, setNouvelleCite] = useState<Partial<Cite>>({
    nom: "",
    ville: "",
    adresse: "",
    description: "",
    equipements: [],
    transport: []
  });

  const [photosSelectionnees, setPhotosSelectionnees] = useState<string[]>([]);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const { chambres: chambresExistantes, ajouterChambre, supprimerChambre, loading: loadingChambres } = useChambres();
  const { cites: citesExistantes, ajouterCite, loading: loadingCites } = useCites();

  const equipementsList = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "kitchenette", label: "Kitchenette", icon: Coffee },
    { id: "douche", label: "Douche privée", icon: Shield },
    { id: "parking", label: "Parking", icon: Car },
    { id: "salle_sport", label: "Salle de sport", icon: Dumbbell },
    { id: "laverie", label: "Laverie", icon: Building },
    { id: "meuble", label: "Meublé", icon: Users }
  ];

  const transportList = Object.entries(transportLabels).map(([id, label]) => ({ id, label }));





  const photosExemple = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=300&fit=crop"
  ];

  const ajouterPhoto = () => {
    const photoAleatoire = photosExemple[Math.floor(Math.random() * photosExemple.length)];
    setPhotosSelectionnees([...photosSelectionnees, photoAleatoire]);
  };

  const supprimerPhoto = (index: number) => {
    setPhotosSelectionnees(photosSelectionnees.filter((_, i) => i !== index));
  };

  const toggleEquipement = (equipementId: string, type: 'chambre' | 'cite') => {
    if (type === 'chambre') {
      const equipements = nouvelleChambre.equipements || [];
      const nouveauxEquipements = equipements.includes(equipementId)
        ? equipements.filter(eq => eq !== equipementId)
        : [...equipements, equipementId];
      setNouvelleChambre({ ...nouvelleChambre, equipements: nouveauxEquipements });
    } else {
      const equipements = nouvelleCite.equipements || [];
      const nouveauxEquipements = equipements.includes(equipementId)
        ? equipements.filter(eq => eq !== equipementId)
        : [...equipements, equipementId];
      setNouvelleCite({ ...nouvelleCite, equipements: nouveauxEquipements });
    }
  };

  const toggleTransport = (transportId: string) => {
    const transports = nouvelleCite.transport || [];
    const nouveauxTransports = transports.includes(transportId)
      ? transports.filter(t => t !== transportId)
      : [...transports, transportId];
    setNouvelleCite({ ...nouvelleCite, transport: nouveauxTransports });
  };

  const sauvegarderChambre = async () => {
    try {
      // Validation des champs requis
      if (!nouvelleChambre.titre || !nouvelleChambre.description || !nouvelleChambre.prix || !nouvelleChambre.superficie || !nouvelleChambre.citeId) {
        setNotificationMessage("Veuillez remplir tous les champs obligatoires.");
        setNotificationVisible(true);
        return;
      }

      if (!nouvelleChambre.contact?.nom || !nouvelleChambre.contact?.email || !nouvelleChambre.contact?.telephone) {
        setNotificationMessage("Veuillez remplir toutes les informations de contact.");
        setNotificationVisible(true);
        return;
      }

      // Créer la nouvelle chambre
      const chambreData = {
        ...nouvelleChambre,
        photos: photosSelectionnees,
        dateDisponibilite: nouvelleChambre.dateDisponibilite || new Date(),
        note: 0, // Note initiale
        nombreAvis: 0 // Pas d'avis au début
      } as Omit<Chambre, 'id'>;

      await ajouterChambre(chambreData);
      
      setNotificationMessage("Chambre ajoutée avec succès !");
      setNotificationVisible(true);
      
      // Reset du formulaire
      setNouvelleChambre({
        titre: "",
        description: "",
        prix: 0,
        superficie: 0,
        type: "studio",
        equipements: [],
        disponible: true,
        chargesIncluses: false,
        caution: 0,
        contact: { nom: "", email: "", telephone: "" },
        caracteristiques: {
          etage: 1,
          ascenseur: false,
          balcon: false,
          vue: "",
          orientation: "",
          meuble: false
        }
      });
      setPhotosSelectionnees([]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la chambre:', error);
      setNotificationMessage("Erreur lors de l'ajout de la chambre.");
      setNotificationVisible(true);
    }
  };

  const sauvegarderCite = async () => {
    try {
      // Validation des champs requis
      if (!nouvelleCite.nom || !nouvelleCite.ville || !nouvelleCite.adresse) {
        setNotificationMessage("Veuillez remplir tous les champs obligatoires.");
        setNotificationVisible(true);
        return;
      }

      // Coordonnées par défaut (vous pourriez intégrer un service de géocodage ici)
      const citeData = {
        ...nouvelleCite,
        coordonnees: { latitude: 45.7640847, longitude: 4.8421394 }, // Lyon par défaut
        noteGlobale: 0,
        nombreAvis: 0,
        photos: [],
        equipements: nouvelleCite.equipements || [],
        transport: nouvelleCite.transport || []
      } as Omit<Cite, 'id'>;

      await ajouterCite(citeData);
      
      setNotificationMessage("Cité ajoutée avec succès !");
      setNotificationVisible(true);
      
      // Reset du formulaire
      setNouvelleCite({
        nom: "",
        ville: "",
        adresse: "",
        description: "",
        equipements: [],
        transport: []
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la cité:', error);
      setNotificationMessage("Erreur lors de l'ajout de la cité.");
      setNotificationVisible(true);
    }
  };

  return (
    <>
      <NotificationSuccess
        message={notificationMessage}
        visible={notificationVisible}
        onClose={() => setNotificationVisible(false)}
      />
      
      <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Panneau d'Administration
        </h2>
        <p className="text-gray-600 text-lg">
          Gérez vos chambres et cités universitaires
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="chambres">Ajouter une Chambre</TabsTrigger>
          <TabsTrigger value="cites">Ajouter une Cité</TabsTrigger>
          <TabsTrigger value="gestion">Gestion</TabsTrigger>
          <TabsTrigger value="donnees">Données</TabsTrigger>\n          <TabsTrigger value="supabase">Supabase</TabsTrigger>
        </TabsList>

        {/* Onglet Ajouter une Chambre */}
        <TabsContent value="chambres" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Ajouter une nouvelle chambre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informations de base */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="titre">Titre de l'annonce *</Label>
                    <Input
                      id="titre"
                      placeholder="Ex: Studio moderne proche campus"
                      value={nouvelleChambre.titre}
                      onChange={(e) => setNouvelleChambre({ ...nouvelleChambre, titre: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez la chambre en détail..."
                      rows={4}
                      value={nouvelleChambre.description}
                      onChange={(e) => setNouvelleChambre({ ...nouvelleChambre, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prix">Prix mensuel (FCFA) *</Label>
                      <Input
                        id="prix"
                        type="number"
                        placeholder="150000"
                        value={nouvelleChambre.prix || ""}
                        onChange={(e) => setNouvelleChambre({ ...nouvelleChambre, prix: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="superficie">Superficie (m²) *</Label>
                      <Input
                        id="superficie"
                        type="number"
                        placeholder="25"
                        value={nouvelleChambre.superficie || ""}
                        onChange={(e) => setNouvelleChambre({ ...nouvelleChambre, superficie: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type de logement *</Label>
                      <Select
                        value={nouvelleChambre.type}
                        onValueChange={(value) => setNouvelleChambre({ ...nouvelleChambre, type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="T1">T1</SelectItem>
                          <SelectItem value="T2">T2</SelectItem>
                          <SelectItem value="chambre_partagee">Chambre partagée</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cite">Cité universitaire *</Label>
                      <Select
                        value={nouvelleChambre.citeId}
                        onValueChange={(value) => {
                          const cite = citesExistantes.find(c => c.id === value);
                          setNouvelleChambre({ ...nouvelleChambre, citeId: value, cite });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une cité" />
                        </SelectTrigger>
                        <SelectContent>
                          {citesExistantes.map((cite) => (
                            <SelectItem key={cite.id} value={cite.id}>
                              {cite.nom} - {cite.ville}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <div>
                    <Label>Photos du logement</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center space-y-4">
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <p className="text-sm text-gray-600">
                          Glissez vos photos ici ou cliquez pour les sélectionner
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={ajouterPhoto}
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter une photo d'exemple
                        </Button>
                        <p className="text-xs text-gray-500 mt-2">
                          Pour cette démo, nous utilisons des photos d'exemple d'Unsplash
                        </p>
                      </div>
                    </div>
                  </div>

                  {photosSelectionnees.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {photosSelectionnees.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => supprimerPhoto(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Équipements */}
              <div>
                <Label>Équipements disponibles</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {equipementsList.map((equipement) => {
                    const IconComponent = equipement.icon;
                    const isSelected = nouvelleChambre.equipements?.includes(equipement.id);
                    return (
                      <div
                        key={equipement.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? "border-blue-500 bg-blue-50 text-blue-700" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleEquipement(equipement.id, 'chambre')}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-sm font-medium">{equipement.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Détails financiers */}
              <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="caution">Caution (FCFA)</Label>
                    <Input
                      id="caution"
                      type="number"
                      placeholder="150000"
                      value={nouvelleChambre.caution || ""}
                      onChange={(e) => setNouvelleChambre({ ...nouvelleChambre, caution: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="charges"
                    checked={nouvelleChambre.chargesIncluses}
                    onCheckedChange={(checked) => setNouvelleChambre({ ...nouvelleChambre, chargesIncluses: checked })}
                  />
                  <Label htmlFor="charges">Charges incluses</Label>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="disponible"
                    checked={nouvelleChambre.disponible}
                    onCheckedChange={(checked) => setNouvelleChambre({ ...nouvelleChambre, disponible: checked })}
                  />
                  <Label htmlFor="disponible">Disponible immédiatement</Label>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold">Informations de contact</Label>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contact-nom">Nom complet *</Label>
                    <Input
                      id="contact-nom"
                      placeholder="Marie Dubois"
                      value={nouvelleChambre.contact?.nom || ""}
                      onChange={(e) => setNouvelleChambre({ 
                        ...nouvelleChambre, 
                        contact: { ...nouvelleChambre.contact!, nom: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email *</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="marie@email.com"
                      value={nouvelleChambre.contact?.email || ""}
                      onChange={(e) => setNouvelleChambre({ 
                        ...nouvelleChambre, 
                        contact: { ...nouvelleChambre.contact!, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-telephone">Téléphone *</Label>
                    <Input
                      id="contact-telephone"
                      placeholder="06.12.34.56.78"
                      value={nouvelleChambre.contact?.telephone || ""}
                      onChange={(e) => setNouvelleChambre({ 
                        ...nouvelleChambre, 
                        contact: { ...nouvelleChambre.contact!, telephone: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <Button onClick={sauvegarderChambre} size="lg" className="px-8">
                  <Plus className="w-5 h-5 mr-2" />
                  Publier la chambre
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Ajouter une Cité */}
        <TabsContent value="cites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Ajouter une nouvelle cité universitaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cite-nom">Nom de la cité *</Label>
                    <Input
                      id="cite-nom"
                      placeholder="Résidence Les Érables"
                      value={nouvelleCite.nom}
                      onChange={(e) => setNouvelleCite({ ...nouvelleCite, nom: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cite-ville">Ville *</Label>
                    <Input
                      id="cite-ville"
                      placeholder="Lyon"
                      value={nouvelleCite.ville}
                      onChange={(e) => setNouvelleCite({ ...nouvelleCite, ville: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cite-adresse">Adresse complète *</Label>
                    <Input
                      id="cite-adresse"
                      placeholder="12 Avenue des Étudiants, 69007 Lyon"
                      value={nouvelleCite.adresse}
                      onChange={(e) => setNouvelleCite({ ...nouvelleCite, adresse: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cite-description">Description de la cité</Label>
                  <Textarea
                    id="cite-description"
                    placeholder="Décrivez la cité universitaire, ses services, son ambiance..."
                    rows={6}
                    value={nouvelleCite.description}
                    onChange={(e) => setNouvelleCite({ ...nouvelleCite, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Équipements de la cité */}
              <div>
                <Label>Services et équipements de la cité</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {equipementsList.map((equipement) => {
                    const IconComponent = equipement.icon;
                    const isSelected = nouvelleCite.equipements?.includes(equipement.id);
                    return (
                      <div
                        key={equipement.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? "border-blue-500 bg-blue-50 text-blue-700" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleEquipement(equipement.id, 'cite')}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-sm font-medium">{equipement.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transports */}
              <div>
                <Label>Transports à proximité</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                  {transportList.map((transport) => {
                    const isSelected = nouvelleCite.transport?.includes(transport.id);
                    return (
                      <div
                        key={transport.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected 
                            ? "border-green-500 bg-green-50 text-green-700" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleTransport(transport.id)}
                      >
                        <span className="text-sm font-medium">{transport.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t">
                <Button onClick={sauvegarderCite} size="lg" className="px-8" disabled={loadingCites}>
                  <Building className="w-5 h-5 mr-2" />
                  {loadingCites ? "Création en cours..." : "Créer la cité"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Gestion */}
        <TabsContent value="gestion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Gestion des annonces existantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chambresExistantes.map((chambre) => (
                  <div key={chambre.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={chambre.photos[0] || "/api/placeholder/100/100"}
                        alt={chambre.titre}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold">{chambre.titre}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {formatPrixFCFA(chambre.prix)}/mois
                          </span>
                          <span className="flex items-center gap-1">
                            <Ruler className="w-4 h-4" />
                            {chambre.superficie}m²
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {chambre.note}/5
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={chambre.disponible ? "default" : "secondary"}>
                        {chambre.disponible ? "Disponible" : "Occupé"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
                          supprimerChambre(chambre.id);
                        }
                      }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Onglet Gestion des données */}
        <TabsContent value="donnees" className="space-y-6">
          <GestionDonnees onDataChange={() => {
            // Fonction pour recharger les données si nécessaire
            window.location.reload();
          }} />
        </TabsContent>

        {/* Onglet Configuration Supabase */}
        <TabsContent value="supabase" className="space-y-6">
          <ConfigurationSupabase onMigrationComplete={() => {
            window.location.reload();
          }} />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}