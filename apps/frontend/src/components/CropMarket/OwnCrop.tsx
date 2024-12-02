import { cropList } from '@/constants/CropConstants';
import { CropData, NowPriceData, OwnCropData } from '@/types/Crop';

interface OwnCropProps {
  ownCrop: OwnCropData[];
  cropNameList: CropData[];
  nowPrice: NowPriceData[];
}

const OwnCrop: React.FC<OwnCropProps> = ({ ownCrop, cropNameList, nowPrice }) => {
  const ownCropMap = new Map(ownCrop.map(({ cropId, totalQuantity }) => [cropId, totalQuantity]));

  return (
    <>
      <table className="h-full w-full md:text-xs lg:text-xs xl:text-sm text-center">
        <thead>
          <tr>
            <th>작물명</th>
            <th>보유수량</th>
            <th>보유가액</th>
          </tr>
        </thead>
        <tbody className="md:h-24 lg:h-26 xl:h-28">
          {cropNameList
            .sort((a, b) => a.cropId - b.cropId)
            .map(({ cropId, cropName }) => {
              const cropDisplayName = cropList[cropName] || cropName;
              const totalQuantity = ownCropMap.get(cropId) ?? 0;
              const price = nowPrice.find(p => p.cropId === cropId)?.price || 0;

              return (
                <tr key={cropId}>
                  <td>{cropDisplayName}</td>
                  <td>{totalQuantity}</td>
                  <td>￦ {price * totalQuantity}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default OwnCrop;
