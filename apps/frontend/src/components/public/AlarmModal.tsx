import CloseIcon from '@/components/Icons/CloseIcon';
import { Alarm } from '@/types/Index';

interface AlarmModalProps {
  alarms: Alarm[];
  setIsNewAlarm: (isNewAlarm: boolean) => void;
  error: string | null;
  isOpen: boolean;
  closeModal: () => void;
  clearAllAlarms: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({
  alarms,
  setIsNewAlarm,
  error,
  isOpen,
  closeModal,
  clearAllAlarms
}) => {
  if (!isOpen) return;

  const timeAgo = (date: string): string => {
    const now = new Date();
    const pre = new Date(date);

    const kstOffset = 9 * 60;
    const kstNow = new Date(now.getTime() + kstOffset * 60 * 1000);
    const kstPre = new Date(pre.getTime() + kstOffset * 60 * 1000);

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
    <div
      className="fixed w-[312px] top-24 right-32 select-none"
      onClick={() => setIsNewAlarm(false)}
    >
      <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-4 shadow-lg w-76">
        <div className="flex justify-end w-full">
          <CloseIcon onClick={closeModal} />
        </div>
        {error ? (
          <p className="text-center text-xs text-brown-medium mt-4 mb-2">{error}</p>
        ) : (
          <>
            {alarms.length > 0 ? (
              <>
                <div className="max-h-[260px] overflow-y-auto overflow-hidden mt-6">
                  {alarms.map((alarm, index) => (
                    <div
                      key={`${alarm.mailId}-${index}`}
                      className="flex items-center w-full border-b border-light-pink py-3 px-2"
                    >
                      <img src="/coin.png" alt="coin" className="w-10 h-10 mr-4" />
                      <div className="flex flex-col w-full text-brown-medium text-center text-xs gap-1">
                        <p className="flex font-semibold">{alarm.content}</p>
                        <p className="flex justify-end font-normal">{timeAgo(alarm.createdAt)}</p>
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
            ) : (
              <p className="text-center text-xs text-brown-medium py-4 px-3">
                알림 내역이 존재하지 않습니다.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AlarmModal;
