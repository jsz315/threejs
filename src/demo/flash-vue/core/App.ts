import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FocusLight from './FocusLight';
import Tooler from './Tooler';
import { FineLoader } from './FineLoader';
import { Effect } from './Effect';
import Components from './Components';
import listener from "../lib/listener"

export default class App {
    public static ZERO: THREE.Vector3 = new THREE.Vector3();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    focusLight: FocusLight;
    fineLoader: FineLoader;

    // ambientLightIntensity: number = 1.32;
    // focusLightIntensity: number = 0.42;
    roughness: number = 0.35;
    metalness: number = 0.36;

    components: Components = new Components();

    rayCaster: THREE.Raycaster;
    isMobile: boolean;
    frameMaterials: any = [];
    effect: Effect;
    size: any;
    canvas: any;
    repeat: any;

    constructor(canvas: any, size: any) {
        this.size = this.getStageSize(true);
        this.canvas = canvas;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.size.width / this.size.height, 0.1, 2400);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.canvas
        });
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xe3e3e3), 0.9);
        this.renderer.shadowMap.enabled = false;
        // document.body.appendChild(this.renderer.domElement);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(0, 0, 12);
        this.camera.lookAt(new THREE.Vector3());

        this.focusLight = new FocusLight(0xffffff, 0.4);
        this.scene.add(this.focusLight);

        this.fineLoader = new FineLoader();
        this.scene.add(this.fineLoader);

        this.isMobile = Tooler.checkMobile();
        this.rayCaster = new THREE.Raycaster();

        this.effect = new Effect();

        window.addEventListener("resize", e => this.onResize(e), false);
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.select(e), false);

        console.log(this.scene);

        listener.on("changeColor", (url: string, isSub: boolean) => {
            this.changeMap(url, isSub);
        })

        listener.on("play", () => {
            this.playAnimate();
        })

        listener.on("param", (attr: string, num: number) => {
            if (attr == "ambient") {
                this.setAmbient(num);
            }
            else if (attr == "directional") {
                this.setDirectional(num);
            }
            else if (attr == "metalness") {
                this.setMetalness(num);
            }
            else if (attr == "roughness") {
                this.setRoughness(num);
            }
        })
    }

    getStageSize(usePixel?: boolean) {
        var size: any = { width: window.innerWidth };
        if (window.innerWidth > window.innerHeight) {
            size.height = window.innerHeight;
        }
        else {
            size.height = window.innerWidth;
        }
        if (usePixel) {
            var dpr = window.devicePixelRatio > 2 ? 2 : window.devicePixelRatio;
            size.width = size.width * dpr;
            size.height = size.height * dpr;
        }
        return size;
    }

    onResize(e: Event): void {
        this.size = this.getStageSize(true);
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        console.log("resize");
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
    }

    animate(): void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.effect.update();
        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
        this.focusLight.update(this.camera);
    }

    setStats(stats: any): void {
        this.stats = stats;
    }

    select(e: any): any {
        if (this.isMobile) {
            e = e.changedTouches[0];
        }
        var size = this.getStageSize(false);
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / size.width) * 2 - 1;
        mouse.y = -(e.clientY / size.height) * 2 + 1;

        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            console.log(obj);
            let mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;
            if (mat.map) {
                let img = mat.map.image;
                console.log(img.currentSrc);
            }
        }
    }

    playAnimate(): void {
        this.effect.play();
    }

    fitModel(group: THREE.Object3D): void {
        let parent: THREE.Object3D = group;

        while (parent.children.length == 1) {
            parent = parent.children[0];
        }

        let scale: number = Tooler.getFitScale(parent, 10);
        parent.position.set(0, 0, 0);
        parent.scale.multiplyScalar(scale);
        parent.rotateX(-Math.PI / 2);
        this.scene.add(parent);
        parent.name = "load_scene";

        let aim = new THREE.Object3D();
        aim.add(parent);
        this.scene.add(aim);
        let offset: THREE.Vector3 = Tooler.getOffsetVector3(aim);
        console.log(offset);
        aim.position.set(0 - offset.x, 0 - offset.y, 0 - offset.z);

        this.setRoughness(this.roughness);
        this.setMetalness(this.metalness);

        this.resetName(this.scene);
        this.initMaterials(parent);
    }

    resetName(parent: THREE.Object3D) {
        let t = 0;
        parent.traverse((item: any) => {
            if (item.isMesh) {
                t++;
            }
            item.name = item.name.split("-")[0];
        })
        console.log("total: " + t);
    }

    initMaterials(parent: THREE.Object3D) {
        let list = Tooler.getAllMaterial(parent);
        let materials = list[0];
        this.repeat = list[1];

        this.components.initMap(materials);

        /*
        let isRoom = false;
        let winMaterials: any = [];
        let roomMaterials: any = [];
        let singleColor = true;

        materials.forEach((m: any) => {
            if (m.map && m.map.image) {
                let src = m.map.image.src;
                if (src.indexOf("/dif_") != -1) {
                    isRoom = true;
                    roomMaterials.push(m);
                }
                if (src.indexOf("/IPR_") != -1) {
                    winMaterials.push(m);
                }
                if(src.indexOf("/IPR_A_") != -1){
                    singleColor = false;
                }
                else if(src.indexOf("/IPR_B_") != -1){
                    singleColor = false;
                }
            }
            m.transparent = true;
            m.alphaTest = 0.2;
        })

        setTimeout(() => {
            if (isRoom) {
                this.frameMaterials = roomMaterials;
            }
            else {
                this.frameMaterials = winMaterials;
            }

            materials.forEach((m: any) => {
                if (m.map && m.map.image) {
                    let src = m.map.image.src;
                    this.resetMap(m, src);
                }
            })
        }, 300);

        window.dispatchEvent(new CustomEvent("colorMap", { bubbles: false, cancelable: false, detail: singleColor}));
        */
    }

    resetMap(material: any, url: string): void {
        this.components.resetMap(material, url);
    }

    changeMap(url: string, isSub: boolean): void {
        this.components.changeMap(url, isSub);
    }

    setup(param:any): void {
        let url = Tooler.getQueryString("url");
        if (!Tooler.isTest()) {
            url = url.replace("http:", "https:");
        }
        this.fineLoader.start(url, (object3D: THREE.Object3D) => {
            this.fitModel(object3D);
            url = url.replace(/\.(glb|zip)/, ".animation");
            this.effect.init(url, this.scene);
            // window.dispatchEvent(new CustomEvent("animate"));
        })
        // this.addSkybox();

        this.addLights();
        this.animate();
        
        this.setAmbient(param.ambient);
        this.setDirectional(param.directional);
        this.setMetalness(param.metalness);
        this.setRoughness(param.roughness);
    }

    addLights(): void {
        var ambient: THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.name = "ambient";
        this.scene.add(ambient);
    }

    addSkybox() {
        var path = "/asset/skybox/";
        var directions = ["px", "nx", "py", "ny", "pz", "nz"];
        var format = ".jpg";
        var skyGeometry = new THREE.BoxGeometry(5000, 5000, 5000);
        var materialArray = [];
        for (var i = 0; i < 6; i++) {
            materialArray.push(new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture(path + directions[i] + format),
                side: THREE.BackSide
            }));
        }

        var skyBox = new THREE.Mesh(skyGeometry, materialArray);
        this.scene.add(skyBox);
    }

    setAmbient(n: number): void {
        var ambient: any = this.scene.getObjectByName("ambient");
        ambient.intensity = n;
    }

    setDirectional(n: number): void {
        this.focusLight.intensity = n;
    }

    setRoughness(n: number): void {
        var group = this.scene.getObjectByName("load_scene");
        group && group.traverse((child: any) => {
            if (child.isMesh) {
                if (Array.isArray(child.material)) {
                    for (var i: number = 0; i < child.material.length; i++) {
                        child.material[i].roughness = n;
                    }
                }
                else {
                    child.material.roughness = n;
                }

            }
        })
        this.roughness = n;
    }

    setMetalness(n: number): void {
        var group = this.scene.getObjectByName("load_scene");
        group && group.traverse((child: any) => {
            if (child.isMesh) {
                if (Array.isArray(child.material)) {
                    for (var i: number = 0; i < child.material.length; i++) {
                        child.material[i].metalness = n;
                    }
                }
                else {
                    child.material.metalness = n;
                }
            }
        })
        this.metalness = n;
    }
}