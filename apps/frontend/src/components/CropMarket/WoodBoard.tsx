import { ReactNode } from 'react';

interface WoodBoardProps {
  children: ReactNode;
}

const WoodBoard: React.FC<WoodBoardProps> = ({ children }) => {
  return (
    <>
      <div className="flex h-full w-[45%] max-w-[580px] bg-board1 bg-no-repeat bg-[length:100%_100%] border-none rounded-lg">
        <div className="h-full w-full p-4 xl:p-8 2xl:p-10">{children}</div>
      </div>
    </>
  );
};

export default WoodBoard;
