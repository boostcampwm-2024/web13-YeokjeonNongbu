import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CropSelector from '@/components/CropMarket/CropSelector';
import AskingPrice from '@/components/CropMarket/AskingPrice';
import Chart from '@/components/CropMarket/Chart';
import TradeSection from '@/components/CropMarket/TradeSection';
import WoodBoard from '@/components/CropMarket/WoodBoard';
import OwnCrop from '@/components/CropMarket/OwnCrop';
import { CropData } from '@/types/Crop';
import { getCrops } from '@/services/MarketApi';
import { cropList } from '@/constants/CropConstants';

const data1Hour = [
  { x: '2024-11-20T09:00:00', y: 100 },
  { x: '2024-11-20T10:00:00', y: 120 },
  { x: '2024-11-20T11:00:00', y: 140 }
];

const CropMarket: React.FC = () => {
  const [crop, setCrop] = useState<number>(1);
  const [activeInterval, setActiveInterval] = useState<string>('1min');
  const [data1Min, setData1Min] = useState<{ x: string; y: number }[]>([]);
  const [timeData, setTimeData] = useState<{ x: string; y: number }[]>([]);
  const [crops, setCrops] = useState<CropData[]>([]);
  const [marketData, setMarketData] = useState<{
    buyOrders: { price: number; quantity: number }[];
    sellOrders: { price: number; quantity: number }[];
    nowPrice: number;
  }>({
    buyOrders: [],
    sellOrders: [],
    nowPrice: 0
  });

  useEffect(() => {
    const fetchCrops = async () => {
      const response = await getCrops();
      if (response.success && response.crops) {
        setCrops(
          response.crops.map(e => ({
            cropId: e.cropId,
            cropName: e.cropName.toLowerCase()
          }))
        );
      } else {
        setCrops([]);
      }
    };

    fetchCrops();
  }, []);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BASE_URL);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      newSocket.emit('join', { cropId: crop });
    });

    newSocket.on('market-update', data => {
      console.log('Market updated:', data);
      if (data && data.buyOrders && data.sellOrders) {
        setMarketData({
          buyOrders: data.buyOrders,
          sellOrders: data.sellOrders,
          nowPrice: data.nowPrice
        });
      }
    });

    newSocket.on('chart', data => {
      // console.log('chart:', data);
      setData1Min(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [crop]);

  useEffect(() => {
    setTimeData(activeInterval === '1min' ? data1Min : data1Hour);
  }, [activeInterval, data1Min, data1Hour]);

  const handleIntervalChange = (interval: string) => {
    setActiveInterval(interval);
  };

  const cropName = crops.find(c => c.cropId === crop)?.cropName ?? '';
  const validCropName = cropName && cropList[cropName];

  return (
    <main className="flex flex-row justify-center items-center min-h-screen select-none pt-16 gap-4">
      <div className="flex flex-col items-start z-[10] gap-4 w-full lg:w-[60%] max-w-[1300px]">
        <div className="w-full flex flex-col justify-start gap-2">
          <CropSelector
            currentCrop={crop}
            onSelect={setCrop}
            activeInterval={activeInterval}
            handleIntervalChange={handleIntervalChange}
            crops={crops}
          />
          <hr className="w-full bg-black h-[1px]" />
        </div>
        <section className="w-full items-center bg-light-gray border-4 border-light-pink rounded-2xl p-4">
          <div className="h-56 flex justify-center items-center w-full sm:h-64 md:h-36 lg:h-64 xl:h-64 2xl:h-72">
            <Chart timeData={timeData} />
          </div>
        </section>
        <section className="w-[95%] flex flex-row justify-between items-start">
          <WoodBoard>
            <h3 className="flex justify-center lg:text-sm xl:text-base font-bold mb-2">
              오늘의 {validCropName} 가격
            </h3>
            <AskingPrice validCropName={validCropName} marketData={marketData} />
          </WoodBoard>
          <WoodBoard>
            <h3 className="flex justify-center lg:text-sm xl:text-base font-bold mb-2">
              보유 작물
            </h3>
            <OwnCrop />
          </WoodBoard>
        </section>
      </div>
      <div className="flex flex-col items-center z-[10]">
        <TradeSection crops={crops} currentCrop={crop} />
        <img src="/icon.png" className="w-56 h-56" />
      </div>
    </main>
  );
};

export default CropMarket;
