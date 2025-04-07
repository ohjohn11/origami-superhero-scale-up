
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Wallet } from "lucide-react";
import { useTelegram } from '@/context/TelegramProvider';
import { toast } from 'sonner';
import { connectWallet, isWalletConnected, processPayment } from '@/services/tonService';

interface PaymentButtonsProps {
  price: number;
  modelSize: number;
  onPaymentSuccess: (exhibitUrl: string) => void;
}

const PaymentButtons: React.FC<PaymentButtonsProps> = ({ price, modelSize, onPaymentSuccess }) => {
  const { user, referralCode } = useTelegram();
  
  const handleTonPayment = async () => {
    try {
      if (!user) {
        toast.error("User information not available");
        return;
      }
      
      // Check if wallet is connected
      if (!isWalletConnected()) {
        toast("Connecting wallet...");
        const { success } = await connectWallet();
        if (!success) {
          toast.error("Failed to connect wallet");
          return;
        }
        toast.success("Wallet connected");
      }
      
      // Process the payment
      toast("Processing payment...");
      const result = await processPayment({
        amount: price,
        referralCode: referralCode || undefined,
        modelSize,
        userId: user.id
      });
      
      if (result.success && result.exhibitUrl) {
        toast.success("Payment successful!");
        onPaymentSuccess(result.exhibitUrl);
      } else {
        toast.error(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred during payment");
    }
  };
  
  const handleApplePay = () => {
    toast.info("Apple Pay is not available in this preview. Please use TON payment.");
  };
  
  const handleGooglePay = () => {
    toast.info("Google Pay is not available in this preview. Please use TON payment.");
  };
  
  return (
    <div className="space-y-4">
      <Button 
        onClick={handleTonPayment}
        className="w-full bg-ton hover:bg-ton-dark text-white"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Pay with TON
      </Button>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={handleApplePay}
          variant="outline"
          className="bg-hero-secondary text-hero-foreground border-hero-accent/30"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Apple Pay
        </Button>
        
        <Button 
          onClick={handleGooglePay}
          variant="outline"
          className="bg-hero-secondary text-hero-foreground border-hero-accent/30"
        >
          <Smartphone className="mr-2 h-4 w-4" />
          Android Pay
        </Button>
      </div>
    </div>
  );
};

export default PaymentButtons;
