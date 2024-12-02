interface LotteryModalProps {
  handleCancel: () => void;
  canvasOpen: () => void;
}

const LotteryModal: React.FC<LotteryModalProps> = ({ handleCancel, canvasOpen }) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <div className="flex flex-col items-center text-center bg-light-yellow bg-opacity-90 p-6 rounded-lg shadow-lg">
        <img src="/lottery.png" className="w-[80px] h-[80px]" />
        <p className="mb-4 font-bold text-lg">복권을 구매 하시겠습니까?</p>
        <div className="flex flex-row justify-end gap-4">
          <button
            onClick={handleCancel}
            className="p-2 bg-coral text-light-gray rounded-lg min-w-[200px] min-h-[45px]"
          >
            취소
          </button>
          <button
            onClick={canvasOpen}
            className="p-2 bg-brown-dark text-light-gray rounded-lg min-w-[200px] min-h-[45px]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LotteryModal;
