
import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ModelViewerProps {
  modelSize: number;
  modelUrl?: string;
  iosModelUrl?: string;
  posterUrl?: string;
  arEnabled?: boolean;
  autoRotate?: boolean;
  onARActivated?: () => void;
  onModelChange?: (index: number) => void;
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

// List of exhibit models
const exhibits = [
  { 
    glb: "https://cdn.glitch.global/f2adc1d7-4524-4c86-81f6-c95eaeb58d8f/batman_ben_aflleck.glb?v=1731206200716", 
    usdz: "https://cdn.glitch.global/f2adc1d7-4524-4c86-81f6-c95eaeb58d8f/Batman_Ben_Aflleck.usdz?v=1731206206021",
    poster: "https://storage.googleapis.com/superhero-origami/batman_poster.webp"
  },
  { 
    glb: "https://cdn.glitch.global/d851d3f4-2f11-4557-9a63-ccc65f3bc731/wonder_woman_1984_-_full_cast%20(1).glb?v=1739057393725", 
    usdz: "https://cdn.glitch.global/d851d3f4-2f11-4557-9a63-ccc65f3bc731/Wonder_Woman_1984_-_Full_Cast.usdz?v=1739057379636",
    poster: "https://storage.googleapis.com/superhero-origami/batman_poster.webp"
  },
  { 
    glb: "https://cdn.glitch.me/6af3bed7-989a-443e-909c-b3b2aa7c350a/dceu_character_collage.glb?v=1739057897849", 
    usdz: "https://cdn.glitch.me/6af3bed7-989a-443e-909c-b3b2aa7c350a/DCEU_Character_Collage.usdz?v=1739057887497",
    poster: "https://storage.googleapis.com/superhero-origami/batman_poster.webp"
  },
  { 
    glb: "https://cdn.glitch.global/306880c6-2aec-477d-838f-55baa7c4057a/justice_league_2021.glb?v=1739055055092", 
    usdz: "https://cdn.glitch.global/306880c6-2aec-477d-838f-55baa7c4057a/Justice_League_2021.usdz?v=1739055051583",
    poster: "https://storage.googleapis.com/superhero-origami/batman_poster.webp"
  },
  { 
    glb: "https://cdn.glitch.global/b86d9c2c-a1cd-4f18-bd8d-7a95825947a8/wonder_woman_set_gal_gadot_lilly_aspell.glb?v=1739054867559", 
    usdz: "https://cdn.glitch.global/b86d9c2c-a1cd-4f18-bd8d-7a95825947a8/Wonder_Woman_Set_Gal_Gadot_Lilly_Aspell.usdz?v=1739054864480",
    poster: "https://storage.googleapis.com/superhero-origami/batman_poster.webp"
  },
  { 
    glb: "https://cdn.glitch.global/5e99c0a4-769a-4764-9208-e83d7991f89d/green_lantern_ryan_reynolds.glb?v=1739054609729", 
    usdz: "https://cdn.glitch.global/5e99c0a4-769a-4764-9208-e83d7991f89d/Green_Lantern_Ryan_Reynolds.usdz?v=1739054586015",
    poster: "https://storage.googleapis.com/superhero-origami/batman_poster.webp"
  },
  { 
    glb: "https://cdn.glitch.global/730c53b4-66d6-4bb9-8578-3dd34c259d44/man_of_steel_-_character_collage%20(1).glb?v=1739054371880", 
    usdz: "https://cdn.glitch.global/730c53b4-66d6-4bb9-8578-3dd34c259d44/Man_of_Steel_-_Character_Collage.usdz?v=1739054366533",
    poster: "https://storage.googleapis.com/superhero-origami/batman_poster.webp"
  },
  { 
    glb: "https://cdn.glitch.global/554acdbb-5995-4b57-b357-ddfe6ba883ce/zack_snyders_justice_league_full_cast%20(2).glb?v=1739054072716", 
    usdz: "https://cdn.glitch.global/554acdbb-5995-4b57-b357-ddfe6ba883ce/Zack_Snyders_Justice_League_Full_Cast%20(1).usdz",
    poster: "https://storage.googleapis.com/superhero-origami/batman_poster.webp"
  }
];

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelSize,
  arEnabled = true,
  autoRotate = true,
  onARActivated,
  onModelChange
}) => {
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const modelViewerRef = useRef<HTMLElement | null>(null);

  const currentModel = exhibits[currentModelIndex];

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

  const handlePrevModel = () => {
    const newIndex = (currentModelIndex - 1 + exhibits.length) % exhibits.length;
    setCurrentModelIndex(newIndex);
    if (onModelChange) onModelChange(newIndex);
  };

  const handleNextModel = () => {
    const newIndex = (currentModelIndex + 1) % exhibits.length;
    setCurrentModelIndex(newIndex);
    if (onModelChange) onModelChange(newIndex);
  };

  return (
    <div className="relative rounded-lg overflow-hidden" style={{ backgroundColor: "#D3F3EE" }}>
      <model-viewer
        ref={modelViewerRef as any}
        src={currentModel.glb}
        ios-src={currentModel.usdz}
        poster={currentModel.poster}
        shadow-intensity="1"
        camera-controls={true}
        auto-rotate={autoRotate}
        ar={arEnabled}
        environment-image="neutral"
        exposure="0.5"
        scale={`${modelSize} ${modelSize} ${modelSize}`}
      />
      
      <button 
        onClick={handlePrevModel}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-r-lg p-2 transition-colors"
        aria-label="Previous model"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button 
        onClick={handleNextModel}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white rounded-l-lg p-2 transition-colors"
        aria-label="Next model"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        {currentModelIndex + 1} / {exhibits.length}
      </div>
    </div>
  );
};

export default ModelViewer;
