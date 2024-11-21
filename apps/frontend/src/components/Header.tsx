import { Link } from 'react-router-dom';
import { useState } from 'react';
import AlarmModal from './AlarmModal';
import BarModal from './BarModal';
import { Alarm } from '@/types/Index';

const Header: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      mailId: 1,
      content: '당근을 500원에 20개를 매수하셨습니다.',
      createAt: '2024-11-20T11:16:00.000Z',
      readStatus: false
    },
    {
      mailId: 2,
      content: '당근을 500원에 20개를 매수하셨습니다.',
      createAt: '2024-11-20T11:00:00.000Z',
      readStatus: false
    },
    {
      mailId: 3,
      content: '당근을 500원에 20개를 매수하셨습니다.',
      createAt: '2024-11-20T10:00:00.000Z',
      readStatus: false
    },
    {
      mailId: 4,
      content: '당근을 500원에 20개를 매수하셨습니다.',
      createAt: '2024-11-19T15:00:00.000Z',
      readStatus: false
    },
    {
      mailId: 5,
      content: '당근을 500원에 20개를 매수하셨습니다.',
      createAt: '2024-10-11T15:00:00.000Z',
      readStatus: false
    },
    {
      mailId: 6,
      content: '당근을 500원에 20개를 매수하셨습니다.',
      createAt: '2023-11-11T15:00:00.000Z',
      readStatus: false
    }
  ]);
  const [isAlarmOpen, setIsAlarmOpen] = useState<boolean>(false);
  const [isBarOpen, setIsBarOpen] = useState<boolean>(false);

  const clearAllAlarms = () => {
    setAlarms([]);
  };

  const toggleAlarmModal = () => {
    if (!isBarOpen) setIsAlarmOpen(!isAlarmOpen);
  };

  const toggleBarModal = () => {
    if (!isAlarmOpen) setIsBarOpen(!isBarOpen);
  };

  return (
    <header className="fixed top-[30px] left-0 w-full flex items-center justify-between px-16 z-[50] select-none">
      <div className="flex items-center gap-8">
        <Link to="/main">
          <div className="bg-home bg-no-repeat bg-contain w-[50px] h-[50px]"></div>
        </Link>

        <section className="flex items-center justify-center bg-light-beige text-lg font-semibold border-4 border-light-pink rounded-2xl p-3 mx-4 min-w-[200px] max-w-[400px]">
          <p>농부왕</p>
        </section>

        <section className="flex items-center justify-center bg-light-beige text-lg font-semibold border-4 border-light-pink rounded-2xl p-3 mx-4 min-w-[200px] max-w-[400px]">
          <p>￦ 932,517,456</p>
        </section>
      </div>

      <div className="flex items-center gap-8">
        <div
          onClick={toggleAlarmModal}
          className="bg-alarm bg-no-repeat bg-contain w-[50px] h-[50px] cursor-pointer"
        ></div>

        <div
          onClick={toggleBarModal}
          className="bg-sideBar bg-no-repeat bg-contain w-[50px] h-[50px] cursor-pointer select-none"
        />
      </div>

      <AlarmModal
        alarms={alarms}
        isOpen={isAlarmOpen}
        closeModal={() => setIsAlarmOpen(false)}
        clearAllAlarms={clearAllAlarms}
      />
      <BarModal isOpen={isBarOpen} closeModal={() => setIsBarOpen(false)} />
    </header>
  );
};

export default Header;
