import { useEffect, useState } from 'react';
import { Transaction, CropData } from '@/types/Index';
import GetFarmImg from '@/utils/GetFarmImg';
import Profile from '@/components/MyPage/Profile';
import CropList from '@/components/MyPage/CropList';
import TransactionTable from '@/components/MyPage/TransactionTable';
import EditNicknameModal from '@/components/MyPage/EditNicknameModal';
import Pagination from '@/components/MyPage/Pagination';
import { ITEMS_PER_PAGE } from '@/constants/TransactionContants';
import { useUser } from '@/components/public/UserContext';
import { getOrderHistory } from '@/services/OrderApi';
import { getCrops } from '@/services/MarketApi';

const padTransactionsToPageSize = (transactions: Transaction[]): Transaction[] => {
  const padCount = ITEMS_PER_PAGE - (transactions.length % ITEMS_PER_PAGE);
  return padCount === ITEMS_PER_PAGE
    ? transactions
    : [
        ...transactions,
        ...Array(padCount).fill({
          orderId: 0,
          cropId: 0,
          orderType: '',
          price: 0,
          totalPrice: 0,
          createdAt: '',
          amount: 0
        })
      ];
};

const MyPage: React.FC = () => {
  const { nickname, availableCash, totalAssets, totalCash, currentValue } = useUser();
  const [isModal, setIsModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transactions, getTransactions] = useState<Transaction[]>([]);
  const [crops, setCrops] = useState<CropData[]>([]);
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  const modalOpen = () => setIsModal(prev => !prev);

  useEffect(() => {
    const fetchCrops = async () => {
      const response = await getCrops();
      if (response.success && response.crops) {
        setCrops(
          response.crops.map(e => ({
            cropId: e.cropId,
            cropName: e.cropName.toLowerCase()
          }))
        );
      } else {
        setCrops([]);
      }
    };

    const fetchHistory = async () => {
      const response = await getOrderHistory();
      if (response.success && response.history) {
        getTransactions(response.history);
      } else {
        getTransactions([]);
      }
    };

    fetchCrops();
    fetchHistory();
  }, []);

  useEffect(() => {
    const paddedTransactions = padTransactionsToPageSize(transactions);
    const totalPages = Math.ceil(paddedTransactions.length / ITEMS_PER_PAGE);
    setTotalPages(totalPages);

    const currentTransactions = paddedTransactions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    setDisplayedTransactions(currentTransactions);
  }, [transactions, currentPage]);

  return (
    <main className="flex flex-col justify-start items-center min-h-screen select-none gap-4 pt-28">
      <div className="flex flex-row z-[10] gap-24">
        <Profile id={nickname} modalOpen={modalOpen} />
        <div
          className="flex justify-center items-center bg-no-repeat bg-contain bg-center w-[300px] h-[280px]"
          style={{ backgroundImage: `url(${GetFarmImg(totalAssets)})` }}
        />
      </div>

      <div className="flex flex-row gap-4 z-[10]">
        <div className="flex flex-row items-center bg-light-beige border-4 border-light-pink rounded-2xl p-8 gap-8">
          <div className="flex flex-col gap-8 px-4 text-center">
            <div>
              {/** totalcash + 현재 가치 */}
              <p className="text-xl font-bold">전체 자산</p>
              <p className="text-lg">￦ {totalAssets.toLocaleString()}</p>
            </div>
            <div>
              {/** 현재 가치 */}
              <p className="text-xl font-bold">작물 현재 가치</p>
              <p className="text-lg">￦ {currentValue.toLocaleString()}</p>
            </div>
            <div>
              {/** totalcash */}
              <p className="text-xl font-bold">현금 자산</p>
              <p className="text-lg">￦ {totalCash.toLocaleString()}</p>
              {/** availableCash */}
              <p className="text-xs">(가용 현금 ￦{availableCash.toLocaleString()})</p>
            </div>
          </div>
          <CropList />
        </div>

        <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-4 min-h-[304px]">
          <h2 className="text-lg font-semibold mb-2">거래 기록</h2>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center text-center rounded-2xl p-8 h-full w-[350px]">
              <p className="flex text-center items-center text-black text-lg font-bold h-full">
                거래 기록이 존재하지 않습니다.
              </p>
            </div>
          ) : (
            <>
              <TransactionTable displayedTransactions={displayedTransactions} crops={crops} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      {isModal && <EditNicknameModal isOpen={isModal} modalOpen={modalOpen} />}
    </main>
  );
};

export default MyPage;
