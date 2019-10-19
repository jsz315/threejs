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
    
    ambientLightIntensity: number = 0.5;
    focusLightIntensity: number = 1.32;
    roughness: number = 0.27;
    metalness: number = 0.17;
    
    rayCaster: THREE.Raycaster;
    isMobile: boolean;
    curMaterial: any;
    effect: Effect;

    constructor(canvas: any) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerWidth, 0.1, 2400);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: canvas
        });
        // this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xd2d2d2));
        this.renderer.shadowMap.enabled = true;
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
    }
    
    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerWidth;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerWidth);
    }

    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });
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
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerWidth) * 2 + 1;

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
                console.log(img.width + "x" + img.height);
                console.log(obj.material.map);
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

        this.initMaterials(parent);
    }

    initMaterials(parent:THREE.Object3D){
        let materials = Tooler.getAllMaterial(parent);
        materials.forEach((m:any) => {
            if(m.map){
                if(m.map.image.src.indexOf("/IPR_") != -1){
                    this.curMaterial = m;
                    console.log("门框材质定位成功");
                }
            }
            m.transparent = true;
            m.alphaTest = 0.1;
        })
    }

    changeMap(url:string):void{
        let material: any = this.curMaterial;
        let texture = new THREE.TextureLoader().load(url, () => {
            material.map.needsUpdate = true;
            material.needsUpdate = true;
        });

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat = new THREE.Vector2(1, 1);
        texture.flipY = !material.map.flipY;
        material.map = texture;
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