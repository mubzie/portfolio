import WebglExperience from ".";
import * as THREE from "three";
import { GPUComputationRenderer, Variable } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise.js';
import MouseHoverEffect from "../gsapAnimations/MouseHoverEffect";
import waterVertexShader from "./shaders/waterVertexShader.glsl"
import waterFragmentShader from "./shaders/waterFragmentShader.glsl"
import heightmapFragmentShader from "./shaders/heightmapFragmentShader.glsl"
import smoothFragmentShader from "./shaders/smoothFragmentShader.glsl"
import readWaterLevelFragmentShader from "./shaders/readWaterLevelFragmentShader.glsl"


export default class LiquidBackgroundOverlay {
    experience: WebglExperience;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    waterMesh!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    rayMesh!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    waterMaterial: any
    waterNormal: THREE.Vector2
    waterUniforms!: Record<string, any>;
    smoothShader: any;
    readWaterLevelShader: any;
    readWaterLevelRenderTarget: any;
    readWaterLevelImage: any;
    mouseHoverEffect: MouseHoverEffect;
    BOUNDS: number; // Water size in system units
    BOUNDS_HALF: number;
    WIDTH: number = 128; // Texture width for simulation
    raycaster: THREE.Raycaster;
    gpuCompute: GPUComputationRenderer;
    simplex: SimplexNoise;
    heightmapVariable!: Variable;
    constructor(experience: WebglExperience) {
        this.experience = experience;
        this.scene = experience.scene;
        this.camera = experience.camera;
        this.renderer = experience.renderer;
        this.mouseHoverEffect = experience.mouseHoverEffect
        this.BOUNDS = 512;
        this.BOUNDS_HALF = this.BOUNDS * 0.5;
        this.raycaster = new THREE.Raycaster();
        this.simplex = new SimplexNoise()
        this.gpuCompute = new GPUComputationRenderer(this.WIDTH, this.WIDTH, this.renderer);
        this.waterNormal = new THREE.Vector2();


    }



    init() {
        // const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: "black" });


        // this.waterMesh = new THREE.Mesh(geometry, material);
        // this.waterMesh.position.z = -1;
        // this.fitToCameraFov();

        // this.scene.add(this.waterMesh);
    }

    fitToCameraFov() {
        const distance = this.camera.position.z - this.waterMesh.position.z;

        const vFov = this.camera.fov * Math.PI / 180;

        const scaleY = 2 * Math.tan(vFov / 2) * distance;
        const scaleX = scaleY * this.camera.aspect;

        this.waterMesh.scale.set(scaleX, scaleY, 1);
    }

    setUpWater() {
        const materialColor = "black";

        const geometry = new THREE.PlaneGeometry(this.BOUNDS, this.BOUNDS, this.WIDTH - 1, this.WIDTH - 1);

        // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
        this.waterMaterial = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.ShaderLib['phong'].uniforms,
                {
                    'heightmap': { value: null },
                    "uIsDarkMode": { value: 1 }
                }
            ]),
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader

        }) as any;



        this.waterMaterial.lights = true;

        // Material attributes from THREE.MeshPhongMaterial
        this.waterMaterial.color = new THREE.Color(materialColor);
        this.waterMaterial.specular = new THREE.Color(0x111111);
        this.waterMaterial.shininess = 50;

        // Sets the uniforms with the material values
        this.waterMaterial.uniforms['diffuse'].value = this.waterMaterial.color;
        this.waterMaterial.uniforms['specular'].value = this.waterMaterial.specular;
        this.waterMaterial.uniforms['shininess'].value = Math.max(this.waterMaterial.shininess, 1e-4);
        this.waterMaterial.uniforms['opacity'].value = this.waterMaterial.opacity;
        this.waterMaterial.uniforms['uIsDarkMode'].value = 1;

        // Defines
        this.waterMaterial.defines.WIDTH = this.WIDTH.toFixed(1);
        this.waterMaterial.defines.BOUNDS = this.BOUNDS.toFixed(1);

        this.waterUniforms = this.waterMaterial.uniforms;


        this.waterMesh = new THREE.Mesh(geometry, this.waterMaterial);
        this.waterMesh.rotation.x = -Math.PI * 0.165;
        this.waterMesh.scale.set(2.5, 1.5, 1)

        this.waterMesh.matrixAutoUpdate = false;
        this.waterMesh.updateMatrix();
        this.scene.add(this.waterMesh);

        // THREE.Mesh just for mouse raycasting
        const geometryRay = new THREE.PlaneGeometry(this.BOUNDS, this.BOUNDS, 1, 1);
        this.rayMesh = new THREE.Mesh(geometryRay, new THREE.MeshBasicMaterial({ color: 0xFFFFFF, visible: false }));
        this.rayMesh.rotation.x = this.waterMesh.rotation.x;
        this.rayMesh.scale.copy(this.waterMesh.scale)
        this.rayMesh.matrixAutoUpdate = false;
        this.rayMesh.updateMatrix();
        this.scene.add(this.rayMesh);

        if (this.renderer.capabilities.isWebGL2 === false) {

            this.gpuCompute.setDataType(THREE.HalfFloatType);
        }
        const heightmap0 = this.gpuCompute.createTexture();
        this.fillTexture(heightmap0);

        this.heightmapVariable = this.gpuCompute.addVariable('heightmap', heightmapFragmentShader, heightmap0);
        this.gpuCompute.setVariableDependencies(this.heightmapVariable, [this.heightmapVariable]);

        this.heightmapVariable.material.uniforms['mousePos'] = { value: new THREE.Vector2(10000, 10000) };
        this.heightmapVariable.material.uniforms['mouseSize'] = { value: 82.0 };
        this.heightmapVariable.material.uniforms['viscosityConstant'] = { value: 0.99 };
        this.heightmapVariable.material.uniforms['heightCompensation'] = { value: 0 };
        this.heightmapVariable.material.defines.BOUNDS = this.BOUNDS.toFixed(1);

        const error = this.gpuCompute.init();
        if (error !== null) {

            console.error(error);

        }

        // Create compute shader to smooth the water surface and velocity
        this.smoothShader = this.gpuCompute.createShaderMaterial(smoothFragmentShader, { smoothTexture: { value: null } });

        // Create compute shader to read water level
        this.readWaterLevelShader = this.gpuCompute.createShaderMaterial(readWaterLevelFragmentShader, {
            point1: { value: new THREE.Vector2() },
            levelTexture: { value: null }
        });
        this.readWaterLevelShader.defines.WIDTH = this.WIDTH.toFixed(1);
        this.readWaterLevelShader.defines.BOUNDS = this.BOUNDS.toFixed(1);

        // Create a 4x1 pixel image and a render target (Uint8, 4 channels, 1 byte per channel) to read water height and orientation
        this.readWaterLevelImage = new Uint8Array(4 * 1 * 4);

        this.readWaterLevelRenderTarget = new THREE.WebGLRenderTarget(4, 1, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
            depthBuffer: false
        });
    }

    fillTexture(texture: THREE.DataTexture) {
        const waterMaxHeight = 10;

        let noise = (x: number, y: number) => {

            let multR = waterMaxHeight;
            let mult = 0.025;
            let r = 0;
            for (let i = 0; i < 15; i++) {

                r += multR * this.simplex.noise(x * mult, y * mult);
                multR *= 0.53 + 0.025 * i;
                mult *= 1.25;

            }

            return r;

        }
        noise = noise.bind(this)


        const pixels = texture.image.data;

        let p = 0;
        for (let j = 0; j < this.WIDTH; j++) {

            for (let i = 0; i < this.WIDTH; i++) {

                const x = i * 128 / this.WIDTH;
                const y = j * 128 / this.WIDTH;

                pixels[p + 0] = noise(x, y);
                pixels[p + 1] = pixels[p + 0];
                pixels[p + 2] = 0;
                pixels[p + 3] = 1;

                p += 4;

            }

        }
    }

    randomFromRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }


    update() {
        // Set uniforms: mouse interaction
        const uniforms = this.heightmapVariable.material.uniforms;

        if (this.mouseHoverEffect.isMouseMoved && !this.experience.isMobileScreen) {

            this.raycaster.setFromCamera(
                {
                    x: (this.mouseHoverEffect.mouseNormalizeCoords.x - 0.5) * 2,
                    y: - (this.mouseHoverEffect.mouseNormalizeCoords.y - 0.5) * 2
                },
                this.camera
            );

            const intersects = this.raycaster.intersectObject(this.rayMesh);

            if (intersects.length > 0) {

                const point = intersects[0].point;

                uniforms['mousePos'].value.set(point.x, point.z);

            } else {

                uniforms['mousePos'].value.set(10000, 10000);

            }

            this.mouseHoverEffect.isMouseMoved = false;

        } else if (this.experience.isMobileScreen) {
            this.raycaster.setFromCamera(
                {
                    x: this.randomFromRange(-1, 1),
                    y: this.randomFromRange(-1, 1)
                },
                this.camera
            );
            const intersects = this.raycaster.intersectObject(this.rayMesh);

            if (intersects.length > 0) {

                const mobilePoints = {
                    x: this.randomFromRange(-360, 360),
                    y: this.randomFromRange(-268, 268),
                    z: this.randomFromRange(-153, 153)
                }

                uniforms['mousePos'].value.set(mobilePoints.x, mobilePoints.z);

            } else {

                uniforms['mousePos'].value.set(10000, 10000);

            }
        }
        else {

            uniforms['mousePos'].value.set(10000, 10000);

        }

        // Do the gpu computation
        this.gpuCompute.compute();

        // Get compute output in custom uniform
        this.waterUniforms['heightmap'].value = this.gpuCompute.getCurrentRenderTarget(this.heightmapVariable).texture;
    }

    dispose() {

    }

}