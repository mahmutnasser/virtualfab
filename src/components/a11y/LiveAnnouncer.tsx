import React, { useState, useRef, useEffect, useCallback } from 'react';
import { LiveAnnouncerContext } from './LiveAnnouncerContext';

export const LiveAnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<string>('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((newMessage: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Briefly clear so consecutive identical messages are announced
    setMessage('');
    timeoutRef.current = setTimeout(() => {
      setMessage(newMessage);
      timeoutRef.current = setTimeout(() => {
        setMessage('');
      }, 5000);
    }, 30);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <LiveAnnouncerContext.Provider value={{ announce }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="live-announcer"
      >
        {message}
      </div>
    </LiveAnnouncerContext.Provider>
  );
};

export const LiveAnnouncer: React.FC<{ message?: string }> = ({
  message = '',
}) => (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
    data-testid="live-announcer"
  >
    {message}
  </div>
);

export default LiveAnnouncerProvider;
