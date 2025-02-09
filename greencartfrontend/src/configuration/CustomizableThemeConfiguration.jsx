    import React, { createContext, useContext, useState } from 'react';

    // Theme context
    const ThemeContext = createContext();

    // Default theme colors
    const defaultTheme = {
    primary: '#4CAF50',
    secondary: '#2E7D32',
    accent: '#81C784',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#333333',
    textLight: '#666666',
    border: '#E0E0E0',
    success: '#43A047',
    error: '#E53935',
    warning: '#FFB300',
    info: '#1E88E5'
    };

    export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(defaultTheme);

    const updateTheme = (newTheme) => {
        setTheme({ ...theme, ...newTheme });
        // Update CSS variables
        Object.entries({ ...theme, ...newTheme }).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme }}>
        {children}
        </ThemeContext.Provider>
    );
    };

    export const useTheme = () => useContext(ThemeContext);