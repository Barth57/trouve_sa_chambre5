import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X, Eye } from "lucide-react";

interface GaleriePhotosProps {
  photos: string[];
  titre: string;
  disponible?: boolean;
}

export default function GaleriePhotos({ photos, titre, disponible = true }: GaleriePhotosProps) {
  const [photoActiveIndex, setPhotoActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop"
          alt={titre}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={disponible ? "default" : "secondary"} className={disponible ? "bg-green-100 text-green-800" : ""}>
            {disponible ? "Disponible" : "Occupé"}
          </Badge>
        </div>
      </div>
    );
  }

  const photoSuivante = () => {
    setPhotoActiveIndex((prev) => (prev + 1) % photos.length);
  };

  const photoPrecedente = () => {
    setPhotoActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
        <img
          src={photos[0]}
          alt={titre}
          className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
        />
        
        {/* Badges et overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg" />
        
        <div className="absolute top-3 left-3">
          <Badge variant={disponible ? "default" : "secondary"} className={disponible ? "bg-green-100 text-green-800" : ""}>
            {disponible ? "Disponible" : "Occupé"}
          </Badge>
        </div>
        
        {photos.length > 1 && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="secondary" className="bg-black/60 text-white border-0">
              +{photos.length - 1} photos
            </Badge>
          </div>
        )}
        
        {/* Bouton voir plus visible au hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
            <Eye className="w-4 h-4 mr-2" />
            Voir toutes les photos
          </Button>
        </div>
      </div>

      {/* Dialog pour la galerie complète */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            {/* Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
              <div className="bg-black/60 rounded-lg px-3 py-2">
                <p className="text-white text-sm font-medium">{titre}</p>
                <p className="text-white/80 text-xs">
                  {photoActiveIndex + 1} / {photos.length}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="bg-black/60 text-white hover:bg-black/80"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Image principale */}
            <div className="relative aspect-video bg-black">
              <img
                src={photos[photoActiveIndex]}
                alt={`${titre} - Photo ${photoActiveIndex + 1}`}
                className="w-full h-full object-contain"
              />
              
              {/* Contrôles navigation */}
              {photos.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white hover:bg-black/80"
                    onClick={photoPrecedente}
                    disabled={photos.length <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white hover:bg-black/80"
                    onClick={photoSuivante}
                    disabled={photos.length <= 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Miniatures */}
            {photos.length > 1 && (
              <div className="p-4 bg-gray-50">
                <div className="flex gap-2 overflow-x-auto">
                  {photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setPhotoActiveIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === photoActiveIndex
                          ? "border-blue-500"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Miniature ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}