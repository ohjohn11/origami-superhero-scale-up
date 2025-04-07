
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getExhibitById, validateExhibitAccess } from '@/services/exhibitService';
import { Button } from '@/components/ui/button';
import { Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Exhibit: React.FC = () => {
  const location = useLocation();
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [exhibitId, setExhibitId] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const scaleParam = params.get('scale');
    const userParam = params.get('user');
    
    if (id) setExhibitId(id);
    if (scaleParam) setScale(parseFloat(scaleParam));
    if (userParam) setUserId(parseInt(userParam, 10));
    
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
            <model-viewer
              id="dexpoModel"
              src="https://cdn.glitch.global/f2adc1d7-d66d-42c8-b62b-3ccc8d46dbbf/batman_ben_aflleck.glb"
              ios-src="https://cdn.glitch.global/f2adc1d7-d66d-42c8-b62b-3ccc8d46dbbf/Batman_Ben_Aflleck.usdz"
              poster="https://cdn.glitch.global/f083053f-1952-4730-aa71-941f172f95c4/Tatoo%20EXPO%20(69).png"
              shadow-intensity="1"
              camera-controls
              auto-rotate
              ar
              scale={`${scale/20} ${scale/20} ${scale/20}`}
              style={{ width: '100%', height: '70vh' }}
            />
            
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
