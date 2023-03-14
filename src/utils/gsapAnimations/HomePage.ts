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
    constructor(styles: ModuleStylesType, locoScroll: LocomotiveScroll) {
        this.styles = styles;
        this.worksRefs = [];

        this.locoScroll = locoScroll;
        this.mouseHoverEffect = new MouseHoverEffect();
        this.webglExperience = new WebglExperience(this.mouseHoverEffect);
        this.asideNavScrollTriggerRef = [];
        if (window.innerWidth < 768) this.isMobileScreen = true;

        this.mouseHoverEffect.init();
        this.webglExperience.init();
        this.resizeCallback = this.resizeCallback.bind(this);
        this.animateWorks = createDebounceFunc(this.animateWorks.bind(this), 500)
        this.updateLocomotiveScroll = this.updateLocomotiveScroll.bind(this)

        window.addEventListener("resize", this.resizeCallback);
    }

    init() {
        this.setUpSmoothScrolling()
        this.animateAbout();
        this.animateContacts();
        this.animateAside();
        this.animateWorks();


    }

    private setUpSmoothScrolling() {

        // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
        this.locoScroll.on("scroll", ScrollTrigger.update);
        const HomePageAnimation = this
        // console.log((HomePageAnimation.locoScroll as any).scroll.instance.scroll.y)

        // tell ScrollTrigger to use these proxy methods for the "scrollContainer" element since Locomotive Scroll is hijacking things
        ScrollTrigger.scrollerProxy((this.locoScroll as any).el, {
            scrollTop(value) {
                if (arguments.length) {

                    return HomePageAnimation.locoScroll.scrollTo(value!, { duration: 0.5 })

                } else {
                    return (HomePageAnimation.locoScroll as any).scroll.instance.scroll.y
                }
            }, // we don't have to define a scrollLeft because we're only scrolling vertically.
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
            pinType: (this.locoScroll as any).el.style.transform ? "transform" : "fixed"
        }
        )
        ScrollTrigger.addEventListener("refresh", this.updateLocomotiveScroll);
        ScrollTrigger.defaults({ scroller: (this.locoScroll as any).el });

    }
    updateLocomotiveScroll() {
        this.locoScroll.update()
    }
    private animateWorks() {

        const workList = document.querySelectorAll(`.${this.styles.worksProjects} > ul > li`);

        workList.forEach((item, i) => {
            this.worksRefs.push(
                gsap.fromTo(
                    item,
                    {
                        opacity: 0,
                        translateX: () => {
                            if (i % 2 === 0) return "-120"
                            else return "120"
                        },
                    },
                    {
                        opacity: 1,
                        translateX: 0,
                        scrollTrigger: {
                            trigger: item,
                            scrub: this.webglExperience.isMobileScreen ? false : 0.0001,
                        }
                    }
                )
            )
        })

    }

    animateProjectImgOnHover(element: HTMLElement, type: "enter" | "leave") {
        const spanWrapper = element.querySelector(`.${this.styles.projectContentImgOverlay}`)
        const filterTurbulence = document.getElementById("image-turbulence");
        const filterDisplacement = document.getElementById("image-displacement");

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
    }

    animateProjects(id: string) {
        let contentsArray = document.querySelectorAll(`.${this.styles.projectContent}`)
        const content = document.getElementById(id)!;
        const spanWrapperInner = content.querySelector(`.${this.styles.projectContentImg}`) as HTMLElement
        let inactiveContent = Array.from(contentsArray).filter(item => item !== content)


        // Close all other open projects
        // gsap.to(
        //     inactiveContent,
        //     {
        //         clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
        //         height: "0",
        //         duration: 0.5,
        //         onComplete: () => {
        //             inactiveContent.forEach(content => content.classList.remove("open"));
        //             this.asideNavScrollTriggerRef.forEach(ref => {
        //                 ref.refresh();
        //             })
        //             if (this.webglExperience.isMobileScreen) {
        //                 this.animateProjectImgOnHover(spanWrapperInner, "leave")
        //             }

        //         }
        //     }
        // )



        if (content.classList.contains("open")) {
            gsap.to(
                content,
                {
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                    height: "0",
                    duration: 0.5,
                    onComplete: () => {
                        content.classList.remove("open");
                        this.asideNavScrollTriggerRef.forEach(ref => {
                            ref.refresh();
                        })
                        if (this.isMobileScreen) {
                            this.animateProjectImgOnHover(spanWrapperInner, "leave")
                        }

                    }
                }
            )
        } else {
            gsap.to(
                content,
                {
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    height: "auto",
                    duration: 0.5,
                    onComplete: () => {
                        content.classList.add("open");
                        this.asideNavScrollTriggerRef.forEach(ref => {
                            ref.refresh()
                        })
                        if (this.isMobileScreen) {
                            this.animateProjectImgOnHover(spanWrapperInner, "enter")
                        }
                    }
                }
            )
        }

    }


    private animateAbout() {
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


    }

    private animateAside() {
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
                    asideLinks.forEach(link => link.classList.remove("active"))
                    aboutNav.classList.add("active")
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
                end: "+=125% 70%",
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
                    asideLinks.forEach(link => link.classList.remove("active"))
                    workNav.classList.add("active")
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
                start: "top 70%",
                end: "bottom 70%",
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
                    asideLinks.forEach(link => link.classList.remove("active"))
                    contactNav.classList.add("active")
                }
            },
            "<"
        )

        this.asideNavScrollTriggerRef.push(
            ScrollTrigger.create({
                animation: contactTimeline,
                trigger: contactSec,
                start: "top 97%",
                end: "bottom top",
                // markers: true,
                invalidateOnRefresh: true,
                toggleActions: "play reverse play reverse"
            })
        )


    }

    handleAsideAboutClick() {
        const aboutNav = document.querySelector(`.aboutNav`)!;
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
    }
    handleAsideWorkClick() {
        const workNav = document.querySelector(`.workNav`)!;
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
    }
    handleAsideContactClick() {
        const contactNav = document.querySelector(".contactNav")!;
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
    }

    private animateContacts() {
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
    }



    resizeCallback() {
        window.innerWidth < 768 ? this.isMobileScreen = true : this.isMobileScreen = false;
        this.asideNavScrollTriggerRef.forEach(ref => {
            ref.refresh()
        })

        if (this.isMobileScreen) {
            this.worksRefs.forEach(ref => ref.kill())
            this.animateWorks();
            gsap.to(
                this.mouseHoverEffect.mouseHoverdiv,
                {
                    scale: 0,
                }
            )

        } else if (!this.isMobileScreen) {
            this.worksRefs.forEach(ref => ref.kill())
            this.animateWorks();
            gsap.to(
                this.mouseHoverEffect.mouseHoverdiv,
                {
                    scale: 1,
                }
            )
        }
    }


    dispose() {
        ScrollTrigger.removeEventListener("refresh", this.updateLocomotiveScroll);
        ScrollTrigger.killAll();
        this.webglExperience.dispose()

        window.removeEventListener("resize", this.resizeCallback)
        this.mouseHoverEffect.dispose()
    }
}