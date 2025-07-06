import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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
  const [selectedPersona, setSelectedPersona] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [personas, setPersonas] = useState<string[]>([]);
  const [versions, setVersions] = useState<string[]>([]);

  // Load available personas on mount
  useEffect(() => {
    const loadPersonas = async () => {
      console.log('Loading personas...');
      console.log('GitHub repo:', localStorage.getItem('github_repo'));
      console.log('GitHub token exists:', !!localStorage.getItem('github_token'));
      
      try {
        const availablePersonas = await getAvailablePersonas();
        console.log('Available personas:', availablePersonas);
        setPersonas(availablePersonas);
        if (availablePersonas.length > 0 && !selectedPersona) {
          setSelectedPersona(availablePersonas[0]);
        }
      } catch (error) {
        console.error('Failed to load personas:', error);
        // Fallback to hardcoded list
        setPersonas(['klark_kent']);
        if (!selectedPersona) {
          setSelectedPersona('klark_kent');
        }
      }
    };
    
    loadPersonas();
  }, []);

  // Load versions when persona changes
  useEffect(() => {
    if (selectedPersona) {
      const loadVersions = async () => {
        try {
          const availableVersions = await getPersonaVersions(selectedPersona);
          setVersions(availableVersions);
          if (availableVersions.length > 0 && !selectedVersion) {
            setSelectedVersion(availableVersions[0]);
          }
        } catch (error) {
          console.error('Failed to load versions:', error);
          // Fallback to hardcoded list
          setVersions(['INITIAL']);
          if (!selectedVersion) {
            setSelectedVersion('INITIAL');
          }
        }
      };
      
      loadVersions();
    }
  }, [selectedPersona]);

  // Set default file when persona and version are available
  useEffect(() => {
    if (selectedPersona && selectedVersion && !selectedFile) {
      setSelectedFile(`/personas/${selectedPersona}/versions/${selectedVersion}/config/kontextbase_map.xml`);
    }
  }, [selectedPersona, selectedVersion]);

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