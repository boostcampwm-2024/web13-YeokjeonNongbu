import { CropData } from '@/types/Crop';
import { useUser } from '../public/UserContext';
import { useContext, useState } from 'react';
import { AlertContext } from '@/components/public/AlertContext';
import {
  postLimitBuyOrder,
  postLimitSellOrder,
  postMarketBuyOrder,
  postMarketSellOrder
} from '@/services/OrderApi';

interface TradeProps {
  trade: string;
  order: string;
  currentCrop: number;
  cropNameList: CropData[];
  setOrderType: (order: string) => void;
}

const Trade: React.FC<TradeProps> = ({ trade, order, currentCrop, cropNameList, setOrderType }) => {
  const { alert } = useContext(AlertContext);
  const [price, setPrice] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const { availableCash } = useUser();

  const onlyNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  };

  const handleOrderType = (type: string) => {
    setOrderType(type);
    setQuantity(0);
    setPrice(0);
    setTotalAmount(0);
  };

  const handleIncrease = () => {
    setPrice(prevPrice => prevPrice + 1000);
  };

  const handleDecrease = () => {
    setPrice(prevPrice => (prevPrice - 1000 >= 0 ? prevPrice - 1000 : 0));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleMaxQuantity = () => {
    if (order === '지정가') {
      if (price > 0) {
        setQuantity(Math.floor(availableCash / price));
      }
    } else {
      // 현재 보유 작물 수
      // TODO - 웹 소켓 연결 후 추가하기
    }
  };

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalAmount(Number(e.target.value));
  };

  const handleMaxTotalAmount = () => {
    setTotalAmount(Number(availableCash));
  };

  const handleOrder = async () => {
    const crop = cropNameList.find(crop => crop.cropId === currentCrop);

    if (!crop) {
      console.error('Crop not found');
      return;
    }

    const cropId: number = crop?.cropId;
    const tradingType: string = trade === '매수' ? 'buy' : 'sell';
    const orderType: string = order === '지정가' ? 'limit' : 'market';

    let orderData;
    let fetchMethod;

    if (orderType === 'market') {
      if (tradingType === 'buy') {
        orderData = {
          cropId,
          orderType: tradingType,
          tradingType: 'market',
          totalAmount
        };
        fetchMethod = postMarketBuyOrder;
      } else {
        orderData = {
          cropId,
          orderType: tradingType,
          tradingType: 'market',
          quantity
        };
        fetchMethod = postMarketSellOrder;
      }
    } else if (orderType === 'limit') {
      orderData = {
        cropId,
        orderType: tradingType,
        tradingType: 'limit',
        quantity,
        price
      };
      fetchMethod = tradingType === 'buy' ? postLimitBuyOrder : postLimitSellOrder;
    }

    if (!orderData || !fetchMethod) {
      console.error('Order data or fetch method is undefined');
      return;
    }

    try {
      const response = await fetchMethod(orderData);
      await alert(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <span className="font-semibold text-sm">주문 유형</span>
        <div className="flex gap-1">
          {['지정가', '시장가'].map(type => (
            <button
              key={type}
              onClick={() => handleOrderType(type)}
              className={`px-2 py-1 rounded-md text-xs ${
                order === type ? 'bg-light-pink' : 'bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {order === '지정가' && (
        <>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">{trade} 가격</span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={price}
                onKeyUp={e => {
                  onlyNumber(e);
                }}
                onChange={handlePriceChange}
                className="w-24 text-center border rounded-md text-sm px-2 py-1"
              />

              <button
                className="px-2 py-1 text-center bg-gray-200 rounded-md text-xs"
                onClick={handleDecrease}
              >
                -
              </button>
              <button
                className="px-2 py-1 text-center bg-gray-200 rounded-md text-xs"
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">주문 수량</span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={quantity}
                onKeyUp={e => {
                  onlyNumber(e);
                }}
                onChange={handleQuantityChange}
                placeholder="0"
                className="w-24 px-1 py-1 border border-gray rounded text-xs text-center"
              />
              <button
                className="px-2 py-1 bg-gray-200 rounded-md font-semibold text-xs"
                onClick={handleMaxQuantity}
              >
                최대
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">주문 가능</span>
            <span className="font-semibold text-sm">{availableCash.toLocaleString()} 원</span>
          </div>
          <button
            className={`w-full py-2 mt-10 text-white rounded-md font-semibold text-sm ${
              trade === '매수' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            onClick={handleOrder}
          >
            {trade}
          </button>
        </>
      )}

      {order === '시장가' && (
        <>
          <div className="flex items-center justify-between mt-8">
            <span className="font-semibold text-sm">
              {trade === '매수' ? '주문 총액' : '주문 수량'}
            </span>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={trade === '매수' ? totalAmount : quantity}
                onKeyUp={e => {
                  onlyNumber(e);
                }}
                onChange={trade === '매수' ? handleTotalAmountChange : handleQuantityChange}
                placeholder="0"
                className="w-24 px-1 py-1 border border-gray rounded text-xs text-center"
              />
              <button
                className="px-2 py-1 bg-gray-200 rounded-md font-semibold text-xs"
                onClick={trade === '매수' ? handleMaxTotalAmount : handleMaxQuantity}
              >
                최대
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-8">
            <span className="font-semibold text-sm">주문 가능</span>
            <span className="font-semibold text-sm">{availableCash.toLocaleString()} 원</span>
          </div>
          <button
            className={`w-full py-2 mt-12 text-white rounded-md font-semibold text-sm ${
              trade === '매수' ? 'bg-red-500' : 'bg-blue-600'
            }`}
            onClick={handleOrder}
          >
            {trade}
          </button>
        </>
      )}
    </>
  );
};

export default Trade;
