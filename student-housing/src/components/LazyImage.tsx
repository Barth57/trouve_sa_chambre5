import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  placeholderClassName?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number; // Pour l'intersection observer
}

export function LazyImage({
  src,
  alt,
  fallbackSrc = '/placeholder-image.jpg',
  className,
  placeholderClassName,
  loadingComponent,
  errorComponent,
  onLoad,
  onError,
  threshold = 0.1,
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer pour détecter quand l'image entre dans le viewport
  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [threshold]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const defaultLoadingComponent = (
    <div 
      className={cn(
        "flex items-center justify-center bg-gray-200 animate-pulse",
        placeholderClassName,
        className
      )}
    >
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const defaultErrorComponent = (
    <div 
      className={cn(
        "flex items-center justify-center bg-gray-100 text-gray-500",
        placeholderClassName,
        className
      )}
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  );

  if (!isInView) {
    return (
      <div 
        ref={imgRef}
        className={cn(
          "flex items-center justify-center bg-gray-100",
          placeholderClassName,
          className
        )}
      >
        {loadingComponent || defaultLoadingComponent}
      </div>
    );
  }

  if (hasError) {
    return errorComponent || defaultErrorComponent;
  }

  return (
    <div className="relative">
      {isLoading && (loadingComponent || defaultLoadingComponent)}
      <img
        {...props}
        src={isInView ? src : undefined}
        alt={alt}
        className={cn(
          className,
          isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy" // Native lazy loading comme fallback
      />
    </div>
  );
}

// Hook personnalisé pour précharger les images
export function useImagePreloader(imageSrcs: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImage = (src: string) => {
      return new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
        img.src = src;
      });
    };

    const preloadImages = async () => {
      for (const src of imageSrcs) {
        try {
          await preloadImage(src);
          setLoadedImages(prev => new Set(prev).add(src));
        } catch (errorSrc) {
          setErrorImages(prev => new Set(prev).add(errorSrc as string));
        }
      }
    };

    if (imageSrcs.length > 0) {
      preloadImages();
    }
  }, [imageSrcs]);

  return {
    loadedImages,
    errorImages,
    isLoaded: (src: string) => loadedImages.has(src),
    hasError: (src: string) => errorImages.has(src),
  };
}