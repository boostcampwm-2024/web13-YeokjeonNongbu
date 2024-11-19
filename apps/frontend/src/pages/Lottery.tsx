import LotteryTicket from '@/components/LotteryTicket';
import LotteryModal from '@/components/LotteryModal';
import LotteryButtons from '@/components/LotteryButtons';
import UseLotteryModal from '@/hooks/UseLotteryModal';
import UseLotteryCanvas from '@/hooks/UseLotteryCanvas';

const Lottery: React.FC = () => {
  const { isModalOpen, openModal, handleCancel, handleConfirm } = UseLotteryModal();
  const {
    isCanvasVisible,
    isScratching,
    canvasRef,
    resetLottery,
    setIsCanvasVisible,
    setIsScratching
  } = UseLotteryCanvas();

  const canvasOpen = () => {
    setIsCanvasVisible(true);
    setIsScratching(true);
    handleConfirm();
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-8 font-sans select-none">
      <LotteryTicket isCanvasVisible={isCanvasVisible} canvasRef={canvasRef} />

      <div className="relative h-[50px]">
        <LotteryButtons
          isScratching={isScratching}
          isCanvasVisible={isCanvasVisible}
          openModal={openModal}
          resetLottery={resetLottery}
        />
      </div>

      {isModalOpen && <LotteryModal handleCancel={handleCancel} canvasOpen={canvasOpen} />}
    </main>
  );
};

export default Lottery;
