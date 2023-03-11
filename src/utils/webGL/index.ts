import * as THREE from "three"
import Stats from 'three/examples/jsm/libs/stats.module.js';
import gsap from "gsap"
import LiquidBackgroundOverlay from "./LiquidBackgroundOverlay";
import MouseHoverEffect from "../gsapAnimations/MouseHoverEffect";

interface SizesType {
    width: number,
    height: number,
    aspectRatio: number
}

interface TimeTypes {
    start: number;
    currentTime: number;
    deltaTime: number;
    elaspedTime: number;
}

export default class WebglExperience {
    canvas!: HTMLCanvasElement;
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;
    sizes!: SizesType;
    time!: TimeTypes;
    stats: Stats;
    isDarkMode!: boolean;
    requestAnimationFrameRef!: number
    liquidBackgroundOverlay!: LiquidBackgroundOverlay;
    mouseHoverEffect: MouseHoverEffect;
    constructor(mouseHoverEffect: MouseHoverEffect) {
        this.mouseHoverEffect = mouseHoverEffect;
        this.scene = new THREE.Scene();
        this.stats = Stats();
        this.time = {
            start: Date.now(),
            currentTime: Date.now(),
            deltaTime: 16,
            elaspedTime: 0
        }
        // Order Matters
        this.setUpSizes();
        this.setUpCamera();
        this.setUpRenderer();
        this.setUpLights();

        this.liquidBackgroundOverlay = new LiquidBackgroundOverlay(this);

        this.liquidBackgroundOverlay.setUpWater();
        document.body.appendChild(this.stats.dom)

        this.tick = this.tick.bind(this)
        this.onResizeCallback = this.onResizeCallback.bind(this);

        this.tick()
        window.addEventListener("resize", this.onResizeCallback);
    }

    init() {

    }

    handleAppThemeChange(isDarkMode: boolean) {
        this.isDarkMode = isDarkMode
        if (isDarkMode) {
            console.log(this.liquidBackgroundOverlay.waterMaterial)
            this.liquidBackgroundOverlay.waterMaterial.color = new THREE.Color("black");
            this.liquidBackgroundOverlay.waterMaterial.uniforms['color'].value = new THREE.Color("black");
            this.liquidBackgroundOverlay.waterMaterial.needsUpdate = true;
            this.liquidBackgroundOverlay.waterMaterial.uniformsNeedUpdate = true;
        } else {
            console.log(this.liquidBackgroundOverlay.waterMaterial.uniforms['color'].value)
            console.log(this.liquidBackgroundOverlay.waterMaterial)
            this.liquidBackgroundOverlay.waterMaterial.color = new THREE.Color("white");
            this.liquidBackgroundOverlay.waterMaterial.uniforms['color'].value = new THREE.Color("white");
            this.liquidBackgroundOverlay.waterMaterial.uniformsNeedUpdate = true;
            this.liquidBackgroundOverlay.waterMaterial.needsUpdate = true;

            console.log(this.liquidBackgroundOverlay.waterMaterial.uniforms['color'].value)
        }


    }



    setUpLights() {
        // const sun = new THREE.DirectionalLight(0xFFFFFF, 2.0);
        // sun.position.set(1, 1, 1)

        const sun = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        sun.position.set(300, 400, 175);

        const sun2 = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        sun2.position.set(-100, 0, 175);

        const sun3 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        sun3.position.set(100, 0, 175);

        const sun4 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        sun4.position.set(-300, 300, 175);

        this.scene.add(sun, sun2, sun3, sun4)
    }

    setUpSizes() {
        this.canvas = document.querySelector(".webgl_canvas") as HTMLCanvasElement;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;


        this.sizes = {
            width: this.canvas.width,
            height: this.canvas.height,
            aspectRatio: this.canvas.width / this.canvas.height
        }


    }

    setUpCamera() {
        // this.camera = new THREE.PerspectiveCamera(75, this.sizes.aspectRatio, 1, 2000)
        // this.camera.position.set(0, 0, 2)

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.set(0, 200, 350);
        this.camera.lookAt(0, 0, 0);

        this.scene.add(this.camera)
    }

    setUpRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setClearColor(new THREE.Color("yellow"))
        this.renderer.setClearAlpha(1)
    }

    upDateTime() {
        const currentTime = Date.now();
        this.time.deltaTime = currentTime - this.time.currentTime;
        this.time.currentTime = currentTime;
        this.time.elaspedTime = currentTime - this.time.start;
    }

    setUpStats() {

    }

    onResizeCallback() {
        // Update sizes
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.sizes.width = this.canvas.width;
        this.sizes.height = this.canvas.height;
        this.sizes.aspectRatio = this.canvas.width / this.canvas.height;

        // Update Camera
        this.camera.aspect = this.sizes.aspectRatio
        this.camera.updateProjectionMatrix();

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // this.liquidBackgroundOverlay.fitToCameraFov()
    }

    tick() {
        this.stats.begin();
        this.upDateTime();

        this.liquidBackgroundOverlay.update();


        this.renderer.render(this.scene, this.camera);
        this.stats.end();

        this.requestAnimationFrameRef = requestAnimationFrame(this.tick)
    }

    dispose() {
        this.liquidBackgroundOverlay.dispose();

        window.removeEventListener("resize", this.onResizeCallback);
        this.renderer.dispose();
        window.cancelAnimationFrame(this.requestAnimationFrameRef);

        this.scene.traverse((child: any) => {
            if (typeof child.dispose === 'function') child.dispose();
            if (child instanceof THREE.Mesh) {
                if (typeof child.geometry.dispose === 'function') child.geometry.dispose();
                for (const key in child.material) {
                    if (Object.hasOwn(child.material, key)) {
                        const item = child.material[key];
                        if (item && typeof item.dispose === 'function') item.dispose();
                    }
                }
            }
        })
    }
}