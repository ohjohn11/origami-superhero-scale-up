
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getExhibitById, validateExhibitAccess } from '@/services/exhibitService';
import { Button } from '@/components/ui/button';
import { Share2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

// Same exhibit list as in ModelViewer
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

const Exhibit: React.FC = () => {
  const location = useLocation();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [exhibitId, setExhibitId] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const scaleParam = params.get('scale');
    const userParam = params.get('user');
    const modelIndex = params.get('model');
    
    if (id) setExhibitId(id);
    if (scaleParam) setScale(parseFloat(scaleParam));
    if (userParam) setUserId(parseInt(userParam, 10));
    if (modelIndex) setCurrentModelIndex(parseInt(modelIndex, 10));
    
    // Validate exhibit access (for demo, we're allowing all access)
    if (id && userParam) {
      // In production, we'd check if this user has purchased this exhibit
      const validAccess = validateExhibitAccess(id, parseInt(userParam, 10));
      setIsValid(validAccess);
    } else {
      // For demo, allow access
      setIsValid(true);
    }
  }, [location]);

  const handlePrevModel = () => {
    setCurrentModelIndex((prevIndex) => (prevIndex - 1 + exhibits.length) % exhibits.length);
  };

  const handleNextModel = () => {
    setCurrentModelIndex((prevIndex) => (prevIndex + 1) % exhibits.length);
  };
  
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Superhero Origami Exhibit',
          text: 'Check out my Superhero Origami exhibit!',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Exhibit link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  const handleOpenInTelegram = () => {
    window.location.href = 'https://t.me/chekpo11nt_bot';
  };
  
  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex justify-center">
          <div className="h-8 w-8 bg-hero-accent rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (isValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You don't have access to this exhibit.</p>
          <Button onClick={handleOpenInTelegram}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Open in Telegram
          </Button>
        </div>
      </div>
    );
  }

  const currentModel = exhibits[currentModelIndex];
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-hero p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Superhero Origami</h1>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
        </Button>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div id="card" className="w-full">
            <div className="relative" style={{ backgroundColor: "#D3F3EE", borderRadius: "8px", overflow: "hidden" }}>
              <model-viewer
                id="dexpoModel"
                src={currentModel.glb}
                ios-src={currentModel.usdz}
                poster={currentModel.poster}
                shadow-intensity="1"
                camera-controls
                auto-rotate
                ar
                scale={`${scale/20} ${scale/20} ${scale/20}`}
                style={{ width: '100%', height: '70vh' }}
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
            
            <div className="mt-4 bg-hero-secondary rounded-lg p-4 flex flex-col items-center">
              <div className="mb-4 text-center">
                <h2 className="text-lg font-semibold">Your {scale}m Superhero Origami</h2>
                <p className="text-sm text-muted-foreground">View in AR or share with friends</p>
              </div>
              
              <Button 
                className="w-full bg-hero-accent hover:bg-hero-accent/80"
                onClick={() => {
                  const modelViewer = document.getElementById("dexpoModel");
                  if (modelViewer && 'activateAR' in modelViewer) {
                    try {
                      // @ts-ignore
                      if (modelViewer.canActivateAR) {
                        // @ts-ignore
                        modelViewer.activateAR();
                      } else {
                        toast.error("AR not supported on this device");
                      }
                    } catch (error) {
                      console.error("Error activating AR", error);
                      toast.error("Failed to activate AR");
                    }
                  }
                }}
              >
                Activate AR Mode
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-hero p-4 text-center">
        <Button 
          variant="outline" 
          onClick={handleOpenInTelegram}
          className="bg-hero-secondary border-hero-accent/30"
        >
          Open in Telegram
        </Button>
      </footer>
    </div>
  );
};

export default Exhibit;
