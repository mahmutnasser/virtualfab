import { createContext, useContext } from 'react';

export interface LiveAnnouncerContextValue {
  announce: (message: string) => void;
}

export const LiveAnnouncerContext =
  createContext<LiveAnnouncerContextValue | null>(null);

export const useLiveAnnouncer = (): LiveAnnouncerContextValue => {
  const context = useContext(LiveAnnouncerContext);
  if (!context) {
    throw new Error(
      'useLiveAnnouncer must be used within a LiveAnnouncerProvider',
    );
  }
  return context;
};

export const useOptionalLiveAnnouncer = (): LiveAnnouncerContextValue | null => {
  return useContext(LiveAnnouncerContext);
};
