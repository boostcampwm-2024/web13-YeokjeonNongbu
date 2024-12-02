import { cropList } from '@/constants/CropConstants';
import { CropData, Transaction } from '@/types/Index';

interface TransactionTableProps {
  displayedTransactions: Transaction[];
  crops: CropData[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ displayedTransactions, crops }) => {
  return (
    <table className="w-full text-xs border-collapse min-h-[194px]">
      <thead>
        <tr className="bg-light-pink text-center">
          <th className="p-2 border-b-2 border-gray">시간</th>
          <th className="p-2 border-b-2 border-gray">작물명</th>
          <th className="p-2 border-b-2 border-gray">거래유형</th>
          <th className="p-2 border-b-2 border-gray">수량</th>
          <th className="p-2 border-b-2 border-gray">거래 가격</th>
          <th className="p-2 border-b-2 border-gray">거래 총액</th>
        </tr>
      </thead>
      <tbody>
        {displayedTransactions.map((transaction, index) => {
          const crop = crops.find(c => c.cropId === transaction.cropId);
          const cropName = crop ? crop.cropName : '\u00A0';

          const date = new Date(transaction.createdAt);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const seconds = String(date.getSeconds()).padStart(2, '0');

          const formattedDate = `${String(year).slice(2)}.${month}.${day} ${hours}-${minutes}-${seconds}`;

          return (
            <tr key={index} className="text-center odd:bg-white even:bg-light-beige">
              <td className="p-2">{transaction.createdAt ? formattedDate : '\u00A0'}</td>
              <td className="p-2">{cropList[cropName]}</td>
              <td className="p-2">
                {transaction.orderType === 'sell'
                  ? '매도'
                  : transaction.orderType === 'buy'
                    ? '매수'
                    : '\u00A0'}
              </td>
              <td className="p-2">{transaction.amount !== 0 ? transaction.amount : '\u00A0'}</td>
              <td className="p-2">
                {transaction.price !== 0 ? `${transaction.price.toLocaleString()} 원` : '\u00A0'}
              </td>
              <td className="p-2">
                {transaction.totalPrice !== 0
                  ? `${transaction.totalPrice.toLocaleString()} 원`
                  : '\u00A0'}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TransactionTable;
