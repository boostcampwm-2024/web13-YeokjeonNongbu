import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalStep } from '@/constants/ModalConstants';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const pwCheckInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);

  const handleSign1 = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('유효한 이메일을 입력해주세요.');
      emailInputRef.current?.focus();
      return;
    }

    if (!password || password.length < 8 || password.length > 16) {
      setErrorMessage('비밀번호는 8자 이상, 16자 이하로 입력해주세요.');
      passwordInputRef.current?.focus();
      return;
    }

    if (password !== pwCheck) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      pwCheckInputRef.current?.focus();
      return;
    }

    setErrorMessage(null);
    setModalStep(ModalStep.SignUpStep2);
  };

  const handleSign2 = () => {
    if (!id || id.length < 2 || id.length > 10) {
      setErrorMessage('닉네임는 2자 이상, 10자 이하로 입력해주세요.');
      idInputRef.current?.focus();
      return;
    }

    setErrorMessage(null);

    // 아이디 검사 로직 추가 (백엔드에서 체크 필요)
    // 아이디가 존재하지 않으면 회원가입을 완료한다 (백엔드 작업 필요)

    navigate('/main');
  };

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
          {errorMessage && <div className="text-sm text-red-600 mb-4">{errorMessage}</div>}
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
          {errorMessage && <div className="my-2 text-sm text-red-600">{errorMessage}</div>}
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
