import { createContext, useContext, useState, ReactNode } from 'react';
import { getAvailablePersonas, getPersonaVersions } from '@/utils/file-system';

interface PersonaContextType {
  selectedPersona: string;
  selectedVersion: string;
  selectedFile: string | null;
  setSelectedPersona: (persona: string) => void;
  setSelectedVersion: (version: string) => void;
  setSelectedFile: (file: string | null) => void;
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
  const [selectedFile, setSelectedFile] = useState<string | null>('/personas/klark_kent/versions/INITIAL/config/kontextbase_map.xml');
  
  // Available personas - will be loaded dynamically in future
  const personas = ['klark_kent'];
  
  // Available versions for selected persona - will be loaded dynamically in future  
  const versions = ['INITIAL'];

  return (
    <PersonaContext.Provider
      value={{
        selectedPersona,
        selectedVersion,
        selectedFile,
        setSelectedPersona,
        setSelectedVersion,
        setSelectedFile,
        personas,
        versions,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
};