import { useEffect } from 'react';

interface AlertProps {
  message: string;
  onClickOK: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClickOK }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onClickOK();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClickOK]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center text-center bg-light-yellow bg-opacity-90 p-8 rounded-lg shadow-lg max-w-[400px] w-full">
        <p className="mb-6 font-bold text-lg">{message}</p>
        <div className="flex flex-row justify-center gap-4">
          <button
            onClick={onClickOK}
            className="p-2 mt-2 bg-brown-dark text-light-gray rounded-lg min-w-[160px] min-h-[35px] text-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
