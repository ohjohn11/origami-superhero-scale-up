
import React, { useState } from 'react';
import ModelViewer from '@/components/ModelViewer';
import PriceSlider from '@/components/PriceSlider';
import PaymentButtons from '@/components/PaymentButtons';
import Leaderboard from '@/components/Leaderboard';
import ReferralButton from '@/components/ReferralButton';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useTelegram } from '@/context/TelegramProvider';

const Index: React.FC = () => {
  const { user, loadingWebApp, referralCode } = useTelegram();
  const [modelSize, setModelSize] = useState(1); // Default 1 meter
  const [price, setPrice] = useState(2); // Default $2
  const [exhibitUrl, setExhibitUrl] = useState<string | null>(null);
  
  const handleSizeChange = (newSize: number) => {
    setModelSize(newSize);
    setPrice(newSize * 2); // $2 per meter
  };
  
  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
  };
  
  const handlePaymentSuccess = (url: string) => {
    setExhibitUrl(url);
  };
  
  if (loadingWebApp) {
    return (
      <div className="telegram-app flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Loading Superhero Origami...</h1>
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-hero-accent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="telegram-app">
      <div className="flex flex-col space-y-6">
        <Card className="bg-hero border-hero-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-center">
              Superhero Origami
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <ModelViewer modelSize={modelSize / 20} /> {/* Scale for preview */}
            
            <div className="glass-panel p-4">
              <PriceSlider 
                value={modelSize}
                onChange={handleSizeChange}
                onPriceChange={handlePriceChange}
              />
            </div>
            
            <PaymentButtons
              price={price}
              modelSize={modelSize}
              onPaymentSuccess={handlePaymentSuccess}
            />
            
            {exhibitUrl && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-sm">
                <h3 className="font-semibold text-green-400 mb-1">Purchase Successful!</h3>
                <p className="mb-2">Your exhibit is ready to view:</p>
                <a 
                  href={exhibitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-hero-accent underline break-all"
                >
                  {exhibitUrl}
                </a>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex-col space-y-4">
            {referralCode && (
              <div className="w-full text-center text-sm text-muted-foreground">
                Referred by: {referralCode}
              </div>
            )}
            <ReferralButton />
          </CardFooter>
        </Card>
        
        <Separator className="bg-hero-accent/20" />
        
        <Leaderboard />
      </div>
    </div>
  );
};

export default Index;
