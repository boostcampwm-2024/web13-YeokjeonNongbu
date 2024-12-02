import { CropListData } from '@/types/Index';
import { cropList } from '@/constants/CropConstants';
import { useEffect, useState } from 'react';
import { getOwnCrops } from '@/services/AccountApi';

const CropList: React.FC = () => {
  const [ownCrops, setOwnCrops] = useState<CropListData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwnCrops = async () => {
      try {
        const response = await getOwnCrops();
        if (response.success && response.ownCrops) {
          setOwnCrops(response.ownCrops);
          setError(null);
        } else {
          setError(response.message);
        }
      } catch {
        setError('서버와의 연결에 실패했습니다.');
      }
    };

    fetchOwnCrops();
  }, []);

  return (
    <div className="mt-3 text-center">
      <p className="text-xl font-bold">보유 작물</p>
      {error ? (
        <div className="flex flex-col items-center text-center rounded-2xl p-4 h-full">
          <p className="flex text-center items-center text-black text-lg font-bold h-full">
            {error}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 mt-3 text-center">
          {ownCrops.map((crop, index) => {
            const cropName = crop.cropName.toLowerCase();

            return (
              <div key={index} className="flex flex-row items-center gap-3">
                <p>{cropList[cropName]}</p>
                <img src={`/${cropName}.png`} alt={crop.cropName} className="w-8 h-8" />
                <p>x {crop.quantity}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CropList;
