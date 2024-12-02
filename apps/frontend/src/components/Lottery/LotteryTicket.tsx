import LotteryIcon from './LotteryIcon';
import { WIDTH, HEIGHT, WINNINGS } from '@/constants/LotteryConstants';

interface LotteryTicketProps {
  isCanvasVisible: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  rank: number;
}

const LotteryTicket: React.FC<LotteryTicketProps> = ({ isCanvasVisible, canvasRef, rank }) => {
  return (
    <div className="relative flex flex-col items-center justify-center">
      <LotteryIcon>
        {!isCanvasVisible ? (
          <text x="540" y="380" fill="white" fontSize="130" transform="rotate(-8, 110, 230)">
            인생한방!
          </text>
        ) : (
          <text x="110" y="270" fill="white" fontSize="40" transform="rotate(-8, 110, 230)">
            인생한방!
          </text>
        )}
      </LotteryIcon>

      {isCanvasVisible && (
        <div className="absolute top-[20px] left-[280px] w-[500px] h-[270px]">
          <div className="absolute flex flex-col top-0 left-0 w-full h-full flex items-center justify-center text-2xl font-bold bg-white text-black rounded-lg">
            <p>{rank === 5 ? '실패!' : `${rank}등 성공!`}</p>
            {rank !== 5 && <p>+ {WINNINGS[rank][0]}원!</p>}
          </div>
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            className="absolute top-0 left-0 rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default LotteryTicket;
