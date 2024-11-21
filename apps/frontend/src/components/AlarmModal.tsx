import CloseIcon from './CloseIcon';
import { Alarm } from '@/types/Index';

interface AlarmModalProps {
  alarms: Alarm[];
  isOpen: boolean;
  closeModal: () => void;
  clearAllAlarms: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({ alarms, isOpen, closeModal, clearAllAlarms }) => {
  if (!isOpen) return;

  const timeAgo = (date: string): string => {
    const now = new Date();
    const pre = new Date(date);

    const kstOffset = 9 * 60;
    const kstNow = new Date(now.getTime() + kstOffset * 60 * 1000);
    const kstPre = new Date(pre.getTime());

    const seconds = Math.floor((kstNow.getTime() - kstPre.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval >= 1) return `${interval} 년 전`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} 달 전`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} 일 전`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} 시간 전`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} 분 전`;

    return `${Math.floor(seconds)} 초 전`;
  };

  return (
    <div className="fixed top-12 right-24 mt-12 mr-8 select-none">
      <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-4 shadow-lg w-76">
        <div className="flex justify-end w-full">
          <CloseIcon onClick={closeModal} />
        </div>
        {alarms.length > 0 && (
          <>
            <div className="max-h-[260px] overflow-y-auto mt-4">
              {alarms.map(alarm => (
                <div
                  key={alarm.mailId}
                  className="flex items-center w-full border-b border-light-pink py-3 px-2"
                >
                  <img src="/coin.png" alt="coin" className="w-10 h-10 mr-4" />
                  <div className="flex flex-col text-brown-medium text-center text-xs gap-1">
                    <p className="flex font-semibold">{alarm.content}</p>
                    <p className="flex justify-end font-normal">{timeAgo(alarm.createAt)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={clearAllAlarms}
              className="flex justify-end w-full text-xs mt-4 text-red-alert px-4 py-2"
            >
              알림 전체 삭제
            </button>
          </>
        )}
        {alarms.length === 0 && (
          <p className="text-center text-xs text-brown-medium mt-4 mb-2">
            알림 내역이 존재하지 않습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default AlarmModal;
