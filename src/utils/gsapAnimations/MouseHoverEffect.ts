import gsap from 'gsap'


interface Vector2 {
    x: number,
    y: number
}
export default class MouseHoverEffect {
    mouseCoords: Vector2;
    mouseNormalizeCoords: Vector2;
    mouseHoverdiv!: HTMLDivElement;
    constructor() {
        this.mouseCoords = { x: 0, y: 0 }
        this.mouseNormalizeCoords = { x: 0, y: 0 }

        this.mouseMoveCallback = this.mouseMoveCallback.bind(this);

        window.addEventListener("mousemove", this.mouseMoveCallback)

    }

    init() {
        this.mouseHoverdiv = document.createElement("div");
        this.mouseHoverdiv.style.position = "fixed";
        this.mouseHoverdiv.style.top = "0px";
        this.mouseHoverdiv.style.left = "0px";
        this.mouseHoverdiv.style.zIndex = "10";
        this.mouseHoverdiv.style.width = "50px";
        this.mouseHoverdiv.style.mixBlendMode = "difference"
        this.mouseHoverdiv.style.height = "50px";
        this.mouseHoverdiv.style.borderRadius = "50%";
        this.mouseHoverdiv.style.backgroundColor = "white"
        this.mouseHoverdiv.style.pointerEvents = "none"


        document.body.appendChild(this.mouseHoverdiv)
    }

    followCursor(hoveringLink: boolean) {

        const tl = gsap.timeline()

        tl.to(
            this.mouseHoverdiv,
            {
                translateX: `${this.mouseCoords.x - 25}px`,
                translateY: `${this.mouseCoords.y - 25}px`,

                duration: 1
            }
        ).to(
            this.mouseHoverdiv,
            {
                scale: hoveringLink ? 0 : 1,
                duration: 0.5
            },
            "<"
        )

    }

    mouseMoveCallback(e: MouseEvent) {
        const child = document.elementFromPoint(this.mouseCoords.x, this.mouseCoords.y);

        this.mouseCoords.x = e.clientX;
        this.mouseCoords.y = e.clientY;



        this.mouseNormalizeCoords.x = e.clientX / window.innerWidth;
        this.mouseNormalizeCoords.y = e.clientY / window.innerHeight;

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

        this.followCursor(hoveringLink)

    }

    dispose() {
        window.removeEventListener("mousemove", this.mouseMoveCallback)
        document.body.removeChild(this.mouseHoverdiv);
    }
}