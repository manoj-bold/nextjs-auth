import { createContext, useContext, useState } from 'react';

const FlashMessageContext = createContext();

export function FlashMessageProvider({ children }) {
  const [message, setMessage] = useState(null);

  const setFlashMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 5000); // Message disappears after 5 seconds
  };

  return (
    <FlashMessageContext.Provider value={{ message, setFlashMessage }}>
      {children}
    </FlashMessageContext.Provider>
  );
}

export const useFlashMessage = () => useContext(FlashMessageContext);