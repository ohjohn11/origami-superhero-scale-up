
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceSliderProps {
  value: number;
  onChange: (value: number) => void;
  onPriceChange: (price: number) => void;
}

const PriceSlider: React.FC<PriceSliderProps> = ({ value, onChange, onPriceChange }) => {
  // Price is $2 per meter
  const price = value * 2;

  const handleSliderChange = (newValue: number[]) => {
    onChange(newValue[0]);
  };

  const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPrice = parseFloat(e.target.value);
    
    if (!isNaN(inputPrice) && inputPrice >= 2 && inputPrice <= 200) {
      // Convert price to size (meters)
      const newSize = Math.round(inputPrice / 2);
      onChange(newSize);
      onPriceChange(inputPrice);
    }
  };

  return (
    <div className="space-y-4" style={{ backgroundColor: "#DACC3E", padding: "16px", borderRadius: "8px" }}>
      <div className="flex flex-col space-y-1.5">
        <div className="flex justify-between">
          <Label htmlFor="size-slider">Size</Label>
          <span className="text-[#7FB7BE] font-semibold">{value} meters</span>
        </div>
        <Slider 
          id="size-slider"
          min={2} 
          max={100} 
          step={1} 
          value={[value]} 
          onValueChange={handleSliderChange}
          className="my-4 slider-custom"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>2m</span>
          <span>50m</span>
          <span>100m</span>
        </div>
      </div>
      
      <div className="flex flex-col space-y-1.5">
        <Label htmlFor="price-input">Price (USD)</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
          <Input 
            id="price-input"
            type="number" 
            value={price} 
            onChange={handlePriceInput}
            min={4}
            max={200}
            step={2}
            className="pl-8 input-custom"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceSlider;
