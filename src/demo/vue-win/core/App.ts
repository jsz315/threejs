import * as THREE from 'three'
import Tooler from './Tooler';
import { FineLoader } from './FineLoader';
import { Effect } from './Effect';
import listener from '../lib/listener';
import TextureList from './TextureList';
import { FreeCamera }  from './FreeCamera';
import Stage from './Stage';
const TWEEN = require('../lib/Tween.js');

export default class App {
    public static ZERO: THREE.Vector3 = new THREE.Vector3();
    scene: THREE.Scene;
    camera: FreeCamera;
    renderer: THREE.WebGLRenderer;
    // orbit: OrbitControls;
    stats: any;
    fineLoader: FineLoader;

    roughness: number = 0;
    metalness: number = 0;
    stage: Stage;

    rayCaster: THREE.Raycaster;
    isMobile: boolean;
    frameMaterials: any = [];
    effects: Array<Effect>;
    size: any;
    canvas: any;
    repeat: any;
    textureList: TextureList;
    isFitScene: boolean;

    constructor(canvas: any, size: any) {
        this.size = this.getStageSize(true);
        this.canvas = canvas;
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: this.canvas
        });
        this.camera = new FreeCamera(this.renderer.domElement);
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio > 2 ? 2: 1);
        this.renderer.setClearColor(new THREE.Color(0x999999), 0);
        this.renderer.shadowMap.enabled = false;
        console.log("this.camera");
        console.log(this.camera);

        this.fineLoader = new FineLoader();
        this.scene.add(this.fineLoader);
        this.stage = new Stage();
        this.scene.add(this.stage);

        this.isMobile = Tooler.checkMobile();
        this.rayCaster = new THREE.Raycaster();

        this.effects = [];

        this.textureList = new TextureList();

        window.addEventListener("resize", e => this.onResize(e), false);
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.select(e), false);

        window.addEventListener("all loaded", e => {
            this.setRoughness(this.roughness);
            this.setMetalness(this.metalness);
            // this.orbit.enabled = true;
        }, false);
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
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
    }

    animate(): void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.effects.forEach((effect:Effect)=>{effect.update();});
        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
        this.stage.focusLight.update(this.camera);
        TWEEN.update();
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
                // console.log(JSON.stringify(mat));
                // this.resetMap(mat, img.currentSrc);
                // setTimeout(() => {
                //     mat.map.needsUpdate = true;
                //     mat.needsUpdate = true;
                // }, 2000);
            }
        }
    }

    playAnimate(): void {
        this.effects.forEach((effect:Effect)=>{effect.play()});
        console.log(Tooler.errorList);
        console.log(Tooler.errorList.map(item => {
            return item.replace(".zip", ".a3d");
        }));
    }

    fitModel(group: THREE.Object3D): void {
        let parent: THREE.Object3D = group;
        parent.rotateX(-Math.PI / 2);
        this.scene.add(parent);
        parent.name = "load_scene";

        parent.position.set(-5000, 0, -5000);

        let aim = new THREE.Object3D();
        aim.name = "aim_scene";
        aim.add(parent);

        // aim.position.set(-5000, 0, -5000);

        this.scene.add(aim);
        // this.addGrass();
        this.resetName(group);
        this.initMaterials(parent, true);

        // this.addSkySphere(30000);

        this.resetScene();
    }

    resetScene(){
        this.camera.reset(this.scene.getObjectByName("load_scene"));
    }

    resetName(parent: THREE.Object3D) {
        let t = 0;
        parent.traverse((item: any) => {
            if (item.isMesh) {
                t++;
            }
            item.name = item.name.split("-")[0];
        })
    }

    initMaterials(parent: THREE.Object3D, isWall:boolean = false) {
        let list = Tooler.getAllMaterial(parent);
        let materials = list[0];
        this.repeat = list[1];

        let winMaterials: any = [];

        materials.forEach((m: any) => {
            let src:any;
            let transparent = false;

            if (m.map && m.map.image) {
                src = m.map.image.src;
                if(src.indexOf(".png") != -1){
                    transparent = true;
                }
                else if(src.indexOf("/glass.") != -1){
                    m.opacity = 0.36;
                    transparent = true;
                }
                else if(src.indexOf("/IGL_") != -1){
                    transparent = true;
                }
                else if(src.indexOf("/BL123") != -1){
                    transparent = true;
                }
                else if(src.indexOf("/bl_") != -1){
                    transparent = true;
                }
            }

            if(transparent){
                m.alphaTest = 0.2;
                m.transparent = true;
            }

            if(FineLoader.isLayout || isWall){
                console.log("家具材质");
                m.roughness = 0.96;
                m.metalness = 0.04;
                m.flatShading = false;
            }
            else{
                console.log("门窗材质");
                if (src) {
                    // src = m.map.image.src;
                    // if (src.indexOf("/dif_") != -1) {
                    //     isRoom = true;
                    //     roomMaterials.push(m);
                    // }

                    // winMaterials.push(m);

                    if (src.indexOf("/IPR_") != -1) {
                        winMaterials.push(m);
                    }
                    else if(src.indexOf("dif_wood") != -1){
                        winMaterials.push(m);
                    }

                    m.roughness = this.roughness;
                    m.metalness = this.metalness;
                }
            }
            src && this.resetMap(m, src);

            //模型变黑解决要点
            // m.emissive = m.color;
            // m.emissiveIntensity = 0.12;

            // setTimeout(() => {
            //     src && this.resetMap(m, src);
            // }, 3000);
        })

        this.frameMaterials = this.frameMaterials.concat(winMaterials);
        if(isWall){
            setTimeout(() => {
                listener.emit("init");
            }, 4000);
        }
        
    }

    resetMap(material: any, url: string): void {
        let map = material.map;

        let texture: any = new THREE.TextureLoader().load(url, () => {
            material.map.needsUpdate = true;
            material.needsUpdate = true;
        });

        texture.wrapS = map.wrapS;
        texture.wrapT = map.wrapT;
        texture.repeat = new THREE.Vector2(map.repeat.x, map.repeat.y);
        texture.flipY = map.flipY;
        texture.flipX = map.flipX;

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
            var effect = new Effect();
            effect.init(url, this.scene);
            this.effects.push(effect);
            // window.dispatchEvent(new CustomEvent("animate"));
        })

        window.addEventListener("subLoad", (e:any) => {
            this.addSubModel(e.detail);
        })

        // this.addLights();
        this.animate();
    }

    addSubModel(param:any):void{
        var group = this.scene.getObjectByName("load_scene");
        // var group = this.scene.getObjectByName("aim_scene");
        var obj = param.obj;
        let {position, rotation, scale} = param.attr;
        obj.position.set(position[0], position[1], position[2]);
        obj.rotation.set(rotation[0], rotation[1], -rotation[2]);
        obj.scale.set(scale[0], scale[1], scale[2]);
        group.add(obj);

        this.resetName(obj);
        this.initMaterials(obj);

        // obj.rotateX(-Math.PI / 2);
        if(param.hasAnimate){
            var url = param.attr.url.replace(/\.(glb|zip|a3d)/i, ".animation");
            var effect = new Effect();
            effect.init(url, obj);
            this.effects.push(effect);
        }

        !this.isFitScene && this.resetScene();
    }

    setAmbient(n: number): void {
        this.stage.setAmbient(n);
    }

    setDirectional(n: number): void {
        this.stage.setDirectional(n);
    }
    
    setRoughness(n: number): void {
        this.frameMaterials.forEach((mat:any)=>{
            mat.roughness = n;
        })
        this.roughness = n;
    }

    setMetalness(n: number): void {
        this.frameMaterials.forEach((mat:any)=>{
            mat.metalness = n;
        })
        this.metalness = n;
    }
}