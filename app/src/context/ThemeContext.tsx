import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, ColorTheme } from '../constants/theme';

type ThemeContextType = {
    isDarkMode: boolean;
    toggleTheme: () => void;
    colors: ColorTheme;
};

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: true,
    toggleTheme: () => { },
    colors: COLORS.dark,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

    // Sync with system initially, but allow override
    useEffect(() => {
        if (systemScheme) {
            setIsDarkMode(systemScheme === 'dark');
        }
    }, [systemScheme]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const colors = isDarkMode ? COLORS.dark : COLORS.light;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
            <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
