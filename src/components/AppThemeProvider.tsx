import React, { useContext, useEffect, useState } from 'react'

interface AppThemeProviderType {
    children: JSX.Element,
    value: boolean,
    updateTheme: (value: boolean) => void
}

type ThemeType = [boolean, AppThemeProviderType["updateTheme"]]

const ThemeContext = React.createContext<ThemeType | null>(null);

function AppThemeProvider({ children, value, updateTheme }: AppThemeProviderType) {

    return (
        <ThemeContext.Provider value={[value, updateTheme] as ThemeType}>
            {children}
        </ThemeContext.Provider>
    )
}

export default AppThemeProvider

export const useAppTheme = () => useContext(ThemeContext) as ThemeType;