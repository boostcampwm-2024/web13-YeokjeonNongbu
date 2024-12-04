import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import CropSelector from '@/components/CropMarket/CropSelector';
import AskingPrice from '@/components/CropMarket/AskingPrice';
import Chart from '@/components/CropMarket/Chart';
import TradeSection from '@/components/CropMarket/TradeSection';
import WoodBoard from '@/components/CropMarket/WoodBoard';
import OwnCrop from '@/components/CropMarket/OwnCrop';
import { CropData, OwnCropData } from '@/types/Crop';
import { getCrops } from '@/services/MarketApi';
import { cropList } from '@/constants/CropConstants';
import Spinner from '@/assets/public/spin.gif';

const CropMarket: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [curCrop, setCurCrop] = useState<number>(1);
  const [cropNameList, setCropNameList] = useState<CropData[]>([]);
  const [ownCrop, setOwnCrop] = useState<OwnCropData[]>([]);
  const [nowPrice, setNowPrice] = useState([]);
  const [activeInterval, setActiveInterval] = useState<string>('1min');
  const [data1Min, setData1Min] = useState<{ x: string; y: number }[]>([]);
  const [data1Hour, setData1Hour] = useState<{ x: string; y: number }[]>([]);
  const [timeData, setTimeData] = useState<{ x: string; y: number }[]>([]);
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
        setCropNameList(
          response.crops.map(e => ({
            cropId: e.cropId,
            cropName: e.cropName.toLowerCase()
          }))
        );
      } else {
        setCropNameList([]);
      }
    };

    fetchCrops();
  }, []);

  useEffect(() => {
    const newSocket = io('https://yeokjeonnongbu.shop', {
      auth: {
        authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    newSocket.on('connect', () => {
      setLoading(false);
      setTimeout(() => {
        newSocket.emit('join', { cropId: curCrop });
      }, 50);
    });

    newSocket.on('market-update', data => {
      if (data && data.buyOrders && data.sellOrders) {
        setMarketData({
          buyOrders: data.buyOrders,
          sellOrders: data.sellOrders,
          nowPrice: data.nowPrice
        });
      }
    });

    newSocket.on('minChart', data => {
      setData1Min(data.cropMinData);
    });

    newSocket.on('hourChart', data => {
      setData1Hour(data.cropHourData);
    });

    newSocket.on('crops', data => {
      setOwnCrop(data);
    });

    newSocket.on('prices', data => {
      setNowPrice(data);
    });

    return () => {
      newSocket.off('market-update');
      newSocket.off('chart');
      newSocket.off('crops');
      newSocket.disconnect();
    };
  }, [curCrop]);

  useEffect(() => {
    setTimeData(activeInterval === '1min' ? data1Min : data1Hour);
  }, [activeInterval, data1Min, data1Hour]);

  const handleIntervalChange = (interval: string) => {
    setActiveInterval(interval);
  };

  const cropName = cropNameList.find(c => c.cropId === curCrop)?.cropName ?? '';
  const validCropName = cropName && cropList[cropName];

  return (
    <main className="flex flex-row justify-center items-center min-h-screen select-none pt-16 gap-4">
      {loading ? (
        <div className="flex justify-center items-center w-full h-full">
          <img src={Spinner} alt="로딩" width="10%" />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-start z-[10] gap-4 w-[60%] max-w-[1300px]">
            <div className="w-full flex flex-col justify-start gap-2">
              <CropSelector
                currentCrop={curCrop}
                onSelect={setCurCrop}
                activeInterval={activeInterval}
                handleIntervalChange={handleIntervalChange}
                cropNameList={cropNameList}
              />
              <hr className="w-full border-none bg-black h-[1px]" />
            </div>
            <section className="w-full items-center bg-light-gray border-4 border-light-pink rounded-2xl p-4">
              <div className="flex justify-center items-center w-full sm:h-36 md:h-36 lg:h-64 xl:h-64 2xl:h-72">
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
                <OwnCrop ownCrop={ownCrop} cropNameList={cropNameList} nowPrice={nowPrice} />
              </WoodBoard>
            </section>
          </div>
          <div className="flex flex-col items-center z-[10]">
            <TradeSection cropNameList={cropNameList} currentCrop={curCrop} ownCrop={ownCrop} />
            <img src="/icon.png" className="w-56 h-56" />
          </div>
        </>
      )}
    </main>
  );
};

export default CropMarket;
