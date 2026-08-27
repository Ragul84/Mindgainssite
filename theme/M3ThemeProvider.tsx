import React, { createContext, useContext, useMemo } from 'react';
import { M3Colors, M3Typography, M3Shapes, M3Elevation, M3Motion, M3Layout } from './m3-tokens';

interface ThemeContextType {
  colors: typeof M3Colors;
  typography: typeof M3Typography;
  shapes: typeof M3Shapes;
  elevation: typeof M3Elevation;
  motion: typeof M3Motion;
  layout: typeof M3Layout;
}

const defaultTheme: ThemeContextType = {
  colors: M3Colors,
  typography: M3Typography,
  shapes: M3Shapes,
  elevation: M3Elevation,
  motion: M3Motion,
  layout: M3Layout,
};

const ThemeContext = createContext<ThemeContextType>(defaultTheme);

export const M3ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo(() => defaultTheme, []);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useM3Theme = () => {
  return useContext(ThemeContext);
};
