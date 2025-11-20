'use client';
import { STEPS } from '@/app/config';
import { usePoloStore } from '@/app/store';

export default function PricePanel() {
  const BASE_PRICE = 1999.00; // Base watch price
  
  const { config } = usePoloStore();
  
  const TYPE_OPTIONS = STEPS.find(step => step.title === 'Type')?.children || [];
  const MATERIAL_OPTIONS = STEPS.find(step => step.title === 'Materials')?.children || [];
  const COLOR_OPTIONS = STEPS.find(step => step.title === 'Color')?.children || [];
  const STRAP_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Strap') as any || {};
  const INTERNAL_DISPLAY_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Internal_Display') as any || {};
  const WATCH_BASE_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Watch_Base') as any || {};
  
  // Calculate total price based on all selections
  const calculateTotalPrice = () => {
    // let total = BASE_PRICE;
    
    // // Add Type price
    // const typePrice = (TYPE_OPTIONS[typeOption] as any)?.price || 0;
    // total += typePrice;
    
    // // Add Material price
    // const materialPrice = (MATERIAL_OPTIONS[materialOption] as any)?.price || 0;
    // total += materialPrice;
    
    // // Add Color prices
    // const strapPrice = STRAP_OPTIONS.color?.[strapTexture]?.price || 0;
    // const internalDisplayPrice = INTERNAL_DISPLAY_OPTIONS.color?.[internalDisplayTexture]?.price || 0;
    // const watchBasePrice = WATCH_BASE_OPTIONS.color?.[watchBaseTexture]?.price || 0;
    
    // total += strapPrice + internalDisplayPrice + watchBasePrice;
    
    // return {
    //   base: BASE_PRICE,
    //   type: typePrice,
    //   material: materialPrice,
    //   strap: strapPrice,
    //   internalDisplay: internalDisplayPrice,
    //   watchBase: watchBasePrice,
    //   subtotal: total,
    //   vat: total * 0.21,
    //   total: total * 1.21
    // };
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
            {/* <span className="font-medium">{formatPriceNL(prices.base)}</span> */}
          </div>
          
          {/* Type Price */}
          <div className="flex justify-between items-center pl-4">
            <span className="text-black/80">Type: {(TYPE_OPTIONS[config.bodytype] as any)?.title}</span>
            <span className={ "text-black/60"}>
              {/* {prices.type > 0 ? `${formatPriceNL(prices.type)}` : formatPriceNL(0)} */}
            </span>
          </div>
          
          {/* Material Price */}
          <div className="flex justify-between items-center pl-4">
            <span className="text-black/80">Material: {(MATERIAL_OPTIONS[config.bodymaterial] as any)?.title}</span>
            <span className={ "text-black/60"}>
              {/* {prices.material > 0 ? `${formatPriceNL(prices.material)}` : formatPriceNL(0)} */}
            </span>
          </div>
          
          {/* Color Prices */}
          <div className="flex justify-between items-center pl-4">
            <span className="text-black/80">Kleuren:</span>
            <span className={ "text-black/60"}>
              {/* {prices.color > 0 ? `${formatPriceNL(prices.color)}` : formatPriceNL(0)} */}
            </span>
          </div>
          
          {/* Subtotal */}
          <div className="border-t border-black/20 pt-2 mt-2">
            <div className="flex justify-between items-center font-semibold">
              <span className="">Subtotal (excl. BTW)</span>
              {/* <span className="text-lg">{formatPriceNL(prices.subtotal)}</span> */}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
