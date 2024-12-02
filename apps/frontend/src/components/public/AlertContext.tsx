import { createContext, useState } from 'react';
import Alert from '@/components/public/Alert';

type Type = {
  alert: (message?: string) => Promise<boolean>;
};

export const AlertContext = createContext<Type>({
  alert: () => new Promise((_, reject) => reject())
});

type AlertState = {
  message: string;
  onClickOK: () => void;
  onClickCancel: () => void;
};

export const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AlertState>();

  const alert = (message?: string): Promise<boolean> => {
    return new Promise(resolve => {
      setState({
        message: message ?? '',
        onClickOK: () => {
          setState(undefined);
          resolve(true);
        },
        onClickCancel: () => {
          setState(undefined);
          resolve(false);
        }
      });
    });
  };

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      {state && <Alert message={state.message} onClickOK={state.onClickOK} />}
    </AlertContext.Provider>
  );
};
