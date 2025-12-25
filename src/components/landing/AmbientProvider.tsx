import { ReactNode, createContext, useContext, memo } from 'react';
import { useAmbientProvider, AmbientContext } from '@/hooks/useAmbientIntelligence';

interface AmbientProviderProps {
  children: ReactNode;
}

export const AmbientProvider = memo(({ children }: AmbientProviderProps) => {
  const ambientState = useAmbientProvider();
  
  return (
    <AmbientContext.Provider value={ambientState}>
      {children}
    </AmbientContext.Provider>
  );
});

AmbientProvider.displayName = 'AmbientProvider';
