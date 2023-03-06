import React, { useEffect, useRef } from 'react'
import styles from '@/styles/Header.module.scss'
import { useAppTheme } from './AppThemeProvider'
import HeaderAnimations from '@/utils/gsapAnimations/header';

function Header() {
    const [isDarkMode, setIsDarkMode] = useAppTheme();
    const animation = useRef<HeaderAnimations | null>(null)


    useEffect(() => {
        animation.current = new HeaderAnimations(styles);
        animation.current?.init()

        return () => animation.current?.dispose()
    }, [])
    useEffect(() => {
        const scrollCallBack = (e: Event) => {
            const headerWrapper = document.querySelector(`.${styles.wrapper}`)!;
            if (Math.floor(window.scrollY) > 10) {
                headerWrapper.classList.add(styles.active);
            } else {
                headerWrapper.classList.remove(styles.active);
            }
        }

        window.addEventListener("scroll", scrollCallBack);

        return () => window.removeEventListener("scroll", scrollCallBack);
    }, [])


    return (
        <div className={`${styles.wrapper} ${isDarkMode ? "theme-default" : "theme-light"} active `}>
            <div className={styles.logo}>
                <span>Ye</span>
                <span></span>
                <span>Mi.</span>
            </div>
            <div
                onClick={() => {
                    setIsDarkMode(!isDarkMode);
                    animation.current?.toggleTheme(isDarkMode);
                }}
                className={styles.theme}>
                <div className='lightThemeWrapper'>
                    <span className={styles.themeIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="22"
                                strokeDashoffset="0"
                                className='themeIconPath'
                                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                        </svg>
                    </span>
                    <span className={styles.themeText}>Light</span>
                </div>
                <div className='darkThemeWrapper'>
                    <span className={styles.themeIcon}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeDasharray="63px"
                                strokeDashoffset="126px"
                                className='themeIconPath'
                                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>

                    </span>
                    <span className={styles.themeText}>Dark</span>
                </div>

            </div>
        </div>
    )
}

export default Header