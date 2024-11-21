import { useState } from 'react';
import CloseIcon from './CloseIcon';

interface EditNicknameModalProps {
  isOpen: boolean;
  id: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  modalOpen: () => void;
}

const EditNicknameModal: React.FC<EditNicknameModalProps> = ({ isOpen, id, setId, modalOpen }) => {
  const [tempId, setTempId] = useState<string>('농부왕');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNicknameChange = () => {
    if (tempId.length < 2) {
      setErrorMessage('닉네임은 최소 2자 이상이어야 합니다.');
      return;
    }

    setErrorMessage(null);
    setId(tempId);

    modalOpen();
  };

  const handleCancelEdit = () => {
    setTempId(id);
    setErrorMessage(null);
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
              onChange={e => setTempId(e.target.value)}
              className="rounded px-4 py-1 text-base text-center min-w-[200px] "
              value={tempId}
            />
            {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
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
