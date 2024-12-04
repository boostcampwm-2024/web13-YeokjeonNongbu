import { cropList } from '@/constants/CropConstants';
import { getPendingOrder, postCancelOrder } from '@/services/OrderApi';
import { CropData } from '@/types/Crop';
import { PendingData } from '@/types/Order';
import { useContext, useEffect, useState } from 'react';
import { AlertContext } from '../public/AlertContext';

interface PendingProps {
  cropNameList: CropData[];
}

interface MergedPendingData extends PendingData {
  cropName: string;
}

const Pending: React.FC<PendingProps> = ({ cropNameList }) => {
  const { alert } = useContext(AlertContext);
  const [pendingData, setPendingData] = useState<MergedPendingData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await getPendingOrder();
        if (response.success) {
          const pending: PendingData[] = response.pending;
          const mergedData = pending.map(pending => {
            const cropInfo = cropNameList.find(crop => crop.cropId === pending.cropId);
            return {
              ...pending,
              cropName: cropInfo?.cropName || 'Unknown Crop'
            };
          });
          setPendingData(mergedData);
        } else {
          setError(response.message || '서버와의 연결에 실패했습니다.');
        }
      } catch {
        setError('서버와의 연결에 실패했습니다.');
      }
    };

    fetchPending();
  }, []);

  const handleCancel = async (e: React.MouseEvent<HTMLButtonElement>, order: MergedPendingData) => {
    e.currentTarget.blur();

    try {
      const data = {
        cropId: order.cropId,
        orderType: order.orderType,
        tradingType: order.tradingType,
        orderId: order.orderId
      };

      const response = await postCancelOrder(data);

      if (response.success || response.pending) {
        const pending: PendingData[] = response.pending;
        const mergedData = pending.map(pending => {
          const cropInfo = cropNameList.find(crop => crop.cropId === pending.cropId);
          return {
            ...pending,
            cropName: cropInfo?.cropName || 'Unknown Crop'
          };
        });
        setPendingData(mergedData);
        await alert(response.message);
      } else {
        setError(response.message || '서버와의 연결에 실패했습니다.');
      }
    } catch {
      setError('서버와의 연결에 실패했습니다.');
    }
  };

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
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-[1.2fr_2fr_1fr_1fr_auto] gap-1 font-semibold py-1 px-1">
            <div className="text-center">작물명</div>
            <div className="text-center">주문시간</div>
            <div className="text-center">수량</div>
            <div className="text-center">가격</div>
            <div className="text-center px-2" />
          </div>

          <div className="max-h-48 overflow-y-auto scrollbar-hidden">
            {pendingData.map((pending, index) => (
              <div
                key={index}
                className="grid grid-cols-[1.2fr_2fr_1fr_1fr_auto] border-b border-gray-400 items-center"
              >
                <div className="text-center">{cropList[pending.cropName]}</div>
                <div className="text-center">{formatDate(pending.time)}</div>
                <div className="text-center">{pending.unfilledQuantity.toLocaleString()}</div>
                <div className="text-center">{pending.price.toLocaleString()}</div>
                <div className="text-center">
                  <button
                    className={`px-1 rounded text-[9px] ${
                      pending.orderType === 'buy' ? 'bg-red-500' : 'bg-blue-500'
                    } text-white`}
                    onClick={e => handleCancel(e, pending)}
                  >
                    취소
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Pending;
