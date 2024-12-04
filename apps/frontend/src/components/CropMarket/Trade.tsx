import { CropData, OwnCropData } from '@/types/Crop';
import { useUser } from '../public/UserContext';
import { useContext, useEffect, useState } from 'react';
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
  ownCrop: OwnCropData[];
}

const Trade: React.FC<TradeProps> = ({
  trade,
  order,
  currentCrop,
  cropNameList,
  setOrderType,
  ownCrop
}) => {
  const { alert } = useContext(AlertContext);
  const [price, setPrice] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const { availableCash, fetch } = useUser();

  useEffect(() => {
    setQuantity(0);
    setPrice(0);
    setTotalAmount(0);
  }, [trade, order]);

  useEffect(() => {
    if (order === '시장가') {
      if (trade === '매수') {
        setIsButtonDisabled(totalAmount === 0);
      } else {
        setIsButtonDisabled(quantity === 0);
      }
    } else {
      setIsButtonDisabled(price === 0 || quantity === 0);
    }
  }, [price, quantity, totalAmount, order, trade]);

  const handleOrderType = (type: string) => {
    setOrderType(type);
  };

  const handleIncrease = () => {
    setPrice(prevPrice => prevPrice + 100);
  };

  const handleDecrease = () => {
    setPrice(prevPrice => (prevPrice - 100 >= 0 ? prevPrice - 100 : 0));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(e.target.value.replace(/[^0-9]/g, '')));
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value.replace(/[^0-9]/g, '')));
  };

  const handleMaxQuantity = () => {
    if (trade === '매수') {
      if (price > 0) {
        setQuantity(Math.floor(availableCash / price));
      }
    } else {
      const maxOwnCrop = ownCrop.find(o => o.cropId === currentCrop);
      setQuantity(maxOwnCrop?.availableQuantity || 0);
    }
  };

  const handleTotalAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalAmount(Number(e.target.value.replace(/[^0-9]/g, '')));
  };

  const handleMaxTotalAmount = () => {
    setTotalAmount(availableCash);
  };

  const handleOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur();

    const crop = cropNameList.find(crop => crop.cropId === currentCrop);
    if (!crop) {
      console.error('Crop not found');
      return;
    }

    const cropId: number = crop.cropId;
    const tradingType = trade === '매수' ? 'buy' : 'sell';
    const orderType = order === '지정가' ? 'limit' : 'market';

    const isMarketOrder = orderType === 'market';
    const isBuyOrder = tradingType === 'buy';

    if (isMarketOrder) {
      if (isBuyOrder && totalAmount === 0) {
        await alert('주문 총액을 입력해주세요.');
        return;
      }
      if (!isBuyOrder && quantity === 0) {
        await alert('주문 수량을 입력해주세요.');
        return;
      }
    } else {
      if (quantity === 0 || price === 0) {
        await alert('가격과 주문 수량을 모두 입력해주세요.');
        return;
      }
    }

    const orderData = {
      cropId,
      orderType: tradingType,
      tradingType: orderType,
      ...(isMarketOrder ? (isBuyOrder ? { totalAmount } : { quantity }) : { quantity, price })
    };

    const fetchMethod = isMarketOrder
      ? isBuyOrder
        ? postMarketBuyOrder
        : postMarketSellOrder
      : isBuyOrder
        ? postLimitBuyOrder
        : postLimitSellOrder;

    try {
      const response = await fetchMethod(orderData);
      await alert(response.message);
      fetch();
    } catch (error) {
      console.error(error);
    }
  };

  const displayValue =
    trade === '매수'
      ? availableCash.toLocaleString()
      : ownCrop.find(o => o.cropId === currentCrop)?.availableQuantity;

  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <span className="font-semibold text-sm">주문 유형</span>
        <div className="flex gap-1">
          {['지정가', '시장가'].map(type => (
            <button
              key={type}
              onClick={() => handleOrderType(type)}
              className={`px-2 py-1 rounded-md text-xs ${order === type && 'bg-light-pink'}`}
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
                onChange={handlePriceChange}
                className="w-24 text-center border rounded-md text-sm px-2 py-1"
              />

              <button className="px-2 py-1 text-center rounded-md text-xs" onClick={handleDecrease}>
                -
              </button>
              <button className="px-2 py-1 text-center rounded-md text-xs" onClick={handleIncrease}>
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
                onChange={handleQuantityChange}
                placeholder="0"
                className="w-24 px-1 py-1 border rounded text-xs text-center"
              />
              <button
                className="px-2 py-1 rounded-md font-semibold text-xs"
                onClick={handleMaxQuantity}
              >
                최대
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">주문 가능</span>
            <span className="font-semibold text-sm">{displayValue}</span>
          </div>
          <button
            className={`w-full py-2 mt-10 rounded-md font-semibold text-sm ${isButtonDisabled ? 'opacity-85 cursor-not-allowed' : ''} ${trade === '매수' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
            onClick={handleOrder}
            disabled={isButtonDisabled}
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
                onChange={trade === '매수' ? handleTotalAmountChange : handleQuantityChange}
                placeholder="0"
                className="w-24 px-1 py-1 border rounded text-xs text-center"
              />
              <button
                className="px-2 py-1 rounded-md font-semibold text-xs"
                onClick={trade === '매수' ? handleMaxTotalAmount : handleMaxQuantity}
              >
                최대
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-8">
            <span className="font-semibold text-sm">주문 가능</span>
            <span className="font-semibold text-sm">{displayValue}</span>
          </div>
          <button
            className={`w-full py-2 mt-10 rounded-md font-semibold text-sm ${isButtonDisabled ? 'opacity-85 cursor-not-allowed' : ''} ${trade === '매수' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
            onClick={handleOrder}
            disabled={isButtonDisabled}
          >
            {trade}
          </button>
        </>
      )}
    </>
  );
};

export default Trade;
