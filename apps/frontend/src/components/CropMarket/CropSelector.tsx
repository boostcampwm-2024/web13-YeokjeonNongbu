import { CropData } from '@/types/Crop';
import { cropList } from '@/constants/CropConstants';

interface CropSelectorProps {
  currentCrop: number;
  onSelect: (crop: number) => void;
  activeInterval: string;
  handleIntervalChange: (interval: string) => void;
  crops: CropData[];
}

const CropSelector: React.FC<CropSelectorProps> = ({
  currentCrop,
  onSelect,
  activeInterval,
  handleIntervalChange,
  crops
}) => {
  return (
    <div className="w-full flex flex-row flex-wrap md:gap-1 lg:gap-4 xl:gap-8 2xl:gap-10">
      {crops.map(crop => (
        <button
          key={crop.cropId}
          onClick={() => onSelect(crop.cropId)}
          className={`flex items-center gap-2 px-2 border-b-4 ${
            crop.cropId === currentCrop
              ? 'border-orange-500'
              : 'border-transparent hover:border-orange-500'
          }`}
        >
          <span
            className={`md:text-xs lg:text-sm text-sm font-medium ${crop.cropId === currentCrop ? 'text-orange-500' : ''}`}
          >
            {cropList[crop.cropName]}
          </span>
          <img src={`/${crop.cropName}.png`} alt={crop.cropName} className="w-8 h-8" />
        </button>
      ))}
      <div className="ml-auto">
        <select
          className="p-2 rounded border-2 border-gray"
          id="interval-select"
          value={activeInterval}
          onChange={e => handleIntervalChange(e.target.value)}
        >
          <option value="1min">1분</option>
          <option value="1hour">1시간</option>
        </select>
      </div>
    </div>
  );
};

export default CropSelector;
