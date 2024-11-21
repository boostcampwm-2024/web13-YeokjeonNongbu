const pendingData = [
  { crop: '당근', time: '2024-11-20T09:00:00', price: 3000, quantity: 5 },
  { crop: '사과', time: '2024-11-20T09:05:00', price: 4500, quantity: 3 },
  { crop: '수박', time: '2024-11-20T09:10:00', price: 15000, quantity: 2 },
  { crop: '포도', time: '2024-11-20T09:15:00', price: 8000, quantity: 4 },
  { crop: '버섯', time: '2024-11-20T09:20:00', price: 4000, quantity: 10 },
  { crop: '당근', time: '2024-11-20T09:30:00', price: 2800, quantity: 7 },
  { crop: '사과', time: '2024-11-20T09:35:00', price: 4600, quantity: 6 },
  { crop: '수박', time: '2024-11-20T09:40:00', price: 16000, quantity: 1 },
  { crop: '포도', time: '2024-11-20T09:45:00', price: 8500, quantity: 3 },
  { crop: '버섯', time: '2024-11-20T09:50:00', price: 4200, quantity: 8 },
  { crop: '버섯', time: '2024-11-20T09:50:00', price: 4200, quantity: 8 },
  { crop: '버섯', time: '2024-11-20T09:50:00', price: 4200, quantity: 8 },
  { crop: '버섯', time: '2024-11-20T09:50:00', price: 4200, quantity: 8 },
  { crop: '버섯', time: '2024-11-20T09:50:00', price: 4200, quantity: 8 }
];
const Pending: React.FC = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');

    return `${year}/${month}/${day} ${hour}:${minute}`;
  };

  return (
    <div className="mt-2 text-xs">
      <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr_auto] gap-1 font-semibold bg-gray-800 py-1 px-1">
        <div className="text-center">작물명</div>
        <div className="text-center">주문시간</div>
        <div className="text-center">수량</div>
        <div className="text-center">가격</div>
        <div className="text-center">취소</div>
      </div>

      <div className="max-h-48 overflow-y-auto">
        {pendingData.map((pending, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.2fr_2fr_1fr_1fr_auto] border-b border-gray-400 items-center"
          >
            <div className="text-center">{pending.crop}</div>
            <div className="text-center">{formatDate(pending.time)}</div>
            <div className="text-center">{pending.quantity}</div>
            <div className="text-center">{pending.price.toLocaleString()}</div>
            <div className="text-center">
              <button className="px-1 bg-green-500 text-white rounded text-[9px]">취소</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pending;
