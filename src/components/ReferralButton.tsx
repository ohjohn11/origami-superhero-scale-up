
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useTelegram } from '@/context/TelegramProvider';
import { generateReferralLink } from '@/services/tonService';
import { toast } from 'sonner';

const ReferralButton: React.FC = () => {
  const { user } = useTelegram();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateReferral = async () => {
    try {
      if (!user) {
        toast.error("User information not available");
        return;
      }
      
      setIsGenerating(true);
      
      // Generate referral link
      const username = user.username || `user_${user.id}`;
      const referralLink = generateReferralLink(username);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(referralLink);
      
      toast.success("Referral link copied to clipboard!");
      
      console.log("Generated referral link:", referralLink);
    } catch (error) {
      console.error("Error generating referral:", error);
      toast.error("Failed to generate referral link");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <Button 
        onClick={handleGenerateReferral}
        variant="outline"
        className="w-full bg-hero-secondary border-hero-accent/30 glow-button"
        disabled={isGenerating || !user}
      >
        <Share2 className="mr-2 h-4 w-4" />
        {isGenerating ? "Generating..." : "Get your affiliate link!"}
      </Button>
      <p className="text-sm text-[#7FB7BE] font-medium">Earn your healthy 50%, partner.</p>
    </div>
  );
};

export default ReferralButton;
