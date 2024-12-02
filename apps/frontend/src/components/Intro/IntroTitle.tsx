interface IntroTitleProps {
  skipAnimations: boolean;
}

const IntroTitle: React.FC<IntroTitleProps> = ({ skipAnimations }) => {
  return (
    <div
      className="
        flex 
        absolute 
        left-[50%] top-[10%] 
        transform -translate-x-1/2 
        space-x-4
        sm:space-x-8 md:space-x-12 lg:space-x-24
      "
    >
      <div
        className={`
          bg-yeok
          bg-no-repeat 
          bg-contain
          w-[60px] h-[100px]
          sm:w-[80px] sm:h-[120px]
          md:w-[100px] md:h-[140px]
          lg:w-[130px] lg:h-[170px]
          ${skipAnimations ? 'opacity-100' : 'animate-slideDown opacity-0'}
          transition-opacity duration-1000
        `}
        style={{ animationDelay: '0s' }}
      ></div>

      <div
        className={`
          bg-jeon
          bg-no-repeat 
          bg-contain
          w-[60px] h-[100px]
          sm:w-[80px] sm:h-[120px]
          md:w-[100px] md:h-[140px]
          lg:w-[130px] lg:h-[170px]
          ${skipAnimations ? 'opacity-100' : 'animate-slideDown opacity-0'}
          transition-opacity duration-1000
        `}
        style={{ animationDelay: '1s' }}
      ></div>

      <div
        className={`
          bg-nong
          bg-no-repeat 
          bg-contain
          w-[60px] h-[100px]
          sm:w-[80px] sm:h-[120px]
          md:w-[100px] md:h-[140px]
          lg:w-[130px] lg:h-[170px]
          ${skipAnimations ? 'opacity-100' : 'animate-slideDown opacity-0'}
          transition-opacity duration-1000
        `}
        style={{ animationDelay: '2s' }}
      ></div>

      <div
        className={`
          bg-bu
          bg-no-repeat 
          bg-contain
          w-[40px] h-[100px]
          sm:w-[60px] sm:h-[120px]
          md:w-[80px] md:h-[140px]
          lg:w-[110px] lg:h-[170px]
          ${skipAnimations ? 'opacity-100' : 'animate-slideDown opacity-0'}
          transition-opacity duration-1000
        `}
        style={{ animationDelay: '3s' }}
      ></div>
    </div>
  );
};

export default IntroTitle;
