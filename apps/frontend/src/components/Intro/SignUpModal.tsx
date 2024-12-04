import { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalStep } from '@/constants/ModalConstants';
import { signUp, login, dupAccount } from '@/services/AuthApi';
import { AlertContext } from '@/components/public/AlertContext';

interface SignUpModalProps {
  step: number;
  setModalStep: (step: ModalStep) => void;
}

const SignUpModal: React.FC<SignUpModalProps> = ({ step, setModalStep }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pwCheck, setPwCheck] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { alert } = useContext(AlertContext);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const pwCheckInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  const handleSign1 = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setError('유효한 이메일을 입력해주세요.');
      emailInputRef.current?.focus();
      return;
    }

    if (!password || password.length < 8 || password.length > 16) {
      setError('비밀번호는 8자 이상, 16자 이하로 입력해주세요.');
      passwordInputRef.current?.focus();
      return;
    }

    if (password !== pwCheck) {
      setError('비밀번호가 일치하지 않습니다.');
      pwCheckInputRef.current?.focus();
      return;
    }

    try {
      const dupCheck = await dupAccount(email);
      if (dupCheck.success) {
        setError(null);
        setModalStep(ModalStep.SignUpStep2);
      } else {
        setError(dupCheck.message);
      }
    } catch {
      setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleSign2 = async () => {
    if (!id || id.length < 2 || id.length > 10) {
      setError('닉네임는 2자 이상, 10자 이하로 입력해주세요.');
      idInputRef.current?.focus();
      return;
    }

    setError(null);

    const signUpResponse = await signUp({ email, password, nickname: id });

    if (signUpResponse.success) {
      await alert('회원가입이 완료되었습니다. 로그인 중입니다...');
      try {
        const loginResponse = await login({ email, password });
        if (loginResponse.success) {
          navigate('/main');
        } else {
          await alert(loginResponse.message || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
          navigate('/');
        }
      } catch {
        await alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/');
      }
    } else {
      setError(signUpResponse.message || '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (step === 1) handleSign1();
        else handleSign2();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSign1, handleSign2]);

  return (
    <div className="flex flex-col items-center select-none">
      <img src="/signIn.png" className="max-w-[200px] max-h-[200px] mb-4"></img>
      {step === 1 && (
        <>
          <div className="flex flex-col items-center mb-2">
            <label>이메일</label>
            <input
              id="email"
              type="email"
              ref={emailInputRef}
              className="input min-w-[300px] min-h-[40px] rounded-lg"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center mb-2">
            <label>비밀번호</label>
            <input
              id="password"
              ref={passwordInputRef}
              type="password"
              className="input min-w-[300px] min-h-[40px] rounded-lg"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center mb-2">
            <label>비밀번호 확인</label>
            <input
              id="passwordCheck"
              ref={pwCheckInputRef}
              type="password"
              className="input min-w-[300px] min-h-[40px] rounded-lg"
              value={pwCheck}
              onChange={e => setPwCheck(e.target.value)}
            />
          </div>
          {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
          <button
            className="mt-4 p-2 bg-brown-dark text-light-gray rounded-lg min-w-[300px] min-h-[40px]"
            onClick={handleSign1}
          >
            다음
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">회원가입</h2>
          <div className="mb-2 flex flex-col items-center">
            <label className="font-semibold">닉네임을 입력해주세요!</label>
            <input
              id="nickname"
              ref={idInputRef}
              type="text"
              className="input min-w-[300px] min-h-[40px] rounded-lg"
              value={id}
              onChange={e => setId(e.target.value)}
            />
          </div>
          {error && <div className="my-2 text-sm text-red-600">{error}</div>}
          <button
            className="mt-2 p-2 bg-brown-dark text-light-gray rounded-lg min-w-[300px] min-h-[40px]"
            onClick={handleSign2}
          >
            회원가입
          </button>
        </>
      )}
    </div>
  );
};

export default SignUpModal;
