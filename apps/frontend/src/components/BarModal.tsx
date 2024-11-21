import { Link } from 'react-router-dom';

interface barProps {
  isOpen: boolean;
  closeModal: () => void;
}

const BarModal: React.FC<barProps> = ({ isOpen, closeModal }) => {
  if (!isOpen) return;

  return (
    <div className="fixed top-12 right-4 mt-12 mr-6 z-50">
      <div className="flex flex-col items-center justify-center bg-light-beige border-4 border-light-pink rounded-2xl p-4 mx-4 shadow-lg">
        <Link
          to="/MyPage"
          onClick={closeModal}
          className="text-lg font-bold text-light-gray text-shadow mb-2"
        >
          마이페이지
        </Link>
        <Link to="/" onClick={closeModal} className="text-lg font-bold text-light-gray text-shadow">
          로그아웃
        </Link>
      </div>
    </div>
  );
};

export default BarModal;
