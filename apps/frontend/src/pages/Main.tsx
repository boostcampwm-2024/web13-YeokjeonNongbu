import { Link } from 'react-router-dom';
import GetFarmImg from '@/utils/GetFarmImg';

const Main: React.FC = () => {
  const amount: number = 100000000;

  return (
    <main className="flex flex-col justify-center items-center select-none min-h-screen">
      <div
        className="flex justify-center items-center bg-no-repeat bg-contain bg-center w-[370px] h-[360px]"
        style={{ backgroundImage: `url(${GetFarmImg(amount)})` }}
      ></div>
      <nav className="flex justify-center mt-8">
        <ul className="flex list-none gap-24">
          <li>
            <Link to="/cropmarket" className="flex flex-col items-center">
              <div className="bg-cropmarket bg-no-repeat bg-contain w-[90px] h-[90px]" />
              <p className="text-base font-bold text-light-grey text-shadow">작물시장</p>
            </Link>
          </li>
          <li>
            <Link to="/mypage" className="flex flex-col items-center">
              <div className="bg-mypage bg-no-repeat bg-contain w-[90px] h-[90px]" />
              <p className="text-base font-bold text-light-grey text-shadow">마이페이지</p>
            </Link>
          </li>
          <li>
            <Link to="/ranking" className="flex flex-col items-center">
              <div className="bg-ranking bg-no-repeat bg-contain w-[80px] h-[100px]" />
              <p className="text-base font-bold text-light-grey text-shadow">랭킹</p>
            </Link>
          </li>
          <li>
            <Link to="/lottery" className="flex flex-col items-center">
              <div className="bg-lottery bg-no-repeat bg-contain w-[90px] h-[90px]" />
              <p className="text-base font-bold text-light-grey text-shadow">복권</p>
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

export default Main;
