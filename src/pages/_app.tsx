import AppThemeProvider from '@/components/AppThemeProvider';
import useAppTheme from '@/components/AppThemeProvider';
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { useCallback, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);


  const updateDarkMode = useCallback((value: boolean) => setIsDarkMode(value), [])

  return (
    <AppThemeProvider value={isDarkMode} updateTheme={updateDarkMode}>
      <div className={`${isDarkMode ? "theme-default" : "theme-light"} `}>
        <div className='appTheme'>
          <Component {...pageProps} />
        </div>
      </div>
    </AppThemeProvider>



  )
}
