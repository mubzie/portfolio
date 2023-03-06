import gsap from 'gsap'
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { sortElementInnerText } from './chunks';

gsap.registerPlugin(ScrollTrigger)

export class HomePageAnimation {
    private styles: ModuleStylesType
    loopLegendElRef!: gsap.core.Tween;
    constructor(styles: ModuleStylesType) {
        this.styles = styles;

        this.resizeCallback = this.resizeCallback.bind(this)

        window.addEventListener("resize", this.resizeCallback);
    }

    init() {
        this.animateHeaderText();
        this.loopLegendEl();
        this.animateCvSummary();
        this.animateContacts()


    }

    private animateHeaderText() {
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
    }

    private animateCvSummary() {
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



    }

    private animateContacts() {
        const contactHeader = document.querySelector(`.${this.styles.contact} > h2`) as HTMLElement;
        sortElementInnerText(contactHeader, "contactHeader", "char")
        const sortedChars = document.querySelectorAll(".contactHeader");


        gsap.fromTo(
            sortedChars,
            {
                rotateY: "180deg",
                opacity: 0
            },
            {
                rotateY: "0deg",
                opacity: 1,
                stagger: 0.1,
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

    private loopLegendEl() {
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


    }

    resizeCallback() {

    }


    dispose() {

    }
}