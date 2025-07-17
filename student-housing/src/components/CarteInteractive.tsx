import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Chambre, Cite } from "../../shared/types";

// Fix pour les icônes Leaflet dans Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface CarteInteractiveProps {
  chambres: Chambre[];
  hauteur?: string;
  centreInitial?: [number, number];
  zoomInitial?: number;
  onMarkerClick?: (chambre: Chambre) => void;
}

export default function CarteInteractive({ 
  chambres, 
  hauteur = "400px", 
  centreInitial = [45.7640847, 4.8421394], // Lyon par défaut
  zoomInitial = 11,
  onMarkerClick 
}: CarteInteractiveProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Créer la carte
    const map = L.map(mapContainerRef.current).setView(centreInitial, zoomInitial);
    mapRef.current = map;

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [centreInitial, zoomInitial]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Supprimer tous les marqueurs existants
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Créer des icônes personnalisées
    const iconeChambreDisponible = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
      className: 'marker-available'
    });

    const iconeChambreOccupee = new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5S25 25 25 12.5C25 5.596 19.404 0 12.5 0z" fill="#ef4444"/>
          <circle cx="12.5" cy="12.5" r="7" fill="white"/>
        </svg>
      `),
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Grouper les chambres par cité et calculer les positions
    const citesAvecChambres = new Map<string, { cite: Cite; chambres: Chambre[] }>();
    
    chambres.forEach(chambre => {
      const citeId = chambre.cite.id;
      if (!citesAvecChambres.has(citeId)) {
        citesAvecChambres.set(citeId, { cite: chambre.cite, chambres: [] });
      }
      citesAvecChambres.get(citeId)!.chambres.push(chambre);
    });

    // Ajouter les marqueurs pour chaque cité avec toutes ses chambres
    citesAvecChambres.forEach(({ cite, chambres: chambresData }) => {
      const { latitude, longitude } = cite.coordonnees;
      
      // Compter les chambres disponibles et occupées
      const chambresDisponibles = chambresData.filter(c => c.disponible);
      const chambresOccupees = chambresData.filter(c => !c.disponible);
      
      // Utiliser l'icône appropriée (verte si au moins une chambre disponible, rouge sinon)
      const icone = chambresDisponibles.length > 0 ? iconeChambreDisponible : iconeChambreOccupee;
      
      const marker = L.marker([latitude, longitude], { icon: icone }).addTo(map);
      
      // Créer le contenu du popup
      const popupContent = document.createElement('div');
      popupContent.className = 'popup-content';
      popupContent.innerHTML = `
        <div style="min-width: 280px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
            ${cite.nom}
          </h3>
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #6b7280; display: flex; align-items: center;">
            📍 ${cite.ville}
          </p>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">
            ⭐ ${cite.noteGlobale}/5 (${cite.nombreAvis} avis)
          </p>
          <div style="display: flex; gap: 8px; margin-bottom: 12px;">
            ${chambresDisponibles.length > 0 ? `<span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${chambresDisponibles.length} disponible${chambresDisponibles.length > 1 ? 's' : ''}</span>` : ''}
            ${chambresOccupees.length > 0 ? `<span style="background: #fef2f2; color: #dc2626; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500;">${chambresOccupees.length} occupée${chambresOccupees.length > 1 ? 's' : ''}</span>` : ''}
          </div>
          <div id="chambres-list-${cite.id}" style="max-height: 200px; overflow-y: auto;"></div>
        </div>
      `;
      
      // Ajouter la liste des chambres
      const chambresListElement = popupContent.querySelector(`#chambres-list-${cite.id}`) as HTMLElement;
      chambresData.forEach(chambre => {
        const chambreElement = document.createElement('div');
        chambreElement.style.cssText = `
          padding: 8px; 
          border: 1px solid #e5e7eb; 
          border-radius: 8px; 
          margin-bottom: 6px; 
          cursor: pointer; 
          transition: background-color 0.2s;
          background: ${chambre.disponible ? '#f9fafb' : '#fef2f2'};
        `;
        
        chambreElement.innerHTML = `
          <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 4px;">
            <span style="font-weight: 500; font-size: 14px; color: #1f2937;">${chambre.titre}</span>
            <span style="font-weight: bold; color: #2563eb; font-size: 14px;">${chambre.prix}€/mois</span>
          </div>
          <div style="display: flex; gap: 12px; font-size: 12px; color: #6b7280;">
            <span>📐 ${chambre.superficie}m²</span>
            <span>⭐ ${chambre.note}/5</span>
            <span style="color: ${chambre.disponible ? '#059669' : '#dc2626'};">
              ${chambre.disponible ? '✅ Disponible' : '🚫 Occupé'}
            </span>
          </div>
        `;
        
        chambreElement.addEventListener('mouseenter', () => {
          chambreElement.style.backgroundColor = chambre.disponible ? '#f3f4f6' : '#fee2e2';
        });
        
        chambreElement.addEventListener('mouseleave', () => {
          chambreElement.style.backgroundColor = chambre.disponible ? '#f9fafb' : '#fef2f2';
        });
        
        chambreElement.addEventListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(chambre);
          }
        });
        
        chambresListElement.appendChild(chambreElement);
      });
      
      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
      });
    });

    // Ajuster la vue pour inclure tous les marqueurs si il y en a
    if (chambres.length > 0) {
      const markers = Array.from(citesAvecChambres.values()).map(({ cite }) => 
        L.marker([cite.coordonnees.latitude, cite.coordonnees.longitude])
      );
      
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        
        try {
          map.fitBounds(group.getBounds(), { padding: [20, 20] });
        } catch (e) {
          // Si fitBounds échoue, garder la vue par défaut
          console.warn('Impossible d\'ajuster la vue de la carte:', e);
        }
      }
    }

  }, [chambres, onMarkerClick]);

  return (
    <div className="relative">
      <div 
        ref={mapContainerRef} 
        style={{ height: hauteur, width: '100%' }} 
        className="rounded-lg border border-gray-200 z-0"
      />
      
      {/* Légende */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 z-[1000]">
        <div className="text-sm font-medium text-gray-900 mb-2">Légende</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">Chambres disponibles</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Aucune chambre disponible</span>
          </div>
        </div>
      </div>
      
      {/* Indicateur du nombre de logements */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-gray-200 z-[1000]">
        <div className="text-sm font-medium text-gray-900">
          {chambres.length} logement{chambres.length > 1 ? 's' : ''} sur la carte
        </div>
      </div>
    </div>
  );
}