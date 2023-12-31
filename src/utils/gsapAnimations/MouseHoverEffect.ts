import gsap from 'gsap'
import * as  THREE from "three"


interface Vector2 {
    x: number,
    y: number
}
export default class MouseHoverEffect {
    mouseCoords: THREE.Vector2;
    mouseNormalizeCoords: THREE.Vector2;
    mouseHoverdiv!: HTMLDivElement;
    mouseHoverdivWrapper!: HTMLDivElement;
    isMouseMoved: boolean;
    constructor() {
        this.isMouseMoved = false;
        this.mouseCoords = new THREE.Vector2()
        this.mouseNormalizeCoords = new THREE.Vector2()

        this.mouseMoveCallback = this.mouseMoveCallback.bind(this);


        window.addEventListener("mousemove", this.mouseMoveCallback)

    }

    init() {
        this.mouseHoverdiv = document.createElement("div");
        this.mouseHoverdivWrapper = document.createElement("div");
        this.mouseHoverdivWrapper.style.position = "fixed";
        this.mouseHoverdivWrapper.style.top = "0px";
        this.mouseHoverdivWrapper.style.left = "0px";
        this.mouseHoverdivWrapper.style.zIndex = "10";
        this.mouseHoverdivWrapper.style.pointerEvents = "none"
        this.mouseHoverdivWrapper.style.mixBlendMode = "difference"

        this.mouseHoverdiv.style.width = "50px";
        this.mouseHoverdiv.style.mixBlendMode = "difference"
        this.mouseHoverdiv.style.height = "50px";
        this.mouseHoverdiv.style.borderRadius = "50%";
        this.mouseHoverdiv.style.backgroundColor = "white"
        this.mouseHoverdiv.style.pointerEvents = "none"

        this.mouseHoverdivWrapper.appendChild(this.mouseHoverdiv)

        document.body.appendChild(this.mouseHoverdivWrapper)
    }

    followCursor(hoveringLink: boolean) {

        const tl = gsap.timeline()

        tl.to(
            this.mouseHoverdivWrapper,
            {
                translateX: `${this.mouseCoords.x - 25}px`,
                translateY: `${this.mouseCoords.y - 25}px`,

                duration: 1
            }
        ).to(
            this.mouseHoverdivWrapper,
            {
                scale: hoveringLink ? 0 : 1,
                duration: 0.5
            },
            "<"
        )

    }

    toggleVisibility(type: "show" | "hide") {
        if (type === "show") {
            gsap.to(
                this.mouseHoverdiv,
                {
                    scale: 1,
                }
            )
        } else {
            gsap.to(
                this.mouseHoverdiv,
                {
                    scale: 0,
                }
            )
        }
    }

    mouseMoveCallback(e: MouseEvent) {
        const child = document.elementFromPoint(this.mouseCoords.x, this.mouseCoords.y);

        this.mouseCoords.x = e.clientX;
        this.mouseCoords.y = e.clientY;



        this.mouseNormalizeCoords.x = e.clientX / window.innerWidth;
        this.mouseNormalizeCoords.y = e.clientY / window.innerHeight;

        this.isMouseMoved = true;

        // check if cursor is hovering a link
        const links = document.querySelectorAll(".hoverLinks");
        let hoveringLink = false;
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            if (e.target === link || link.contains(child)) {
                hoveringLink = true;
                i = links.length;
            } else {
                hoveringLink = false;
            }
        }

        this.followCursor(hoveringLink);
        this.isMouseMoved = true;

    }

    dispose() {
        // console.log("mouse hover effect removed")
        window.removeEventListener("mousemove", this.mouseMoveCallback)
        document.body.removeChild(this.mouseHoverdivWrapper);
    }
}