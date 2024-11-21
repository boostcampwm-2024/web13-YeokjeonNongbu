import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalStep } from '@/constants/ModalConstants';

interface LoginProps {
  setModalStep: (step: ModalStep) => void;
}

const LoginModal: React.FC<LoginProps> = ({ setModalStep }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // 로그인 작업 필요

    setErrorMessage(null);
    navigate('/main');
  };

  return (
    <>
      <img src="/icon.png" className="max-w-[200px] max-h-[200px] mb-4"></img>

      <div className="mb-4 flex flex-col items-center">
        <label htmlFor="email" className="block text-base font-bold text-gray-700 select-none">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="input min-w-[300px] min-h-[40px] rounded-lg"
        />
      </div>

      <div className="mb-4 flex flex-col items-center">
        <label htmlFor="password" className="block text-base font-bold text-gray-700 select-none">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="input min-w-[300px] min-h-[40px] rounded-lg"
        />
      </div>

      {errorMessage && <div className="text-sm text-red-600 mb-4">{errorMessage}</div>}

      <button
        className="m-2 p-2 bg-brown-dark text-light-gray rounded-lg min-w-[300px] min-h-[40px]"
        onClick={handleLogin}
      >
        로그인
      </button>

      <div className="flex items-center w-full text-black text-xs font-semibold my-4 select-none">
        <span className="flex-grow h-px bg-black mx-4"></span>
        social login
        <span className="flex-grow h-px bg-black mx-4"></span>
      </div>

      <div className="flex flex-row my-2 gap-16">
        <button className="rounded-full border-none w-[40px] h-[40px] overflow-hidden bg-gray-200 flex items-center justify-center">
          <img
            src="https://d1nuzc1w51n1es.cloudfront.net/d99d8628713bb69bd142.png"
            alt="google login"
            className="w-full h-full object-cover"
          />
        </button>

        <button className="rounded-full border-none w-[40px] h-[40px] overflow-hidden bg-gray-200 flex items-center justify-center">
          <img
            src="https://d1nuzc1w51n1es.cloudfront.net/c9b51919f15c93b05ae8.png"
            alt="kakao login"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      <p
        className="my-2 cursor-pointer hover:underline text-xs text-black font-semibold"
        onClick={() => setModalStep(ModalStep.SignUpStep1)}
      >
        Don't have an account?
      </p>
    </>
  );
};

export default LoginModal;
