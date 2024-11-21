const cropImages: Record<string, string> = {
  당근: '/carrot.png',
  수박: '/watermelon.png',
  사과: '/apple.png',
  포도: '/grape.png',
  버섯: '/mushroom.png'
};

const crops: string[] = ['당근', '사과', '수박', '포도', '버섯'];

interface CropSelectorProps {
  currentCrop: string;
  onSelect: (crop: string) => void;
  activeInterval: string;
  handleIntervalChange: (interval: string) => void;
}

const CropSelector: React.FC<CropSelectorProps> = ({
  currentCrop,
  onSelect,
  activeInterval,
  handleIntervalChange
}) => {
  return (
    <div className="w-full flex flex-row flex-wrap gap-4 sm:gap-8">
      {crops.map(crop => (
        <button
          key={crop}
          onClick={() => onSelect(crop)}
          className={`flex items-center gap-2 px-2 border-b-4 ${
            crop === currentCrop
              ? 'border-orange-500'
              : 'border-transparent hover:border-orange-500'
          }`}
        >
          <span className={`text-sm font-medium ${crop === currentCrop ? 'text-orange-500' : ''}`}>
            {crop}
          </span>
          <img src={`${cropImages[crop]}`} alt={crop} className="w-8 h-8" />
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
