import { useWatchStore } from '@/app/store';

interface RadioOption {
  id?: number;
  title: string;
}

interface RadioOptionsProps {
  className?: string;
  options: RadioOption[];
  name?: string;
}

export default function RadioOptions({ 
  className,
  options, 
  name = "option",
}: RadioOptionsProps) {
  // Get state from Zustand store
  const {
    activeSection,
    colorOption,
    materialOption,
    typeOption,
    setColorOption,
    setMaterialOption,
    setTypeOption,
  } = useWatchStore();
  
  const handleChange = (id: number) => {
    if(activeSection === 0){
      setTypeOption(id);  // Type is first step
    }else if(activeSection === 1){
      setMaterialOption(id);  // Materials is second step
    }else if(activeSection === 2){
      setColorOption(id);  // Color is third step
    }
  };

  // Get the current selected value based on active section
  const getCurrentSelectedValue = () => {
    if (activeSection === 0) return typeOption;
    else if (activeSection === 1) return materialOption;
    else if (activeSection === 2) return colorOption;
    return 0;
  };

  const selectedValue = getCurrentSelectedValue();

  return (
    <div className={`${className} flex flex-col lg:flex-row flex-wrap items-start lg:items-center justify-between gap-3 px-3 py-2 overflow-x-auto`}>
      {options.map((option, index) => {
        const isChecked = selectedValue === index;
        
        return (
          <label 
            key={`${name}-${index}`}
            className='flex items-center gap-2 cursor-pointer group'
          >
            <div className='relative flex items-center justify-center'>
              <input
                type="radio"
                name={name}
                value={index}
                className="peer appearance-none w-5 h-5 border-2 border-white/50 rounded-full cursor-pointer
                           transition-all duration-200 checked:border-white
                           group-hover:border-white/70"
                checked={isChecked}
                onChange={() => handleChange(index)}
                readOnly={false}
              />
              <div 
                className={`absolute w-2.5 h-2.5 bg-white rounded-full transition-opacity pointer-events-none ${
                  isChecked ? 'opacity-100' : 'opacity-0'
                }`}
              ></div>
            </div>
            <span className="text-sm text-white/80 group-hover:text-white transition-colors">
              {option.title}
            </span>
          </label>
        );
      })}
    </div>
  );
}

