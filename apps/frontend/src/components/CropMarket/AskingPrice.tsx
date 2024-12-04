import { useEffect, useRef } from 'react';

interface AskingPriceProps {
  validCropName: string;
  marketData: {
    buyOrders: { price: number; quantity: number }[];
    sellOrders: { price: number; quantity: number }[];
    nowPrice: number;
  };
}

const AskingPrice: React.FC<AskingPriceProps> = ({ validCropName, marketData }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop =
        containerRef.current.scrollHeight / 2 - containerRef.current.clientHeight / 2;
    }
  }, [marketData.sellOrders, marketData.buyOrders]);

  if (!validCropName) {
    return <div>작물 정보가 없습니다.</div>;
  }

  const maxItems = 4;
  const emptyOrder = { price: 0, quantity: 0 };

  const sellOrdersToDisplay = [
    ...new Array(Math.max(0, maxItems - marketData.sellOrders.length)).fill(emptyOrder),
    ...marketData.sellOrders
      .sort((a, b) => a.price - b.price)
      .slice(0, maxItems)
      .reverse()
  ];

  const buyOrdersToDisplay = [
    ...marketData.buyOrders.sort((a, b) => b.price - a.price).slice(0, maxItems),
    ...new Array(Math.max(0, maxItems - marketData.buyOrders.length)).fill(emptyOrder)
  ];

  return (
    <div className="w-full h-full md:text-xs lg:text-xs xl:text-sm flex flex-col">
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-1 font-semibold px-1">
        <div className="text-center">구분</div>
        <div className="text-center">가격</div>
        <div className="text-center">수량</div>
      </div>
      <div ref={containerRef} className="md:h-24 lg:h-26 xl:h-28 overflow-y-auto scrollbar-hidden">
        {sellOrdersToDisplay.map((order, idx) => (
          <div
            key={idx}
            className={`relative grid grid-cols-[1fr_1fr_1fr] gap-1 py-1 px-1 items-center ${
              order.price === marketData.nowPrice && order.price !== 0 ? 'border border-black' : ''
            }`}
          >
            {order.price === marketData.nowPrice && order.price !== 0 && (
              <div className="absolute top-1/2 transform -translate-y-1/2 scale-x-[-1] w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-black"></div>
            )}
            <div className="text-center">{order.price > 0 ? '팔아요' : '\u00A0'}</div>
            <div className="text-center">
              {order.price > 0 ? `￦ ${order.price.toLocaleString()}` : '\u00A0'}
            </div>
            <div className="font-bold text-center text-blue-600">
              {order.quantity > 0 ? order.quantity.toLocaleString() : '\u00A0'}
            </div>
          </div>
        ))}
        {(marketData.sellOrders.length > 0 || marketData.buyOrders.length > 0) && (
          <hr className="bg-black h-[1px] border-none" />
        )}
        {buyOrdersToDisplay.map((order, idx) => (
          <div
            key={idx}
            className={`relative grid grid-cols-[1fr_1fr_1fr] gap-1 py-1 px-1 items-center ${
              order.price === marketData.nowPrice && order.price !== 0 ? 'border border-black' : ''
            }`}
          >
            {order.price === marketData.nowPrice && order.price !== 0 && (
              <div className="absolute top-1/2 transform -translate-y-1/2 scale-x-[-1] w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-black"></div>
            )}
            <div className="text-center">{order.price > 0 ? '살게요' : '\u00A0'}</div>
            <div className="text-center">
              {order.price > 0 ? `￦ ${order.price.toLocaleString()}` : '\u00A0'}
            </div>
            <div className="font-bold text-center text-red-500">
              {order.quantity > 0 ? order.quantity.toLocaleString() : '\u00A0'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AskingPrice;
