import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { config, PortfolioConfig } from "../config";

const STORAGE_KEY = "ajith-portfolio-admin-v1";

interface PortfolioContextType {
  portfolio: PortfolioConfig;
  setPortfolio: Dispatch<SetStateAction<PortfolioConfig>>;
  resetPortfolio: () => void;
  importPortfolio: (nextPortfolio: PortfolioConfig) => void;
}

const clonePortfolio = (value: PortfolioConfig): PortfolioConfig =>
  JSON.parse(JSON.stringify(value)) as PortfolioConfig;

const loadPortfolio = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return clonePortfolio(config);
    const parsed = JSON.parse(stored) as Partial<PortfolioConfig>;
    const defaults = clonePortfolio(config);
    return {
      ...defaults,
      ...parsed,
      developer: { ...defaults.developer, ...parsed.developer },
      social: { ...defaults.social, ...parsed.social },
      about: { ...defaults.about, ...parsed.about },
      contact: { ...defaults.contact, ...parsed.contact },
      skills: {
        develop: { ...defaults.skills.develop, ...parsed.skills?.develop },
        design: { ...defaults.skills.design, ...parsed.skills?.design },
      },
      projects: parsed.projects ?? defaults.projects,
      experiences: parsed.experiences ?? defaults.experiences,
      techStack: parsed.techStack ?? defaults.techStack,
    } as PortfolioConfig;
  } catch {
    return clonePortfolio(config);
  }
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider = ({ children }: PropsWithChildren) => {
  const [portfolio, setPortfolio] = useState<PortfolioConfig>(loadPortfolio);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  const value = useMemo(
    () => ({
      portfolio,
      setPortfolio,
      resetPortfolio: () => setPortfolio(clonePortfolio(config)),
      importPortfolio: (nextPortfolio: PortfolioConfig) =>
        setPortfolio({ ...clonePortfolio(config), ...nextPortfolio }),
    }),
    [portfolio]
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
