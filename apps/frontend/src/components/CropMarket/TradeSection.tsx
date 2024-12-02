import { useState } from 'react';
import Trade from '@/components/CropMarket/Trade';
import Pending from '@/components/CropMarket/Pending';
import { CropData } from '@/types/Crop';

interface TradeProps {
  currentCrop: number;
  cropNameList: CropData[];
}

const TradeSection: React.FC<TradeProps> = ({ currentCrop, cropNameList }) => {
  const [tradeType, setTradeType] = useState<string>('매수');
  const [orderType, setOrderType] = useState<string>('지정가');

  const changeTrade = (type: string) => {
    setTradeType(type);
    setOrderType('지정가');
  };

  return (
    <section className="flex flex-col bg-board2 bg-no-repeat bg-contain border-none h-auto sm:h-[450px] w-full sm:w-[360px]">
      <div className="h-full w-full pt-28 px-14 pb-14">
        <div className="flex justify-between">
          {['매수', '매도', '대기'].map(type => (
            <button
              key={type}
              onClick={() => changeTrade(type)}
              className={`flex-1 p-2 rounded-lg border border-gray font-bold text-sm ${
                tradeType === type
                  ? type === '매수'
                    ? 'text-white bg-red-500'
                    : type === '매도'
                      ? 'text-white bg-blue-600'
                      : 'text-white bg-green-500'
                  : 'bg-bg-color'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        {tradeType !== '대기' ? (
          <Trade
            trade={tradeType}
            order={orderType}
            setOrderType={setOrderType}
            currentCrop={currentCrop}
            cropNameList={cropNameList}
          />
        ) : (
          <Pending cropNameList={cropNameList} />
        )}
      </div>
    </section>
  );
};

export default TradeSection;
