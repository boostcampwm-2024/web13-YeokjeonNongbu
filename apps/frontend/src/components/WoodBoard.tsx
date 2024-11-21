import { ReactNode } from 'react';

interface WoodBoardProps {
  children: ReactNode;
}

const WoodBoard: React.FC<WoodBoardProps> = ({ children }) => {
  return (
    <>
      <div className="flex h-60 w-full sm:w-[424px] bg-board1 bg-no-repeat bg-contain border-none rounded-lg">
        <div className="h-full w-full p-8">{children}</div>
      </div>
    </>
  );
};

export default WoodBoard;
