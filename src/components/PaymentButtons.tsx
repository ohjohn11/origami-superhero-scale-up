
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
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
  const [isRegistered, setIsRegistered] = useState(false);
  
  const handleStartButton = async () => {
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
        setIsRegistered(true);
      } else {
        setIsRegistered(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration");
    }
  };
  
  const handleTonPayment = async () => {
    try {
      if (!user) {
        toast.error("User information not available");
        return;
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
  
  return (
    <div className="space-y-4">
      {!isRegistered ? (
        <Button 
          onClick={handleStartButton}
          className="w-full bg-[#7FB7BE] hover:bg-[#7FB7BE]/80 text-white"
        >
          Start
        </Button>
      ) : (
        <Button 
          onClick={handleTonPayment}
          className="w-full bg-ton hover:bg-ton-dark text-white"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Pay with TON
        </Button>
      )}
    </div>
  );
};

export default PaymentButtons;
