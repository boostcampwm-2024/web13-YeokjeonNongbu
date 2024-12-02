import { useEffect } from 'react';
import { useUser } from '@/components/public/UserContext';

const OauthLogin: React.FC = () => {
  const { setNickname } = useUser();

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const nickname = urlParams.get('nickname');
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');

      if (accessToken && refreshToken && nickname) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setNickname(nickname);

        setTimeout(() => {
          window.location.href = '/main';
        }, 100);
      }
    };

    if (window.location.search.includes('accessToken=')) {
      handleCallback();
    }
  }, []);

  return <></>;
};

export default OauthLogin;
