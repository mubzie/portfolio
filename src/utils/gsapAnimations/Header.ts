import gsap from 'gsap'


export default class HeaderAnimations {
    private styles: ModuleStylesType;
    themeIconTweenRef!: gsap.core.Tween;
    constructor(styles: ModuleStylesType) {
        this.styles = styles;
    }

    init() {
        this.animateThemeIcon()
    }

    toggleTheme(isDarkMode: boolean) {
        const lightWrapper = document.querySelector(".lightThemeWrapper") as HTMLDivElement;
        const darkWrapper = document.querySelector(".darkThemeWrapper") as HTMLDivElement;


        const tl = gsap.timeline({ defaults: { duration: .6 } })
        if (isDarkMode) {
            tl.to(lightWrapper, {
                translateY: "-30px",
                opacity: 0,
            }).to(darkWrapper,
                {
                    translateY: 0,
                    opacity: 1,
                    onComplete: () => {
                        gsap.to(lightWrapper, {
                            translateY: "-30px",
                            opacity: 0,
                            duration: 0.5
                        })
                    }
                }
            )
        } else {
            tl.to(darkWrapper, {
                translateY: "30px",
                opacity: 0,
            }).to(lightWrapper,
                {
                    translateY: 0,
                    opacity: 1,
                    onComplete: () => {
                        gsap.to(darkWrapper, {
                            translateY: "30px",
                            opacity: 0,
                            duration: 0.5
                        })
                    }
                }
            )
        }
    }

    private animateThemeIcon() {
        const paths = document.querySelectorAll(".themeIconPath");

        this.themeIconTweenRef = gsap.to(paths, {
            duration: 5,
            strokeDashoffset: "+=124",
            repeat: -1,
            repeatRefresh: true,
            repeatDelay: 0,
            delay: 0,
            ease: "linear"
        })
    }

    dispose() {
        this.themeIconTweenRef.kill();
    }
}