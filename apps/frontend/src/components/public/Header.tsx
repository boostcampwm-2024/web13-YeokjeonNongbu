import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
import AlarmModal from '@/components/public/AlarmModal';
import BarModal from '@/components/public/BarModal';
import { Alarm } from '@/types/Index';
import { useUser } from '@/components/public/UserContext';
import { getAlarm, clearAlarm } from '@/services/MailApi';
import { AlertContext } from '@/components/public/AlertContext';

const Header: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAlarmOpen, setIsAlarmOpen] = useState<boolean>(false);
  const [isBarOpen, setIsBarOpen] = useState<boolean>(false);
  const [isNewAlarm, setIsNewAlarm] = useState<boolean>(false);
  const { nickname, totalAssets } = useUser();
  const { alert } = useContext(AlertContext);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectDelay = 3000;
  const location = useLocation();

  const isJson = (data: string) => {
    try {
      JSON.parse(data);
      return true;
    } catch {
      return false;
    }
  };

  const fetchAlarm = async () => {
    try {
      const response = await getAlarm();
      if (response.success) {
        setAlarms(response.alarm);
        setError(null);
      } else {
        setError(response.message || '데이터 로딩 중 오류가 발생했습니다.');
      }
    } catch {
      setError('서버와의 연결에 실패했습니다.');
    }
  };

  const createEventSource = () => {
    const EventSource = EventSourcePolyfill || window.EventSource;

    const eventSource = new EventSource(`${import.meta.env.VITE_BASE_URL}/api/mail/check`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    eventSource.onmessage = (event: MessageEvent) => {
      if (isJson(event.data)) {
        const parsedData = JSON.parse(event.data);

        if (parsedData.data.check) {
          setIsNewAlarm(true);
          fetchAlarm();
        }
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      eventSourceRef.current = null;
      setTimeout(() => {
        eventSourceRef.current = createEventSource();
      }, reconnectDelay);
    };

    return eventSource;
  };

  const clearAllAlarms = () => {
    const deleteAlarm = async () => {
      try {
        const response = await clearAlarm();
        if (response.success) {
          setAlarms([]);
        } else {
          await alert(response.message || '알림 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } catch {
        await alert('알림 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    deleteAlarm();
  };

  const toggleAlarmModal = () => {
    if (!isBarOpen) setIsAlarmOpen(!isAlarmOpen);
    setIsNewAlarm(false);
  };

  const toggleBarModal = () => {
    if (!isAlarmOpen) setIsBarOpen(!isBarOpen);
  };

  useEffect(() => {
    fetchAlarm();

    eventSourceRef.current = createEventSource();

    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, []);

  return (
    <header className="fixed top-[30px] left-0 w-full flex items-center justify-between px-16 z-[50] select-none">
      <div className="flex items-center gap-8">
        <Link to="/main">
          <div className="bg-home bg-no-repeat bg-contain w-[50px] h-[50px]"></div>
        </Link>

        <section className="flex items-center justify-center bg-light-beige text-lg font-semibold border-4 border-light-pink rounded-2xl p-3 mx-4 min-w-[200px] max-w-[400px]">
          <p>{nickname}</p>
        </section>

        {location.pathname !== '/cropmarket' && (
          <section className="flex items-center justify-center bg-light-beige text-lg font-semibold border-4 border-light-pink rounded-2xl p-3 mx-4 min-w-[200px] max-w-[400px]">
            <p>￦ {totalAssets.toLocaleString()}</p>
          </section>
        )}
      </div>

      <div className="flex items-center gap-8">
        <div
          onClick={toggleAlarmModal}
          className="relative bg-alarm bg-no-repeat bg-contain w-[55px] h-[50px] cursor-pointer"
        >
          {isNewAlarm && (
            <span className="absolute top-2 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
          )}
        </div>

        <div
          onClick={toggleBarModal}
          className="bg-sideBar bg-no-repeat bg-contain w-[50px] h-[50px] cursor-pointer select-none"
        />
      </div>

      <AlarmModal
        alarms={alarms}
        setIsNewAlarm={setIsNewAlarm}
        error={error}
        isOpen={isAlarmOpen}
        closeModal={() => setIsAlarmOpen(false)}
        clearAllAlarms={clearAllAlarms}
      />
      <BarModal isOpen={isBarOpen} closeModal={() => setIsBarOpen(false)} />
    </header>
  );
};

export default Header;
