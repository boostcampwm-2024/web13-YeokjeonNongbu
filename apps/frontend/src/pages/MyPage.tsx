import { useState } from 'react';
import { Transaction, ApiCrop, Crop } from '@/types/Index';
import GetFarmImg from '@/utils/GetFarmImg';
import Profile from '@/components/Profile';
import CropList from '@/components/CropList';
import TransactionTable from '@/components/TransactionTable';
import Pagination from '@/components/Pagination';
import EditNicknameModal from '@/components/EditNicknameModal';
import { ITEMS_PER_PAGE } from '@/constants/TransactionContants';

const cropImages: Record<string, string> = {
  당근: '/carrot.png',
  수박: '/watermelon.png',
  사과: '/apple.png',
  포도: '/grape.png',
  버섯: '/mushroom.png'
};

const apiCrops: ApiCrop[] = [
  { name: '당근', quantity: 5 },
  { name: '수박', quantity: 3 },
  { name: '사과', quantity: 8 },
  { name: '포도', quantity: 6 },
  { name: '버섯', quantity: 10 }
];

const crops: Crop[] = apiCrops.map(({ name, quantity }) => ({
  name,
  quantity,
  image: cropImages[name]
}));

const emergencyFund = 500000;

const transactions: Transaction[] = [
  {
    date: '24.11.07 16:41:00',
    item: '사과',
    type: '매수',
    quantity: 10,
    pricePerUnit: '1,000원',
    totalPrice: '10,000원'
  },
  {
    date: '24.11.07 16:41:00',
    item: '사과',
    type: '매도',
    quantity: 10,
    pricePerUnit: '1,000원',
    totalPrice: '10,000원'
  },
  {
    date: '24.11.07 16:41:00',
    item: '포도',
    type: '매수',
    quantity: 15,
    pricePerUnit: '500원',
    totalPrice: '7,500원'
  },
  {
    date: '24.11.07 16:41:00',
    item: '버섯',
    type: '매도',
    quantity: 5,
    pricePerUnit: '2,000원',
    totalPrice: '10,000원'
  },
  {
    date: '24.11.07 16:41:00',
    item: '당근',
    type: '매수',
    quantity: 20,
    pricePerUnit: '300원',
    totalPrice: '6,000원'
  },
  {
    date: '24.11.07 16:41:00',
    item: '수박',
    type: '매도',
    quantity: 2,
    pricePerUnit: '5,000원',
    totalPrice: '10,000원'
  },
  {
    date: '24.11.07 16:41:00',
    item: '사과',
    type: '매수',
    quantity: 10,
    pricePerUnit: '1,000원',
    totalPrice: '10,000원'
  }
];

const padTransactionsToPageSize = (transactions: Transaction[]): Transaction[] => {
  const padCount = ITEMS_PER_PAGE - (transactions.length % ITEMS_PER_PAGE);
  return padCount === ITEMS_PER_PAGE
    ? transactions
    : [
        ...transactions,
        ...Array(padCount).fill({
          date: '',
          item: '',
          type: '',
          quantity: 0,
          pricePerUnit: '',
          totalPrice: ''
        })
      ];
};

const MyPage: React.FC = () => {
  const amount = 100000000;
  const [id, setId] = useState<string>('농부왕');
  const [isModal, setIsModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const paddedTransactions = padTransactionsToPageSize(transactions);
  const totalPages = Math.ceil(paddedTransactions.length / ITEMS_PER_PAGE);
  const displayedTransactions = paddedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const modalOpen = () => setIsModal(prev => !prev);

  return (
    <main className="flex flex-col justify-start items-center min-h-screen select-none gap-4 pt-28">
      <div className="flex flex-row z-[10] gap-24">
        <Profile id={id} modalOpen={modalOpen} />
        <div
          className="flex justify-center items-center bg-no-repeat bg-contain bg-center w-[300px] h-[280px]"
          style={{ backgroundImage: `url(${GetFarmImg(amount)})` }}
        />
      </div>

      <div className="flex flex-row gap-4 z-[10]">
        <div className="flex flex-row items-center bg-light-beige border-4 border-light-pink rounded-2xl p-6 gap-6">
          <div className="text-center">
            <p className="text-xl font-bold">전체 자산</p>
            <p className="text-xl font-bold">￦ 932,517,456</p>
          </div>
          <CropList crops={crops} emergencyFund={emergencyFund} />
        </div>

        <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-4 min-h-[304px]">
          <h2 className="text-lg font-semibold mb-2">거래 기록</h2>
          <TransactionTable displayedTransactions={displayedTransactions} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {isModal && (
        <EditNicknameModal isOpen={isModal} id={id} setId={setId} modalOpen={modalOpen} />
      )}
    </main>
  );
};

export default MyPage;
