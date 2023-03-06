import gsap from 'gsap'
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { sortElementInnerText } from './chunks';

gsap.registerPlugin(ScrollTrigger)

export class HomePageAnimation {
    private styles: ModuleStylesType
    loopLegendElRef!: gsap.core.Tween;
    asideNavScrollTriggerRef: globalThis.ScrollTrigger[]
    constructor(styles: ModuleStylesType) {
        this.styles = styles;
        this.asideNavScrollTriggerRef = [];

        this.resizeCallback = this.resizeCallback.bind(this)

        window.addEventListener("resize", this.resizeCallback);
    }

    init() {
        this.animateAbout();
        this.animateContacts();
        this.animateAside();
        this.animateWorks();


    }

    private animateWorks() {
        const workList = document.querySelectorAll(`.${this.styles.worksProjects} > ul > li`);

        workList.forEach((item, i) => {
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
                        scrub: 0.2
                    }
                }
            )
        })

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

        // Legend element loop animation
        const legendEl = document.querySelector(`.${this.styles.about} fieldset > legend `) as HTMLLegendElement
        this.loopLegendElRef = gsap.to(
            legendEl,
            {
                duration: 3,
                marginLeft: "50%",
                yoyo: true,
                repeat: -1,
                yoyoEase: true
            }
        )

        // Download Full Cv Button animation
        const downloadFullCvbtn = document.querySelector(`.${this.styles.about} > button`);

        gsap.to(
            downloadFullCvbtn,
            {
                height: "50px",
                duration: .5,
                scrollTrigger: {
                    trigger: downloadFullCvbtn,
                    toggleActions: "play none none reverse",
                    start: "top 70%"
                }
            }
        )

    }

    private animateAside() {


        // About Section
        const aboutSec = document.querySelector(`.${this.styles.about}`)!;
        const aboutNav = document.querySelector(`.aboutNav`)!;
        const aboutSecH2 = document.querySelector(".aboutNav > h2");
        const aboutNavIcon = document.querySelector(`.aboutNav .${this.styles.asideNavIcons}`);
        const aboutTimeline = gsap.timeline({ defaults: { duration: .5, ease: "linear" } })

        aboutTimeline.to(aboutNavIcon,
            {
                opacity: 1,
            }
        ).to(aboutSecH2,
            {
                translateX: "10px"
            },
            "<"
        )

        this.asideNavScrollTriggerRef.push(
            ScrollTrigger.create({
                animation: aboutTimeline,
                trigger: aboutSec,
                start: "top 90%",
                end: "bottom 90%",
                toggleActions: "play reverse play reverse"
            })
        )

        aboutNav.addEventListener("click", () => {
            document.documentElement.style.scrollBehavior = "smooth"
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
        })

        // Work section
        const workSec = document.querySelector(`.${this.styles.works}`)!;
        const workNav = document.querySelector(`.workNav`)!;
        const workSecH2 = document.querySelector(".workNav > h2");
        const workNavIcon = document.querySelector(`.workNav .${this.styles.asideNavIcons}`);
        const workTimeline = gsap.timeline({ defaults: { duration: .5, ease: "linear" } })


        workTimeline.to(workNavIcon,
            {
                opacity: 1,
            }
        ).to(workSecH2,
            {
                translateX: "10px"
            },
            "<"
        )

        this.asideNavScrollTriggerRef.push(
            ScrollTrigger.create({
                animation: workTimeline,
                trigger: workSec,
                // markers: true,
                start: "top 90%",
                end: "bottom 90%",
                toggleActions: "play reverse play reverse"
            })
        )

        workNav.addEventListener("click", () => {
            workSec.scrollIntoView({ behavior: "smooth", block: "center" })
        })

        // Contact section
        const contactSec = document.querySelector(`.${this.styles.contact}`)!;
        const contactNav = document.querySelector(".contactNav")!;
        const contactSecH2 = document.querySelector(".contactNav > h2");
        const contactNavIcon = document.querySelector(`.contactNav .${this.styles.asideNavIcons}`);
        const contactTimeline = gsap.timeline({ defaults: { duration: .5, ease: "linear" } })


        contactTimeline.to(contactNavIcon,
            {
                opacity: 1,
            }
        ).to(contactSecH2,
            {
                translateX: "10px"
            },
            "<"
        )

        this.asideNavScrollTriggerRef.push(
            ScrollTrigger.create({
                animation: contactTimeline,
                trigger: contactSec,
                start: "top 90%",
                end: "bottom top",
                // markers: true,
                toggleActions: "play reverse play reverse"
            })
        )

        contactNav.addEventListener("click", () => {
            contactSec.scrollIntoView({ behavior: "smooth" });
        })


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
        this.asideNavScrollTriggerRef.forEach(ref => {
            ref.refresh()
        })
    }


    dispose() {

    }
}