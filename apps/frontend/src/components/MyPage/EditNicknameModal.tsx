import { useContext, useState } from 'react';
import CloseIcon from '@/components/Icons/CloseIcon';
import { updateNickname } from '@/services/AuthApi';
import { useUser } from '@/components/public/UserContext';
import { AlertContext } from '@/components/public/AlertContext';

interface EditNicknameModalProps {
  isOpen: boolean;
  modalOpen: () => void;
}

const EditNicknameModal: React.FC<EditNicknameModalProps> = ({ isOpen, modalOpen }) => {
  const { nickname, setNickname } = useUser();
  const [tmpNickname, setTmpNickname] = useState<string>(nickname);
  const { alert } = useContext(AlertContext);

  const handleNicknameChange = async () => {
    if (tmpNickname === nickname) {
      modalOpen();
      return;
    }

    try {
      const response = await updateNickname({ nickname: tmpNickname });
      if (response.success) {
        setNickname(tmpNickname);
        modalOpen();
      } else {
        await alert(response.message || '닉네임 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch {
      await alert('닉네임 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleCancelEdit = () => {
    setTmpNickname(nickname);
    modalOpen();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[15]">
      <div className="flex flex-col items-center text-center bg-light-yellow bg-opacity-90 p-8 rounded-lg shadow-lg p-8 gap-2 min-w-[400px]">
        <div className="flex w-full justify-end">
          <CloseIcon onClick={handleCancelEdit} />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-col px-4 gap-2">
            <p className="font-bold text-lg">변경할 닉네임을 작성해주세요!</p>
            <input
              onChange={e => setTmpNickname(e.target.value)}
              className="rounded px-4 py-1 text-base text-center min-w-[200px] "
              value={tmpNickname}
            />
          </div>
          <div className="flex flex-row justify-end gap-4 mt-8">
            <button
              onClick={handleNicknameChange}
              className="p-2 bg-brown-dark text-light-gray rounded-lg min-w-[180px] min-h-[40px]"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNicknameModal;
