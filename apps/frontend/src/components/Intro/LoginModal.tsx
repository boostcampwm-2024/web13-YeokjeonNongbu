import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalStep } from '@/constants/ModalConstants';
import { login } from '@/services/AuthApi';
import { useUser } from '@/components/public/UserContext';
import { AlertContext } from '@/components/public/AlertContext';

interface LoginProps {
  setModalStep: (step: ModalStep) => void;
}

const LoginModal: React.FC<LoginProps> = ({ setModalStep }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { setNickname } = useUser();
  const { alert } = useContext(AlertContext);

  const handleLogin = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email || !emailRegex.test(email)) {
      setError('유효한 이메일을 입력해주세요.');
      return;
    }

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await login({ email, password });
      if (response.success) {
        setNickname(response.nickname);
        navigate('/main');
      } else {
        await alert(response.message || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch {
      await alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleGoogle = async () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/auth/google`;
  };

  const handleKakao = async () => {
    window.location.href = `${import.meta.env.VITE_BASE_URL}/api/auth/kakao`;
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

      {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

      <button
        className="m-2 p-2 bg-brown-dark text-light-gray rounded-lg min-w-[300px] min-h-[40px]"
        onClick={handleLogin}
      >
        로그인
      </button>

      <div className="flex items-center w-full text-black text-xs font-semibold my-4 select-none">
        <span className="flex-grow h-px bg-black mx-4"></span>
        소셜 로그인
        <span className="flex-grow h-px bg-black mx-4"></span>
      </div>

      <div className="flex flex-row my-2 gap-16">
        <button
          className="rounded-full border-none w-[40px] h-[40px] overflow-hidden bg-gray-200 flex items-center justify-center"
          onClick={handleGoogle}
        >
          <img
            src="https://d1nuzc1w51n1es.cloudfront.net/d99d8628713bb69bd142.png"
            alt="google login"
            className="w-full h-full object-cover"
          />
        </button>

        <button
          className="rounded-full border-none w-[40px] h-[40px] overflow-hidden bg-gray-200 flex items-center justify-center"
          onClick={handleKakao}
        >
          <img
            src="https://d1nuzc1w51n1es.cloudfront.net/c9b51919f15c93b05ae8.png"
            alt="kakao login"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      <div className="flex flex-row my-2 gap-2">
        <p className="my-2 text-xs text-black font-semibold">역전농부는 처음이신가요?</p>
        <p
          className="my-2 cursor-pointer hover:underline text-xs text-blue-600 font-semibold"
          onClick={() => setModalStep(ModalStep.SignUpStep1)}
        >
          회원가입
        </p>
      </div>
    </>
  );
};

export default LoginModal;
