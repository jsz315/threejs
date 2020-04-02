import * as THREE from 'three'
import Tooler from './Tooler';
import { FineLoader } from './FineLoader';
import { Effect } from './Effect';
import listener from '../lib/listener';
import TextureList from './TextureList';
import { FreeCamera }  from './FreeCamera';
import {FineMaterial} from './FineMaterial';
import Stage from './Stage';
import ViewHelper from './ViewHelper';
import Cache from './Cache';
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

    helper:ViewHelper;
    textureLoader: THREE.TextureLoader = new THREE.TextureLoader();

    constructor(canvas: any, size: any) {
        this.size = Tooler.getStageSize(true);
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
            FineMaterial.lightMap(this.scene);
        }, false);
    }

    onResize(e: Event): void {
        this.size = Tooler.getStageSize(true);
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
        this.camera.update();
        this.helper.update();
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
        var size = Tooler.getStageSize(false);
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / size.width) * 2 - 1;
        mouse.y = -(e.clientY / size.height) * 2 + 1;

        // console.log(this.camera.orbit.center.clone());
        // console.log(this.camera);
        console.log("orbit tagert", this.camera.orbit.target);
        console.log("camera tagert", this.camera.aim);
        // this.camera.orbit.target = this.camera.aim.clone();
        // this.camera.orbit.reset();
        // this.camera.orbit.update();

        // this.camera.resetOrbitControls();
        this.camera.updateProjectionMatrix();
        this.camera.orbit.target = this.camera.aim.clone();
        // this.camera.orbit.update();

        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            console.log(obj);
            console.log("当前模型：");
            var aim:THREE.Object3D = Tooler.getRootModel(obj);
            console.log(aim);
            // console.log(aim.rotation, aim.scale);
            let mat = Array.isArray(obj.material) ? obj.material[0] : obj.material;

            // console.log("roughness = " + mat.roughness, "metalness = " + mat.metalness);

            var has = this.frameMaterials.indexOf(mat) != -1;
            console.log('has', has);

            // obj.material = new THREE.MeshNormalMaterial();
            // setTimeout(() => {
            //     obj.material= mat;
            // }, 900);

            if (mat.map) {
                let img = mat.map.image;
                console.log(img.currentSrc);

                // this.reloadMap(mat, img.currentSrc);
            }
        }
    }

    playAnimate(): void {
        this.effects.forEach((effect:Effect)=>{effect.play()});
        console.log(Tooler.errorList);
        console.log(Tooler.errorList.map(item => {
            return item.replace(".zip", ".a3d");
        }));

        // this.helper.play();
    }

    fitModel(group: THREE.Object3D, isWall:boolean = false): void {
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
        this.initMaterials(parent, isWall);

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
        // let list = Tooler.getAllMaterial(parent);
        let materials = FineMaterial.getMapMaterials(parent);
        materials.forEach((m: any) => {
            let src:any = m.map.image.src;
            let transparent = m.transparent;

            // if(FineLoader.isLayout || isWall){
            //     if(!transparent){
            //         m.roughness = 0.96;
            //         m.metalness = 0.04;
            //         m.flatShading = false;
            //     }
            // }
            // else{
            //     if (src.indexOf("/IPR_") != -1) {
            //         this.frameMaterials.push(m);
            //     }
            //     else if(src.indexOf("/dif_wood") != -1){
            //         this.frameMaterials.push(m);
            //     }

            //     m.roughness = this.roughness;
            //     m.metalness = this.metalness;
            // }

            // console.log("材质贴图", src);


            // if(!transparent){
            //     m.roughness = 0.96;
            //     m.metalness = 0.04;
            //     m.flatShading = false;
            // }

            if (src.indexOf("/IPR_") != -1) {
                this.frameMaterials.push(m);
                m.roughness = this.roughness;
                m.metalness = this.metalness;
            }
            else if(src.indexOf("dif_") != -1){
                this.frameMaterials.push(m);
                m.roughness = this.roughness;
                m.metalness = this.metalness;
            }

            // m.transparent = true;
            // m.opacity = 0.6;
            // m.roughness = 0.2;
            // m.metalness = 0.2;
        })

        if(isWall){
            setTimeout(() => {
                listener.emit("init");
            }, 4000);
        }
        
    }
    
    
    changeMap(url: string): void {
        this.frameMaterials.length && this.frameMaterials.forEach((material: any) => {
            FineMaterial.reloadMap(material, url);
        })
    }

    setup(): void {
        let url = Tooler.getQueryString("url");
        if(!Tooler.isTest()){
            url = url.replace("http:", "https:");
        }
        // url = url.replace("http:", "https:");
        this.fineLoader.start(url, async (object3D: THREE.Object3D) => {
            this.fitModel(object3D, true);
            FineMaterial.lightMap(object3D);

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

        this.helper = new ViewHelper();
        this.scene.add(this.helper);
        this.helper.addCamera(this.camera);
        this.helper.addLight(this.stage.focusLight);
        this.animate();       
    }

    addSubModel(param:any):void{
        var group = this.scene.getObjectByName("load_scene");
        // var group = this.scene.getObjectByName("aim_scene");
        var obj = param.obj;
        let {position, rotation, scale} = param.attr;
        obj.position.set(position[0], position[1], position[2]);
        // obj.rotation.set(rotation[0], rotation[1], -rotation[2]);
        // console.log("rotation", rotation);
        // console.log("scale", scale);
        
        // var angle = 0.02;
        // var angle = 0.9;
        // if(Math.PI / 2 - Math.abs(rotation[2] % Math.PI) < angle){
        //     obj.rotation.set(rotation[0], rotation[1], -rotation[2]);
        // }
        // else{
        //     obj.rotation.set(rotation[0], rotation[1], rotation[2]);
        // }

        obj.rotation.set(rotation[0], rotation[1], -rotation[2]);

        // obj.rotation.set(rotation[0], rotation[2], rotation[1]);

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

    setFar(n: number):void{
        this.stage.focusLight.changeFar(this.camera, n);
    }
}