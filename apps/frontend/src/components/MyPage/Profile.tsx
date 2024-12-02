import { useState, useRef, useEffect, useContext } from 'react';
import EditIcon from '@/components/Icons/EditIcon';
import SaveIcon from '@/components/Icons/SaveIcon';
import { getIntroduce, updateIntroduce } from '@/services/AuthApi';
import { getMyRank } from '@/services/RankApi';
import { AlertContext } from '@/components/public/AlertContext';

interface ProfileProps {
  id: string;
  modalOpen: () => void;
}

const Profile: React.FC<ProfileProps> = ({ id, modalOpen }) => {
  const [tmpIntro, setTmpIntro] = useState<string>('');
  const [introduce, setIntroduce] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [myRank, setMyRank] = useState<number>(0);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);
  const { alert } = useContext(AlertContext);

  useEffect(() => {
    const fetchMyRank = async () => {
      try {
        const response = await getMyRank();
        if (response.success) {
          setMyRank(response.rank || 0);
          setError1(null);
        } else {
          setError1(response.message || '데이터 로딩 중 오류가 발생했습니다.');
        }
      } catch {
        setError1('서버와의 연결에 실패했습니다.');
      }
    };

    const fetchIntroduce = async () => {
      try {
        const response = await getIntroduce();
        if (response.success) {
          setIntroduce(response.introduce || '');
          setTmpIntro(response.introduce || '');
          setError2(null);
        } else {
          setError2(response.message || '데이터 로딩 중 오류가 발생했습니다.');
        }
      } catch {
        setError2('서버와의 연결에 실패했습니다.');
      }
    };

    fetchMyRank();
    fetchIntroduce();
  }, []);

  const editIntroduce = () => {
    if (!isEditable) {
      setIsEditable(true);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } else {
      if (tmpIntro != introduce) {
        changeIntroduce(tmpIntro);
      }
      setIsEditable(false);
    }
  };

  const changeIntroduce = async (newIntroduce: string) => {
    try {
      const response = await updateIntroduce({ introduce: newIntroduce });
      if (response.success) {
        setIntroduce(newIntroduce);
      } else {
        await alert(response.message || '소개글 변경에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      await alert('소개글 변경에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-6 w-[300px]">
      <div className="relative w-full h-16 flex items-center justify-center mb-2">
        {error1 ? (
          <p className="absolute text-red-soft font-bold">{error1}</p>
        ) : (
          <>
            <img src="/trophy.png" className="absolute w-full h-full object-contain" alt="Trophy" />
            <p className="absolute top-2 text-red-soft text-2xl font-bold">
              {myRank === -1 ? 'UnRank' : myRank}
            </p>
          </>
        )}
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <p className="text-lg font-bold">{id}</p>
        <EditIcon onClick={modalOpen}></EditIcon>
      </div>
      {error2 ? (
        <div className="flex w-full mt-2 flex-grow rounded-md text-center justify-center p-2">
          <p className="absolute text-black font-bold">{error2}</p>
        </div>
      ) : (
        <div className="flex w-full bg-light-red mt-2 flex-grow rounded-md text-center justify-center p-2">
          <textarea
            ref={textareaRef}
            placeholder="한줄 소개를 입력해보세요!"
            className="bg-light-red text-red-soft select-none font-bold p-1 mt-2 mx-2 w-full resize-none rounded border-none focus:outline-none cursor-default"
            value={tmpIntro}
            onChange={e => setTmpIntro(e.target.value)}
            readOnly={!isEditable}
          />
          {isEditable ? (
            <>
              <SaveIcon onClick={editIntroduce} />
            </>
          ) : (
            <>
              <EditIcon onClick={editIntroduce} />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
