import { useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <footer>
      <div
        className={`
        fixed
        bottom-0
        left-0
        w-full
        h-[150px]
        bg-grass
        bg-no-repeat
        bg-cover
        z-[2]
      `}
      ></div>
      {path === '/lottery' && (
        <>
          <div
            className={`
            fixed
            bottom-0
            left-[30px]
            w-[280px]
            h-[310px]
            bg-veggieBox
            bg-no-repeat
            bg-cover
            rotate-[4deg]
          `}
          ></div>
          <div
            className={`
            fixed
            bottom-0
            right-[30px]
            w-[260px]
            h-[260px]
            bg-giftBox
            bg-no-repeat
            bg-cover
          `}
          ></div>
        </>
      )}
    </footer>
  );
};

export default Footer;
