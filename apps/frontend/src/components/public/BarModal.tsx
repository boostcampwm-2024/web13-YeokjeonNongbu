import { Link, useNavigate } from 'react-router-dom';
import { logout } from '@/services/AuthApi';
import { AlertContext } from '@/components/public/AlertContext';
import { useContext } from 'react';

interface BarProps {
  isOpen: boolean;
  closeModal: () => void;
}

const BarModal: React.FC<BarProps> = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();
  const { alert } = useContext(AlertContext);

  const handleLogout = async () => {
    const response = await logout();

    if (response.success) {
      navigate('/');
    } else {
      await alert(response.message || '로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    closeModal();
  };

  if (!isOpen) return null;

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
        <button onClick={handleLogout} className="text-lg font-bold text-light-gray text-shadow">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default BarModal;
