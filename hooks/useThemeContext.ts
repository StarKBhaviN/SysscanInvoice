// hooks/useThemeContext.ts
import { Colors } from '@/constants/Colors';
import { ThemeContext } from '@/context/ThemeContext';
import { useContext } from 'react';

type ThemeType = typeof Colors.light;

interface ThemeContextType {
  colorScheme: 'light' | 'dark';
  setColorScheme: (value: 'light' | 'dark') => void;
  theme: ThemeType;
  toggleThemeMode: () => void;
}

export const useThemeContext = () => {
  return useContext(ThemeContext) as ThemeContextType;
};
