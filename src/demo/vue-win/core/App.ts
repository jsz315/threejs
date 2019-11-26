import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FocusLight from './FocusLight';
import Tooler from './Tooler';
import { FineLoader } from './FineLoader';
import { Effect } from './Effect';

export default class App {
    public static ZERO: THREE.Vector3 = new THREE.Vector3();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    focusLight: FocusLight;
    fineLoader: FineLoader;

    ambientLightIntensity: number = 0;
    focusLightIntensity: number = 0;
    roughness: number = 0;
    metalness: number = 0;

    far: number = 2.62;

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
        this.renderer.setClearColor(new THREE.Color(0x999999), 0);
        this.renderer.shadowMap.enabled = false;
        // document.body.appendChild(this.renderer.domElement);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(new THREE.Vector3());

        this.focusLight = new FocusLight(0xffffff, this.focusLightIntensity);
        this.scene.add(this.focusLight);

        this.fineLoader = new FineLoader();
        this.scene.add(this.fineLoader);

        this.isMobile = Tooler.checkMobile();
        this.rayCaster = new THREE.Raycaster();

        this.effect = new Effect();

        window.addEventListener("resize", e => this.onResize(e), false);
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.select(e), false);

        console.log(this.scene);
    }

    getStageSize(usePixel?: boolean) {
        var size: any = { width: window.innerWidth };
        // if (window.innerWidth > window.innerHeight) {
        //     size.height = window.innerHeight;
        // }
        // else {
        //     size.height = window.innerWidth;
        // }
        size.height = window.innerHeight;
        if (usePixel) {
            size.width = size.width * window.devicePixelRatio;
            size.height = size.height * window.devicePixelRatio;
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
        console.log(materials);

        let isRoom = false;
        let winMaterials: any = [];
        let roomMaterials: any = [];

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
            }
            m.transparent = true;
            m.alphaTest = 0.2;
        })

        setTimeout(() => {
            if (isRoom) {
                this.frameMaterials = roomMaterials;
                // this.frameMaterials.forEach((m:any) => {
                //     console.log("change roomMaterials");
                //     if(m.map && m.map.image){
                //         let src = m.map.image.src;
                //         if(src.indexOf("/dif_") != -1){
                //             this.resetMap(m, src);
                //         }
                //     }
                // })
            }
            else {
                this.frameMaterials = winMaterials;
                // this.frameMaterials.forEach((m:any) => {
                //     console.log("change winMaterials");
                //     if(m.map && m.map.image){
                //         let src = m.map.image.src;
                //         if(src.indexOf("/IPR_") != -1){
                //             this.resetMap(m, src);
                //         }
                //     }
                // })
            }

            materials.forEach((m: any) => {
                if (m.map && m.map.image) {
                    let src = m.map.image.src;
                    this.resetMap(m, src);
                }
            })
        }, 300);
    }

    resetMap(material: any, url: string): void {
        let texture: any = new THREE.TextureLoader().load(url, () => {
            material.map.needsUpdate = true;
            material.needsUpdate = true;
        });

        texture.wrapS = material.map.wrapS;
        texture.wrapT = material.map.wrapT;
        texture.repeat = new THREE.Vector2(material.map.repeat.x, material.map.repeat.y);
        texture.flipY = material.map.flipY;
        texture.flipX = material.map.flipY;
        material.map = texture;
    }

    changeMap(url: string): void {
        this.frameMaterials.length && this.frameMaterials.forEach((material: any) => {
            this.resetMap(material, url);
        })
    }

    setup(): void {
        let url = Tooler.getQueryString("url");
        this.fineLoader.start(url, (object3D: THREE.Object3D) => {
            this.fitModel(object3D);
            url = url.replace(/\.(glb|zip)/, ".animation");
            this.effect.init(url, this.scene);
            window.dispatchEvent(new CustomEvent("animate"));
        })

        // this.addSkybox();
        this.addSkySphere();

        window.addEventListener("subLoad", (e:any) => {
            this.addSubModel(e.detail);
        })

        this.addLights();
        this.animate();
    }

    addSubModel(param:any):void{
        var group = this.scene.getObjectByName("load_scene");
        var obj = param.obj;
        let {position, rotation, scale} = param.attr;
        obj.position.set(position[0], position[1], position[2]);
        obj.rotation.set(rotation[0], rotation[1], rotation[2]);
        obj.scale.set(scale[0], scale[1], scale[2]);
        group.add(obj);
    }

    addLights(): void {
        var ambient: THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = this.ambientLightIntensity;
        ambient.name = "ambient";
        this.scene.add(ambient);

        // var hemishpereLight:THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffff00);
        // hemishpereLight.intensity = 1.8;
        // this.scene.add(hemishpereLight);
    }

    addSkybox() {
        var path = "/asset/skybox/";
        var directions = ["px", "nx", "py", "ny", "pz", "nz"];
        var format = ".jpg";
        var skyGeometry = new THREE.BoxGeometry(500, 500, 500);
        var materialArray = [];
        for (var i = 0; i < 6; i++) {
            materialArray.push(new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(path + directions[i] + format),
                side: THREE.BackSide
            }));
        }

        var sky = new THREE.Mesh(skyGeometry, materialArray);
        this.scene.add(sky);
    }

    addSkySphere(){
        var mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("/asset/sky.jpg"),
                side: THREE.BackSide
            });
        var sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 32), mat);
        this.scene.add(sky); 
    }

    setAmbient(n: number): void {
        var ambient: any = this.scene.getObjectByName("ambient");
        ambient.intensity = n;
        this.ambientLightIntensity = n;
    }

    setDirectional(n: number): void {
        this.focusLight.intensity = n;
        this.focusLightIntensity = n;
    }

    // setDistance(n:number):void{
    //     this.focusLight.far = n;
    //     this.far = n;
    // }

    setRoughness(n: number): void {
        var group = this.scene.getObjectByName("load_scene");
        group && group.traverse((child: any) => {
            if (child.isMesh) {
                let mats = Array.isArray(child.material) ? child.material : [child.material];
                for (var i: number = 0; i < mats.length; i++) {
                    mats[i].roughness = n;
                }
            }
        })
        this.roughness = n;
    }

    setMetalness(n: number): void {
        var group = this.scene.getObjectByName("load_scene");
        group && group.traverse((child: any) => {
            if (child.isMesh) {
                let mats = Array.isArray(child.material) ? child.material : [child.material];
                for (var i: number = 0; i < mats.length; i++) {
                    mats[i].metalness = n;
                }
            }
        })
        this.metalness = n;
    }
}