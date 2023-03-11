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
      <div className={`${isDarkMode ? "theme-default" : "theme-light"} themes `}>
        <div className='appTheme'>
          <Component {...pageProps} />

          <div className='waveWrapper'>
            <div className='wave' />
            <div className='wave' />
          </div>
        </div>
        <canvas className='webgl_canvas' />

      </div>
    </AppThemeProvider>



  )
}
