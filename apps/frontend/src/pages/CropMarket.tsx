import { useState } from 'react';
import CropSelector from '@/components/CropSelector';
import AskingPrice from '@/components/AskingPrice';
import Chart from '@/components/Chart';
import TradeSection from '@/components/TradeSection';
import WoodBoard from '@/components/WoodBoard';
import OwnCrop from '@/components/OwnCrop';

const data1Min = [
  { x: '2024-11-20T09:00:00', y: 100 },
  { x: '2024-11-20T09:01:00', y: 102 },
  { x: '2024-11-20T09:02:00', y: 104 },
  { x: '2024-11-20T09:03:00', y: 106 },
  { x: '2024-11-20T09:04:00', y: 108 },
  { x: '2024-11-20T09:05:00', y: 110 }
];

const data1Hour = [
  { x: '2024-11-20T09:00:00', y: 100 },
  { x: '2024-11-20T10:00:00', y: 120 },
  { x: '2024-11-20T11:00:00', y: 140 }
];

const CropMarket: React.FC = () => {
  const [crop, setCrop] = useState<string>('당근');
  const [activeInterval, setActiveInterval] = useState<string>('1min');
  const [timeData, setTimeData] = useState(data1Min);

  const handleIntervalChange = (interval: string) => {
    setActiveInterval(interval);
    setTimeData(interval === '1min' ? data1Min : data1Hour);
  };

  return (
    <main className="flex flex-col lg:flex-row justify-center items-center min-h-screen select-none pt-16 gap-4">
      <div className="flex flex-col items-center z-[10] gap-4 w-full lg:w-[60%]">
        <div className="w-full flex flex-col justify-start gap-2">
          <CropSelector
            currentCrop={crop}
            onSelect={setCrop}
            activeInterval={activeInterval}
            handleIntervalChange={handleIntervalChange}
          />
          <hr className="w-full bg-black h-[1px]" />
        </div>
        <section className="w-full items-center bg-light-gray border-4 border-light-pink rounded-2xl p-4">
          <div className="h-56 flex justify-center items-center w-full">
            <Chart timeData={timeData} />
          </div>
        </section>
        <section className="w-full flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-8">
          <WoodBoard>
            <h3 className="flex justify-center text-xl font-bold mb-2">오늘의 {crop} 가격</h3>
            <AskingPrice crop={crop} />
          </WoodBoard>
          <WoodBoard>
            <h3 className="flex justify-center text-xl font-bold mb-2">보유 작물</h3>
            <OwnCrop />
          </WoodBoard>
        </section>
      </div>
      <div className="flex flex-col items-center z-[10]">
        <TradeSection />
      </div>
    </main>
  );
};

export default CropMarket;
