import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FocusLight from './FocusLight';
import Tooler from './Tooler';
import { FineLoader } from './FineLoader';
import { Effect } from './Effect';

export default class App {
    public static ZERO:THREE.Vector3 = new THREE.Vector3();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    focusLight: FocusLight;
    fineLoader: FineLoader;
    
    ambientLightIntensity: number = 1.32;
    focusLightIntensity: number = 0.42;
    roughness: number = 0.35;
    metalness: number = 0.36;

    // ambientLightIntensity: number = 0.3;
    // focusLightIntensity: number = 1.32;
    // roughness: number = 0.54;
    // metalness: number = 0.64;
    far: number = 2.62;
    
    rayCaster: THREE.Raycaster;
    isMobile: boolean;
    frameMaterials: any = [];
    effect: Effect;
    size: any;
    canvas: any;
    repeat: any;

    constructor(canvas: any, size:any) {
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

    getStageSize(usePixel?:boolean){
        var size:any = {width: window.innerWidth};
        if(window.innerWidth > window.innerHeight){
            size.height = window.innerHeight;
        }
        else{
            size.height = window.innerWidth;
        }
        if(usePixel){
            size.width = size.width * window.devicePixelRatio;
            size.height = size.height * window.devicePixelRatio;
        }
        return size;
    }
    
    onResize(e:Event):void{
        this.size = this.getStageSize(true);
        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;
        console.log("resize");
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
    }

    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.effect.update();
        this.stats && this.stats.update();
        this.renderer.render(this.scene, this.camera);
        this.focusLight.update(this.camera);
    }

    setStats(stats: any):void{
        this.stats = stats;
    }

    select(e: any):any {
        if(this.isMobile){
            e = e.changedTouches[0];
        }
        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / this.size.width) * 2 - 1;
        mouse.y = -(e.clientY / this.size.height) * 2 + 1;

        let obj:any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            console.log(obj);
            if(obj.material.map){
                let img = obj.material.map.image;
                console.log(img.currentSrc);
                // this.curMaterial = obj.material;
            }
        }
    }

    playAnimate():void{
        this.effect.play();
    }

    fitModel(group:THREE.Object3D):void{
        let parent:THREE.Object3D = group;

        while(parent.children.length == 1){
            parent = parent.children[0];
        }

        let scale:number = Tooler.getFitScale(parent, 10);
        parent.position.set(0, 0, 0);
        parent.scale.multiplyScalar(scale);
        parent.rotateX(-Math.PI / 2);
        this.scene.add(parent);
        parent.name = "load_scene";

        let aim = new THREE.Object3D();
        aim.add(parent);
        this.scene.add(aim);
        let offset:THREE.Vector3 = Tooler.getOffsetVector3(aim);
        console.log(offset);
        aim.position.set(0 - offset.x, 0 - offset.y, 0 - offset.z);

        this.setRoughness(this.roughness);
        this.setMetalness(this.metalness);

        this.resetName(this.scene);
        this.initMaterials(parent);
    }

    resetName(parent:THREE.Object3D){
        let t = 0;
        parent.traverse((item:any) => {
            if(item.isMesh){
                t++;
            }
            item.name = item.name.split("-")[0];
        })
        console.log("total: " + t);
    }

    initMaterials(parent:THREE.Object3D){
        let list = Tooler.getAllMaterial(parent);
        let materials = list[0];
        this.repeat = list[1];
        console.log("repeat = " + this.repeat);
        
        let isRoom = false;
        let winMaterials:any = [];
        let roomMaterials:any = [];

        materials.forEach((m:any) => {
            if(m.map && m.map.image){
                let src = m.map.image.src;
                let used = false;
                if(src.indexOf("/dif_") != -1){
                    used = true;
                    isRoom = true;
                    roomMaterials.push(m);
                }
                if(src.indexOf("/IPR_") != -1){
                    used = true;
                    winMaterials.push(m);
                }

                if(used){
                    console.log("门框材质定位成功");
                    m.map.wrapS = THREE.RepeatWrapping;
                    m.map.wrapT = THREE.RepeatWrapping;
                    m.map.repeat = new THREE.Vector2(1, 1 / this.repeat);
                    m.map.needsUpdate = true;
                }
            }
            m.transparent = true;
            m.alphaTest = 0.2;
            m.needsUpdate = true;
        })

        setTimeout(() => {
            if(isRoom){
                console.log("阳光房");
                this.frameMaterials = roomMaterials;
                this.frameMaterials.forEach((m:any) => {
                    console.log("change roomMaterials");
                    if(m.map && m.map.image){
                        let src = m.map.image.src;
                        if(src.indexOf("/dif_") != -1){
                            this.resetMap(m, src);
                        }
                    }
                })
            }
            else{
                this.frameMaterials = winMaterials;
                this.frameMaterials.forEach((m:any) => {
                    console.log("change winMaterials");
                    if(m.map && m.map.image){
                        let src = m.map.image.src;
                        if(src.indexOf("/IPR_") != -1){
                            this.resetMap(m, src);
                        }
                    }
                })
            }
        }, 300);
        
    }

    resetMap(material: any, url:string):void{
        let texture = new THREE.TextureLoader().load(url, () => {
            material.map.needsUpdate = true;
            material.needsUpdate = true;
        });

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat = new THREE.Vector2(1, 1 / this.repeat);
        console.log("this.repeat " + this.repeat);
        material.map = texture;
    }

    changeMap(url:string):void{
        this.frameMaterials.forEach((material: any) =>{
            this.resetMap(material, url);
        })
    }

    setup():void {
        let url = Tooler.getQueryString("url");
        this.fineLoader.start(url, (object3D:THREE.Object3D) => {
            this.fitModel(object3D);
            url = url.replace(".glb", ".animation");
            this.effect.init(url, this.scene);
            
        })
        this.addLights();
        this.animate();
    }

    addLights():void{
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = this.ambientLightIntensity;
        ambient.name = "ambient";
        this.scene.add(ambient);

        // var hemishpereLight:THREE.HemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffff00);
        // hemishpereLight.intensity = 1.8;
        // this.scene.add(hemishpereLight);
    }

    setAmbient(n:number):void{
        var ambient:any = this.scene.getObjectByName("ambient");
        ambient.intensity = n;
        this.ambientLightIntensity = n;
    }

    setDirectional(n:number):void{
        this.focusLight.intensity = n;
        this.focusLightIntensity = n;
    }

    setDistance(n:number):void{
        this.focusLight.far = n;
        this.far = n;
    }

    setRoughness(n:number):void{
        var group = this.scene.getObjectByName("load_scene");
        group.traverse((child: any) => {
            if (child.isMesh) {
                if(Array.isArray(child.material)){
                    for(var i:number = 0; i < child.material.length; i++){
                        child.material[i].roughness = n;
                    }
                }
                else{
                    child.material.roughness = n;
                }
                
            }
        })
        this.roughness = n;
    }

    setMetalness(n:number):void{
        var group = this.scene.getObjectByName("load_scene");
        group.traverse((child: any) => {
            if (child.isMesh) {
                if(Array.isArray(child.material)){
                    for(var i:number = 0; i < child.material.length; i++){
                        child.material[i].metalness = n;
                    }
                }
                else{
                    child.material.metalness = n;
                }
            }
        })
        this.metalness = n;
    }
}