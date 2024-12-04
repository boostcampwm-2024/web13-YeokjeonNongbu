import { getCash, getOwnCropsValue } from '@/services/AccountApi';
import { isLoggedIn } from '@/services/AuthApi';
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface UserContextType {
  nickname: string;
  availableCash: number;
  totalAssets: number;
  totalCash: number;
  currentValue: number;
  setNickname: (nickname: string) => void;
  setAvailableCash: (availableCash: number) => void;
  setTotalCash: (totalCash: number) => void;
  setCurrentValue: (currentValue: number) => void;
  setTotalAssets: (totalAssets: number) => void;
  fetch: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [nickname, setNickname] = useState<string>(() => {
    const savedNickname = localStorage.getItem('nickname');
    return savedNickname || '';
  });
  const [availableCash, setAvailableCash] = useState<number>(0);
  const [totalCash, setTotalCash] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const location = useLocation();

  const fetchCash = useCallback(async () => {
    try {
      const response = await getCash();
      if (response.success && response.totalCash && response.availableCash) {
        setAvailableCash(response.availableCash);
        setTotalCash(response.totalCash);
      }
    } catch (error) {
      console.error('fetch 에러', error);
    }
  }, []);

  const fetchCurrentValue = useCallback(async () => {
    try {
      const response = await getOwnCropsValue();
      if (response.success && response.value) {
        setCurrentValue(response.value);
      }
    } catch (error) {
      console.error('fetch 에러', error);
    }
  }, []);

  const fetch = () => {
    fetchCash();
    fetchCurrentValue();
  };

  useEffect(() => {
    if (nickname) localStorage.setItem('nickname', nickname);
  }, [nickname]);

  useEffect(() => {
    setTotalAssets(totalCash + currentValue);
  }, [totalCash, currentValue]);

  useEffect(() => {
    if (isLoggedIn()) {
      fetch();
      setNickname(() => {
        const savedNickname = localStorage.getItem('nickname');
        return savedNickname || '';
      });
    }
  }, [fetchCash, fetchCurrentValue, location, nickname]);

  return (
    <UserContext.Provider
      value={{
        nickname,
        availableCash,
        totalAssets,
        totalCash,
        currentValue,
        setNickname,
        setAvailableCash,
        setTotalAssets,
        setTotalCash,
        setCurrentValue,
        fetch
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
