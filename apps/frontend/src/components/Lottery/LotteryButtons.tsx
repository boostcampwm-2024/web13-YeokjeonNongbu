interface LotteryButtonsProps {
  isScratching: boolean;
  isCanvasVisible: boolean;
  openModal: () => void;
  resetLottery: () => void;
}

const LotteryButtons: React.FC<LotteryButtonsProps> = ({
  isScratching,
  isCanvasVisible,
  openModal,
  resetLottery
}) => (
  <>
    {!isScratching && !isCanvasVisible && (
      <button
        onClick={openModal}
        className="p-2 bg-brown-dark text-light-gray rounded-lg shadow-lg min-w-[250px] min-h-[50px]"
      >
        복권긁기
      </button>
    )}
    {!isScratching && isCanvasVisible && (
      <button
        onClick={resetLottery}
        className="p-2 bg-brown-dark text-light-gray rounded-lg shadow-lg min-w-[250px] min-h-[50px]"
      >
        또 긁으러 가기
      </button>
    )}
  </>
);

export default LotteryButtons;
