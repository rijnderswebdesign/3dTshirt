'use client';
import { buttonColors, buttonMaterials, clothColors, clothMaterials, STEPS } from '@/app/config';
import { usePoloStore } from '@/app/store';

export default function PricePanel() {
  const BASE_PRICE = 79.00; // Base shirt price
  
  const { config } = usePoloStore();
  
  const filterebuttonByMaterial = buttonColors.filter((color: any, index: number) => index === config.buttoncolor);
  const bodyTypePrice = STEPS[0].children[0].find((child: any, index: number) => index === config.bodytype)?.price || 0;
  const collarTypePrice = STEPS[0].children[1].find((child: any, index: number) => index === config.collartype)?.price || 0;
  const buttonTypePrice =filterebuttonByMaterial.find((child: any, index: number) => index === config.buttonstype)?.price || 0;
  const sleeveTypePrice = STEPS[0].children[3].find((child: any, index: number) => index === config.sleevetype)?.price || 0;
  const bodyMaterialPrice = clothMaterials.find((child: any, index: number) => index === config.bodymaterial)?.price || 0;
  const collarMaterialPrice = clothMaterials.find((child: any, index: number) => index === config.collarmaterial)?.price || 0;
  const buttonMaterialPrice = buttonMaterials.find((child: any, index: number) => index === config.buttonmaterial)?.price || 0;
  const sleeveMaterialPrice = clothMaterials.find((child: any, index: number) => index === config.slevematerial)?.price || 0;
  const bodyColorPrice = clothColors.find((child: any, index: number) => index === config.bodycolor)?.price || 0;
  const collarColorPrice = clothColors.find((child: any, index: number) => index === config.collarcolor)?.price || 0;
  const buttonColorPrice = filterebuttonByMaterial.find((child: any, index: number) => index === config.buttoncolor)?.price || 0;
  const sleeveColorPrice = clothColors.find((child: any, index: number) => index === config.sleevecolor)?.price || 0;
console.log(bodyTypePrice, collarTypePrice, buttonTypePrice, sleeveTypePrice, bodyMaterialPrice, collarMaterialPrice, buttonMaterialPrice, sleeveMaterialPrice, bodyColorPrice, collarColorPrice, buttonColorPrice, sleeveColorPrice);
  // Calculate total price based on all selections
  const calculateTotalPrice = () => {
    let total = BASE_PRICE;
    
    // Add Type price
    const typePrice = bodyTypePrice + collarTypePrice + buttonTypePrice + sleeveTypePrice;
    total += typePrice;
    
    // Add Material price
    const materialPrice = bodyMaterialPrice + collarMaterialPrice + buttonMaterialPrice + sleeveMaterialPrice;
    total += materialPrice;

    const colorPrice = bodyColorPrice + collarColorPrice + buttonColorPrice + sleeveColorPrice;
    total += colorPrice;
    
    return {
      base: BASE_PRICE,
      type: typePrice,
      material: materialPrice,
      color: colorPrice,
      subtotal: total,
      vat: total * 0.21,
      total: total * 1.21
    };
  };
  
  const prices = calculateTotalPrice();
  
  // Format price with Dutch (NL) locale
  const formatPriceNL = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  return (
    <div className=" rounded-2xl lg:p-6 p-4 bg-white h-fit lg:space-y-4 space-y-2">
      <div>
        <h3 className="lg:text-2xl text-xl font-semibold mb-4">Prijs</h3>
        
        {/* Base Price */}
        <div className="space-y-2 text-sm lg:text-base">
          <div className="flex justify-between items-center">
            <span className="text-black/90">Basis prijs</span>
            <span className="font-medium">{formatPriceNL(prices.base)}</span>
          </div>
          
          {/* Type Price */}
          <div className="flex justify-between items-center pl-4">
            <span className="text-black/80">Type</span>
            <span className={ "text-black/60"}>
              {prices.type > 0 ? `${formatPriceNL(prices.type)}` : formatPriceNL(0)}
            </span>
          </div>
          
          {/* Material Price */}
          <div className="flex justify-between items-center pl-4">
            <span className="text-black/80">Materiaal</span>
            <span className={ "text-black/60"}>
              {prices.material > 0 ? `${formatPriceNL(prices.material)}` : formatPriceNL(0)}
            </span>
          </div>
          
          {/* Color Prices */}
          <div className="flex justify-between items-center pl-4">
            <span className="text-black/80">Kleuren:</span>
            <span className={ "text-black/60"}>
              {prices.color > 0 ? `${formatPriceNL(prices.color)}` : formatPriceNL(0)}
            </span>
          </div>
          
          {/* Subtotal */}
          <div className="border-t border-black/20 pt-2 mt-2">
            <div className="flex justify-between items-center font-semibold">
              <span className="">Subtotal (excl. BTW)</span>
              <span className="text-lg">{formatPriceNL(prices.subtotal)}</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
