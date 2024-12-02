interface AskingPriceProps {
  validCropName: string;
  marketData: {
    buyOrders: { price: number; quantity: number }[];
    sellOrders: { price: number; quantity: number }[];
    nowPrice: number;
  };
}

const AskingPrice: React.FC<AskingPriceProps> = ({ validCropName, marketData }) => {
  if (!validCropName) {
    return <div>작물 정보가 없습니다.</div>;
  }

  return (
    <div className="w-full h-full md:text-xs lg:text-xs xl:text-sm">
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-1 font-semibold bg-gray-800 px-1">
        <div className="text-center">구분</div>
        <div className="text-center">가격</div>
        <div className="text-center">수량</div>
      </div>
      <div className="md:h-24 lg:h-26 xl:h-28 overflow-y-auto scrollbar-hidden">
        {marketData.sellOrders.map((order, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_1fr_1fr] gap-1 py-1 px-1 items-center">
            <div className="text-center">팔아요</div>
            <div className="text-center">￦ {order.price}</div>
            <div className="font-bold text-center text-red-500">{order.quantity}</div>
          </div>
        ))}
        {marketData.buyOrders.map((order, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_1fr_1fr] gap-1 py-1 px-1 items-center">
            <div className="text-center">살게요</div>
            <div className="text-center">￦ {order.price}</div>
            <div className="font-bold text-center text-blue-600">{order.quantity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AskingPrice;
