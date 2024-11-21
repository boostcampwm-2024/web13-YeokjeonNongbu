const cropPrices: Record<string, [string, string, number][]> = {
  당근: [
    ['팔아요', '₩23,200', 40],
    ['팔아요', '₩21,200', 50],
    ['팔아요', '₩20,800', 78],
    ['팔아요', '₩20,400', 126],
    ['살게요', '₩20,100', 487],
    ['살게요', '₩19,700', 598],
    ['살게요', '₩15,700', 698],
    ['살게요', '₩14,700', 708]
  ],
  사과: [
    ['팔아요', '₩31,200', 40],
    ['팔아요', '₩30,800', 70],
    ['살게요', '₩30,500', 150],
    ['살게요', '₩30,000', 500]
  ],
  수박: [
    ['팔아요', '₩11,000', 20],
    ['팔아요', '₩10,800', 30],
    ['살게요', '₩10,500', 60]
  ],
  포도: [
    ['팔아요', '₩25,000', 45],
    ['살게요', '₩24,800', 120]
  ],
  버섯: [
    ['팔아요', '₩18,000', 60],
    ['살게요', '₩17,500', 200]
  ]
};

interface AskingPriceProps {
  crop: string;
}

const AskingPrice: React.FC<AskingPriceProps> = ({ crop }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-1 font-semibold bg-gray-800 py-1 px-1">
        <div className="text-center">구분</div>
        <div className="text-center">가격</div>
        <div className="text-center">수량</div>
      </div>
      <div className="max-h-32 overflow-y-auto">
        {cropPrices[crop].map(([type, price, qty], idx) => (
          <div key={idx} className="grid grid-cols-[1fr_1fr_1fr] gap-1 py-1 px-1 items-center">
            <div className="text-center">{type}</div>
            <div className="text-center">{price}</div>
            <div
              className={`font-bold text-center ${
                type === '팔아요' ? 'text-red-500' : 'text-blue-600'
              }`}
            >
              {qty}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AskingPrice;
