import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/main');
  };
    
  return (
    <div>
      <h1>인트로 페이지</h1>
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
};

export default Intro;
