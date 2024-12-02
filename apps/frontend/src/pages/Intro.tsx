import { useState, useEffect } from 'react';
import IntroTitle from '@/components/Intro/IntroTitle';
import LoginModal from '@/components/Intro/LoginModal';
import SignUpModal from '@/components/Intro/SignUpModal';
import CloseIcon from '@/components/Icons/CloseIcon';
import BackIcon from '@/components/Icons/BackIcon';
import { ModalStep } from '@/constants/ModalConstants';
import { isLoggedIn } from '@/services/AuthApi';
import { useNavigate } from 'react-router-dom';

const Intro: React.FC = () => {
  const navigate = useNavigate();
  const [isButtonVisible, setIsButtonVisible] = useState<boolean>(false);
  const [skipAnimations, setSkipAnimations] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<ModalStep>(ModalStep.None);

  const handleSkipAnimations = () => {
    setSkipAnimations(true);
    setIsButtonVisible(true);
  };

  useEffect(() => {
    if (isLoggedIn()) navigate('/main');
    const timer = setTimeout(() => setIsButtonVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => setModalStep(ModalStep.None);

  const handleButtonClick = () => {
    if (!isButtonVisible) return;
    setModalStep(ModalStep.Login);
  };

  return (
    <div className="relative h-screen w-screen select-none" onClick={handleSkipAnimations}>
      <IntroTitle skipAnimations={skipAnimations} />
      <div
        className="bg-intro h-screen w-screen bg-no-repeat bg-center"
        style={{ backgroundSize: '100% 100%' }}
      ></div>

      <button
        className={`
          bg-start cursor-pointer absolute bg-no-repeat bg-contain border-none
          left-[50%] top-[70%] translate-x-[-50%] translate-y-[-50%]
          w-[160px] h-[120px] md:w-[230px] md:h-[150px] lg:w-[240px] lg:h-[160px] xl:w-[250px] xl:h-[170px]
          ${isButtonVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000
        `}
        onClick={handleButtonClick}
        aria-label="Start"
      ></button>

      {modalStep !== ModalStep.None && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-bg-color opacity-95 p-8 rounded-lg shadow-lg flex flex-col items-center min-w-[500px]">
            <div className="flex items-center w-full">
              <BackIcon
                onClick={() =>
                  modalStep === ModalStep.SignUpStep1
                    ? setModalStep(ModalStep.Login)
                    : setModalStep(ModalStep.SignUpStep1)
                }
                className={modalStep === ModalStep.Login ? 'invisible' : ''}
              />
              <h2 className="text-xl font-bold mb-4 flex-grow text-center select-none">
                {modalStep === ModalStep.Login ? '로그인' : '회원가입'}
              </h2>
              <CloseIcon
                onClick={closeModal}
                className={modalStep !== ModalStep.Login ? 'invisible' : ''}
              />
            </div>
            {modalStep === ModalStep.Login ? (
              <LoginModal setModalStep={setModalStep} />
            ) : (
              <SignUpModal
                step={modalStep === ModalStep.SignUpStep1 ? 1 : 2}
                setModalStep={setModalStep}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Intro;
