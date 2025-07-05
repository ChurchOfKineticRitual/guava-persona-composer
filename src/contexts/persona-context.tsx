import { createContext, useContext, useState, ReactNode } from 'react';

interface PersonaContextType {
  selectedPersona: string;
  selectedVersion: string;
  setSelectedPersona: (persona: string) => void;
  setSelectedVersion: (version: string) => void;
  personas: string[];
  versions: string[];
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};

export const PersonaProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPersona, setSelectedPersona] = useState('klark_kent');
  const [selectedVersion, setSelectedVersion] = useState('INITIAL');
  
  // Available personas (would be loaded from GitHub in real implementation)
  const personas = ['klark_kent'];
  
  // Available versions for selected persona (would be loaded from GitHub in real implementation)
  const versions = ['INITIAL'];

  return (
    <PersonaContext.Provider
      value={{
        selectedPersona,
        selectedVersion,
        setSelectedPersona,
        setSelectedVersion,
        personas,
        versions,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
};