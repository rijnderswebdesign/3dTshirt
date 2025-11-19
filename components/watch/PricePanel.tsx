'use client';
import { STEPS } from '@/app/config';
import { useWatchStore } from '@/app/store';

export default function PricePanel() {
  const BASE_PRICE = 1999.00; // Base watch price
  
  const { typeOption, materialOption, colorOption, internalDisplayTexture, strapTexture, watchBaseTexture } = useWatchStore();
  
  const TYPE_OPTIONS = STEPS.find(step => step.title === 'Type')?.children || [];
  const MATERIAL_OPTIONS = STEPS.find(step => step.title === 'Materials')?.children || [];
  const COLOR_OPTIONS = STEPS.find(step => step.title === 'Color')?.children || [];
  const STRAP_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Strap') as any || {};
  const INTERNAL_DISPLAY_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Internal_Display') as any || {};
  const WATCH_BASE_OPTIONS = COLOR_OPTIONS.find((option: any) => option.meshName === 'Watch_Base') as any || {};
  
  // Calculate total price based on all selections
  const calculateTotalPrice = () => {
    let total = BASE_PRICE;
    
    // Add Type price
    const typePrice = (TYPE_OPTIONS[typeOption] as any)?.price || 0;
    total += typePrice;
    
    // Add Material price
    const materialPrice = (MATERIAL_OPTIONS[materialOption] as any)?.price || 0;
    total += materialPrice;
    
    // Add Color prices
    const strapPrice = STRAP_OPTIONS.color?.[strapTexture]?.price || 0;
    const internalDisplayPrice = INTERNAL_DISPLAY_OPTIONS.color?.[internalDisplayTexture]?.price || 0;
    const watchBasePrice = WATCH_BASE_OPTIONS.color?.[watchBaseTexture]?.price || 0;
    
    total += strapPrice + internalDisplayPrice + watchBasePrice;
    
    return {
      base: BASE_PRICE,
      type: typePrice,
      material: materialPrice,
      strap: strapPrice,
      internalDisplay: internalDisplayPrice,
      watchBase: watchBasePrice,
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
    <div className=" rounded-2xl lg:p-6 p-4 border border-white/50 lg:space-y-4 lg:m-6 space-y-2">
      <div>
        <h3 className="lg:text-2xl text-xl font-semibold mb-4">Prijs</h3>
        
        {/* Base Price */}
        <div className="space-y-2 text-sm lg:text-base">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Basis prijs</span>
            <span className="font-medium">{formatPriceNL(prices.base)}</span>
          </div>
          
          {/* Type Price */}
          <div className="flex justify-between items-center pl-4">
            <span className="text-white/80">Type: {(TYPE_OPTIONS[typeOption] as any)?.title}</span>
            <span className={ "text-white/60"}>
              {prices.type > 0 ? `${formatPriceNL(prices.type)}` : formatPriceNL(0)}
            </span>
          </div>
          
          {/* Material Price */}
          <div className="flex justify-between items-center pl-4">
            <span className="text-white/80">Material: {(MATERIAL_OPTIONS[materialOption] as any)?.title}</span>
            <span className={ "text-white/60"}>
              {prices.material > 0 ? `${formatPriceNL(prices.material)}` : formatPriceNL(0)}
            </span>
          </div>
          
          {/* Color Prices */}
          <div className="flex flex-col gap-1 pl-4">
            <span className="text-white/80">Kleuren:</span>
            
            <div className="flex justify-between items-center pl-4">
              <span className="text-white/70">Strap: {STRAP_OPTIONS.color?.[strapTexture]?.title}</span>
              <span className={"text-white/60 text-sm"}>
                {prices.strap > 0 ? `${formatPriceNL(prices.strap)}` : formatPriceNL(0)}
              </span>
            </div>
            
            <div className="flex justify-between items-center pl-4">
              <span className="text-white/70">Display: {INTERNAL_DISPLAY_OPTIONS.color?.[internalDisplayTexture]?.title}</span>
              <span className={"text-white/60 text-sm"}>
                {prices.internalDisplay > 0 ? `${formatPriceNL(prices.internalDisplay)}` : formatPriceNL(0)}
              </span>
            </div>
            
            <div className="flex justify-between items-center pl-4">
              <span className="text-white/70">Base: {WATCH_BASE_OPTIONS.color?.[watchBaseTexture]?.title}</span>
              <span className={"text-white/60 text-sm"}>
                {prices.watchBase > 0 ? `+ ${formatPriceNL(prices.watchBase)}` : formatPriceNL(0)}
              </span>
            </div>
          </div>
          
          {/* Subtotal */}
          <div className="border-t border-white/20 pt-2 mt-2">
            <div className="flex justify-between items-center font-semibold">
              <span className="">Subtotaal (excl. BTW)</span>
              <span className="text-lg">{formatPriceNL(prices.subtotal)}</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
