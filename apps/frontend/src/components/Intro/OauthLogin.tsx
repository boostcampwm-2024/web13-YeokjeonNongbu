import { useEffect } from 'react';

const OauthLogin: React.FC = () => {
  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const nickname = urlParams.get('nickname');
      const accessToken = urlParams.get('accessToken');
      const refreshToken = urlParams.get('refreshToken');

      if (accessToken && refreshToken && nickname) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('nickname', nickname);

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
