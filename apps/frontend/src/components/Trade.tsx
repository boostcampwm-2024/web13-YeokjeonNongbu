interface TradeProps {
  tradeType: string;
  orderType: string;
  setOrderType: (order: string) => void;
}

const Trade: React.FC<TradeProps> = ({ tradeType, orderType, setOrderType }) => {
  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <span className="font-semibold text-sm">주문 유형</span>
        <div className="flex gap-1">
          {['지정가', '시장가'].map(type => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-2 py-1 rounded-md text-xs ${
                orderType === type ? 'bg-light-pink' : 'bg-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {orderType === '지정가' && (
        <>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">{tradeType}가격</span>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm mr-1">190,000원</span>
              <button className="px-2 py-1 text-center bg-gray-200 rounded-md text-xs">-</button>
              <button className="px-2 py-1 text-center bg-gray-200 rounded-md text-xs">+</button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">수량</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="0"
                className="w-14 px-1 py-1 border border-gray rounded text-xs text-center"
              />
              <button className="px-2 py-1 bg-gray-200 rounded-md font-semibold text-xs">
                최대
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="font-semibold text-sm">잔액</span>
            <span className="font-semibold text-sm">23,400,000</span>
          </div>
          <button
            className={`w-full py-2 mt-10 text-white rounded-md font-semibold text-sm ${
              tradeType === '매수' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {tradeType}
          </button>
        </>
      )}

      {orderType === '시장가' && (
        <>
          <div className="flex items-center justify-between mt-8">
            <span className="font-semibold text-sm">주문총액</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                placeholder="0"
                className="w-14 px-1 py-1 border border-gray rounded text-xs text-center"
              />
              <button className="px-2 py-1 bg-gray-200 rounded-md font-semibold text-xs">
                최대
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mt-8">
            <span className="font-semibold text-sm">잔액</span>
            <span className="font-semibold text-sm">23,400,000</span>
          </div>
          <button
            className={`w-full py-2 mt-12 text-white rounded-md font-semibold text-sm ${
              tradeType === '매수' ? 'bg-red-500' : 'bg-blue-600'
            }`}
          >
            {tradeType}
          </button>
        </>
      )}
    </>
  );
};

export default Trade;
