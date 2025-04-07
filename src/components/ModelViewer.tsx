
import React, { useEffect, useRef } from 'react';

interface ModelViewerProps {
  modelSize: number;
  modelUrl?: string;
  iosModelUrl?: string;
  posterUrl?: string;
  arEnabled?: boolean;
  autoRotate?: boolean;
  onARActivated?: () => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          'ios-src'?: string;
          poster?: string;
          'shadow-intensity'?: string;
          'camera-controls'?: boolean;
          'auto-rotate'?: boolean;
          ar?: boolean;
          scale?: string;
          'environment-image'?: string;
          exposure?: string;
        },
        HTMLElement
      >;
    }
  }
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelSize,
  modelUrl = "https://storage.googleapis.com/superhero-origami/batman_ben_aflleck.glb",
  iosModelUrl = "https://storage.googleapis.com/superhero-origami/Batman_Ben_Aflleck.usdz",
  posterUrl = "https://storage.googleapis.com/superhero-origami/batman_poster.webp",
  arEnabled = true,
  autoRotate = true,
  onARActivated
}) => {
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Ensure model-viewer script is loaded
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const activateARMode = () => {
      if (modelViewerRef.current && 'activateAR' in modelViewerRef.current) {
        try {
          // @ts-ignore
          if (modelViewerRef.current.canActivateAR) {
            // @ts-ignore
            modelViewerRef.current.activateAR();
            if (onARActivated) onARActivated();
          } else {
            console.log("AR not supported on this device");
          }
        } catch (error) {
          console.error("Error activating AR", error);
        }
      }
    };

    // Add event listener to the model viewer
    const modelViewer = modelViewerRef.current;
    if (modelViewer) {
      modelViewer.addEventListener('ar-status', (event) => {
        console.log('AR Status:', event);
      });
    }
  }, [onARActivated]);

  return (
    <div className="relative rounded-lg overflow-hidden bg-hero-secondary">
      <model-viewer
        ref={modelViewerRef as any}
        src={modelUrl}
        ios-src={iosModelUrl}
        poster={posterUrl}
        shadow-intensity="1"
        camera-controls={true}
        auto-rotate={autoRotate}
        ar={arEnabled}
        environment-image="neutral"
        exposure="0.5"
        scale={`${modelSize} ${modelSize} ${modelSize}`}
      />
      {/* Removed the size digits display that was here */}
    </div>
  );
};

export default ModelViewer;
