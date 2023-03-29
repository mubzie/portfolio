import gsap from 'gsap'
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ScrollToPlugin } from "gsap/dist/ScrollToPlugin";
import { createDebounceFunc, sortElementInnerText } from './chunks';
import WebglExperience from '../webGL';
import MouseHoverEffect from './MouseHoverEffect';
import LocomotiveScroll from "locomotive-scroll"
import { MouseEvent } from 'react';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollToPlugin);

export class HomePageAnimation {
    private styles: ModuleStylesType;
    asideNavScrollTriggerRef: globalThis.ScrollTrigger[];
    worksRefs!: gsap.core.Tween[];
    mouseHoverEffect: MouseHoverEffect;
    webglExperience: WebglExperience;
    isMobileScreen: boolean = false;
    locoScroll!: LocomotiveScroll;
    gsapContext: gsap.Context[] = []
    constructor(styles: ModuleStylesType,) {
        this.styles = styles;
        this.worksRefs = [];


        this.mouseHoverEffect = new MouseHoverEffect();
        this.webglExperience = new WebglExperience(this.mouseHoverEffect);
        this.asideNavScrollTriggerRef = [];

        this.mouseHoverEffect.init();
        if (window.innerWidth < 768) {
            this.isMobileScreen = true;
            this.mouseHoverEffect.toggleVisibility("hide")
        }
        // ScrollTrigger.defaults({ scroller: ".appTheme" });


        this.webglExperience.init();
        this.resizeCallback = this.resizeCallback.bind(this);
        this.updateLocomotiveScroll = this.updateLocomotiveScroll.bind(this)
        this.animateWorks = createDebounceFunc(this.animateWorks.bind(this), 500)

        window.addEventListener("resize", this.resizeCallback);
        // ScrollTrigger.addEventListener("refresh", this.updateLocomotiveScroll);
    }

    init() {

        this.animateAbout();
        this.animateContacts();
        this.animateAside();
        this.animateWorks();

        ScrollTrigger.refresh()
    }

    updateLocomotiveScroll() {
        if (this.locoScroll) {
            console.log("updated")
            // this.locoScroll.update()
        }
    }


    private animateWorks() {
        this.gsapContext.push(
            gsap.context(() => {
                this.worksRefs = []
                const workList = document.querySelectorAll(`.${this.styles.worksProjects} > ul > li`);

                if (!this.isMobileScreen) {
                    workList.forEach((item, i) => {
                        this.worksRefs.push(
                            gsap.fromTo(
                                item,
                                {
                                    opacity: 0,
                                    translateX: () => {
                                        if (i % 2 === 0) return "-220"
                                        else return "220"
                                    },
                                },
                                {
                                    opacity: 1,
                                    translateX: 0,
                                    scrollTrigger: {
                                        trigger: item,
                                        toggleActions: "play none none reverse"
                                        // scrub: 0.0001,
                                        // markers: true,
                                        // start: "top bottom",
                                        // end: "bottom 60%",
                                    }
                                }
                            )
                        )
                    })
                }
            })
        )




    }

    animateProjectImgOnHover(element: HTMLElement, type: "enter" | "leave", index: number) {
        console.log(element, type)
        this.gsapContext.push(
            gsap.context(() => {
                const spanWrapper = element.querySelector(`.${this.styles.projectContentImgOverlay}`)
                const filterTurbulence = document.getElementsByClassName(`image-turbulence-${index}`);
                const filterDisplacement = document.getElementsByClassName(`image-displacement-${index}`);

                const tl = gsap.timeline({ defaults: { duration: 1 } })


                if (type === "enter") {
                    tl.to(
                        spanWrapper,
                        {
                            clipPath: "circle(200% at 0% 0%)"
                        }
                    ).to(
                        filterTurbulence,
                        {
                            attr: { baseFrequency: "0.0 0.0" }
                        },
                        "<0.1"
                    ).to(
                        filterDisplacement,
                        {
                            attr: { scale: 0 }
                        },
                        "<"
                    )
                } else {
                    tl.to(
                        filterTurbulence,
                        {
                            attr: { baseFrequency: "0.05 0.07" }
                        },
                    ).to(
                        filterDisplacement,
                        {
                            attr: { scale: 50 }
                        },
                        "<"
                    ).to(
                        spanWrapper,
                        {
                            clipPath: "circle(0% at 0% 0%)"
                        },
                        "<0.1"
                    )
                }
            })
        )

    }

    animateProjects(id: string, index: number) {
        this.gsapContext.push(
            gsap.context(() => {
                const currentActiveContent = document.querySelector(`.${this.styles.projectContent}.open`) as HTMLElement;
                const clickedContent = document.getElementById(id)!;
                const clickedContentSpan = clickedContent.querySelector(`.${this.styles.projectContentImg}`) as HTMLElement

                // console.log(spanWrapperInner)

                // Close all other open projects
                if (currentActiveContent) {
                    const currentActiveContentSpan = currentActiveContent.querySelector(`.${this.styles.projectContentImg}`) as HTMLElement
                    gsap.to(
                        currentActiveContent,
                        {
                            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                            height: "0",
                            duration: 0.5,
                            onComplete: () => {
                                currentActiveContent.classList.remove("open");
                                this.asideNavScrollTriggerRef.forEach(ref => {
                                    ref.refresh();
                                })
                                if (this.webglExperience.isMobileScreen) {
                                    this.animateProjectImgOnHover(currentActiveContentSpan, "leave", index)
                                }


                            }
                        }
                    )
                }




                if (!clickedContent.classList.contains("open")) {
                    gsap.to(
                        clickedContent,
                        {
                            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                            height: "auto",
                            duration: 0.6,
                            onComplete: () => {

                                clickedContent.classList.add("open");

                                if (this.isMobileScreen) {
                                    this.animateProjectImgOnHover(clickedContentSpan, "enter", index)
                                }
                                this.asideNavScrollTriggerRef.forEach(ref => {
                                    ref.refresh()
                                })
                                gsap.to(
                                    window,
                                    {
                                        duration: 1,
                                        scrollTo: {
                                            y: clickedContent,
                                            offsetY: 80
                                        },
                                    }
                                );
                            }
                        }
                    )
                }
            })
        )


    }


    private animateAbout() {
        this.gsapContext.push(
            gsap.context(() => {
                // Header Animation
                const headerText = document.querySelector(`.${this.styles.about} > h1`) as HTMLElement;
                const sortedHeaderText = sortElementInnerText(headerText, "aboutHeader", "word")

                const tl = gsap.timeline({ defaults: { duration: 1 } });
                tl.fromTo(
                    sortedHeaderText.sortedWords,
                    {
                        rotateX: "180deg",
                        opacity: 0,
                        transformOrigin: "left center"
                    },
                    {
                        rotateX: "0deg",
                        opacity: 1,
                        stagger: {
                            each: 0.2,
                            from: "random",
                            // ease: "power2.inOut",
                        },
                    }
                )

                // Cv summary animation
                const cvSummaryContent = document.querySelectorAll(`.${this.styles.cvSummaryContent}`);
                cvSummaryContent.forEach(el => {
                    gsap.to(
                        el,
                        {
                            left: 0,
                            scale: 1,
                            duration: 1,
                            delay: 0.5,
                            opacity: 1,
                            scrollTrigger: {
                                trigger: el,
                                // markers: true,
                                toggleActions: "play none none reverse",
                                start: "50% bottom",
                                end: "+=100 top"
                            }
                        }
                    )
                })


                // Download Full Cv Button animation
                const downloadFullCvbtn = document.querySelector(`.${this.styles.about} > a`);

                gsap.to(
                    downloadFullCvbtn,
                    {
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                        duration: .5,
                        scrollTrigger: {
                            trigger: downloadFullCvbtn,
                            // markers: true,
                            toggleActions: "play none none reverse",
                            start: "top 85%"
                        }
                    }
                )
            })
        )



    }

    private animateAside() {
        this.gsapContext.push(
            gsap.context(() => {
                const asideLinks = document.querySelectorAll(`.${this.styles.aside} > nav > div`)

                // About Section
                const aboutSec = document.querySelector(`.${this.styles.about}`)!;
                const aboutNav = document.querySelector(`.aboutNav`)!;
                const aboutSecH2 = document.querySelector(".aboutNav > h2");
                const aboutNavIcon = document.querySelector(`.aboutNav .${this.styles.asideNavIcons}`);
                const aboutTimeline = gsap.timeline({ defaults: { duration: .5, ease: "power1.in" } })

                aboutTimeline.to(aboutNavIcon,
                    {
                        opacity: 1,
                    }
                ).to(aboutSecH2,
                    {
                        translateX: "10px",
                        opacity: 1,
                        onComplete: () => {
                            if (!aboutNav.classList.contains("active")) {
                                asideLinks.forEach(link => link.classList.remove("active"))
                                aboutNav.classList.add("active")
                            }

                        }
                    },
                    "<"
                )

                this.asideNavScrollTriggerRef.push(
                    ScrollTrigger.create({
                        animation: aboutTimeline,
                        trigger: aboutSec,
                        // markers: true,
                        start: "top 70%",
                        invalidateOnRefresh: true,
                        end: "bottom 70%",
                        // end: "+=125% 70%",
                        toggleActions: "play reverse play reverse"
                    })
                )


                // Work section
                const workSec = document.querySelector(`.${this.styles.works}`)!;
                const workNav = document.querySelector(`.workNav`)!;
                const workSecH2 = document.querySelector(".workNav > h2");
                const workNavIcon = document.querySelector(`.workNav .${this.styles.asideNavIcons}`);
                const workTimeline = gsap.timeline({ defaults: { duration: .5, ease: "power1.in" } })


                workTimeline.to(workNavIcon,
                    {
                        opacity: 1,
                    }
                ).to(workSecH2,
                    {
                        translateX: "10px",
                        opacity: 1,
                        onComplete: () => {
                            if (!workNav.classList.contains("active")) {
                                asideLinks.forEach(link => link.classList.remove("active"))
                                workNav.classList.add("active")
                            }

                        }
                    },
                    "<"
                )

                this.asideNavScrollTriggerRef.push(
                    ScrollTrigger.create({
                        animation: workTimeline,
                        trigger: workSec,
                        // markers: true,
                        invalidateOnRefresh: true,
                        start: "top 60%",
                        end: "+=105% 60%",
                        toggleActions: "play reverse play reverse"
                    })
                )


                // Contact section
                const contactSec = document.querySelector(`.${this.styles.contact}`)!;
                const contactNav = document.querySelector(".contactNav")!;
                const contactSecH2 = document.querySelector(".contactNav > h2");
                const contactNavIcon = document.querySelector(`.contactNav .${this.styles.asideNavIcons}`);
                const contactTimeline = gsap.timeline({ defaults: { duration: .5, ease: "power1.in" } })


                contactTimeline.to(contactNavIcon,
                    {
                        opacity: 1,
                    }
                ).to(contactSecH2,
                    {
                        translateX: "10px",
                        opacity: 1,
                        onComplete: () => {
                            if (!contactNav.classList.contains("active")) {
                                asideLinks.forEach(link => link.classList.remove("active"))
                                contactNav.classList.add("active")
                            }

                        }
                    },
                    "<"
                )

                this.asideNavScrollTriggerRef.push(
                    ScrollTrigger.create({
                        animation: contactTimeline,
                        trigger: contactSec,
                        start: "top 87%",
                        end: "bottom top",
                        // markers: true,
                        invalidateOnRefresh: true,
                        toggleActions: "play reverse play reverse"
                    })
                )
            })
        )



    }

    handleAsideAboutClick() {
        const aboutNav = document.querySelector(`.aboutNav`) as HTMLDivElement;
        if (aboutNav.classList.contains("active")) return;
        gsap.to(
            window,
            {
                duration: 1,
                scrollTo: {
                    y: 0,
                    // offsetY: 120
                },
            }
        );
        // this.locoScroll.scrollTo("top", { duration: 2000 })

    }
    handleAsideWorkClick() {
        const workNav = document.querySelector(`.workNav`) as HTMLDivElement;
        if (workNav.classList.contains("active")) return;
        gsap.to(
            window,
            {
                duration: 1,
                scrollTo: {
                    y: "#works",
                    offsetY: 150
                },
            }
        );
        // this.locoScroll.scrollTo("#works", { duration: 2000, offset: -100 })

    }
    handleAsideContactClick() {
        const contactNav = document.querySelector(".contactNav") as HTMLDivElement;
        if (contactNav.classList.contains("active")) return;
        gsap.to(
            window,
            {
                duration: 1,
                scrollTo: {
                    y: "#contact",
                    offsetY: 0
                },
            }
        );
        // this.locoScroll.scrollTo("bottom", { duration: 2000 })

    }

    private animateContacts() {
        this.gsapContext.push(
            gsap.context(() => {
                const contactHeader = document.querySelector(`.${this.styles.contact} > h2`) as HTMLElement;
                sortElementInnerText(contactHeader, "contactHeader", "char")
                const sortedChars = document.querySelectorAll(".contactHeader");


                gsap.fromTo(
                    sortedChars,
                    {
                        rotateX: "90deg",
                        opacity: 0
                    },
                    {
                        duration: 1,
                        rotateX: "0deg",
                        opacity: 1,
                        stagger: {
                            each: 0.1,
                            from: "center"
                        },
                        scrollTrigger: {
                            trigger: contactHeader,
                            toggleActions: "play none none reverse",
                            start: "40px bottom",
                            end: "+=40px 80%",
                            // markers: true
                        }
                    }
                )
            })
        )

    }



    resizeCallback() {
        this.isMobileScreen = window.innerWidth < 768 ? true : false;
        this.asideNavScrollTriggerRef.forEach(ref => {
            ref.refresh()
        })
        ScrollTrigger.refresh()

        if (this.isMobileScreen) {
            this.worksRefs.forEach(ref => ref.kill())
            this.animateWorks();
            this.mouseHoverEffect.toggleVisibility("hide")

        } else if (!this.isMobileScreen) {
            this.worksRefs.forEach(ref => ref.kill())
            this.animateWorks();
            this.mouseHoverEffect.toggleVisibility("show")
        }
    }


    dispose() {
        console.log("dispose called")
        this.mouseHoverEffect.dispose()
        this.worksRefs.forEach(ref => ref.kill())
        ScrollTrigger.killAll();
        ScrollTrigger.removeEventListener("refresh", this.updateLocomotiveScroll)
        this.webglExperience.dispose();

        // if (this.locoScroll) this.locoScroll.destroy();
        window.removeEventListener("resize", this.resizeCallback)

        this.gsapContext.forEach(ctx => ctx.revert())

    }
}