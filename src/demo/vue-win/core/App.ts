import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FocusLight from './FocusLight';
import Tooler from './Tooler';
import { FineLoader } from './FineLoader';
import { Effect } from './Effect';
import listener from '../lib/listener';
import TextureList from './TextureList';

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
        this.orbit.minPolarAngle = 0;
        this.orbit.maxPolarAngle = 90 * Math.PI /180;
        this.camera.position.set(-14.267941883040285, 4.752462870020817, -8.486184913116992);
        this.camera.lookAt(new THREE.Vector3());
        console.log("this.camera");
        console.log(this.camera);

        this.focusLight = new FocusLight(0xffffff, this.focusLightIntensity);
        this.scene.add(this.focusLight);
        // this.scene.add(this.focusLight.helper);

        this.fineLoader = new FineLoader();
        this.scene.add(this.fineLoader);

        this.isMobile = Tooler.checkMobile();
        this.rayCaster = new THREE.Raycaster();

        this.effects = [];

        this.textureList = new TextureList();

        window.addEventListener("resize", e => this.onResize(e), false);
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.select(e), false);

        window.addEventListener("all loaded", e => {
            this.setRoughness(this.roughness);
            this.setMetalness(this.metalness);
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

        let aim = new THREE.Object3D();
        aim.name = "aim_scene";
        aim.add(parent);
        this.scene.add(aim);
        this.addGrass();
        this.resetName(this.scene);
        this.initMaterials(parent, true);

        let scale: number = Tooler.getFitScale(parent, 10);
        if(scale != 0){
            // parent.scale.multiplyScalar(scale);
            // this.isFitScene = true;
            // let offset: THREE.Vector3 = Tooler.getOffsetVector3(aim);
            // console.log("offset ==== ");
            // console.log(offset);
            // aim.position.set(0 - offset.x, 0 - offset.y, 0 - offset.z);

            this.resetScene();
        }

        // !this.isFitScene && this.resetScene();
    }

    resetScene(){
        var aim = this.scene.getObjectByName("aim_scene");
        var parent = this.scene.getObjectByName("load_scene");
        let scale: number = Tooler.getFitScale(parent, 10);
        // parent.position.set(0, 0, 0);
        if(scale != 0){
            parent.scale.multiplyScalar(scale);
            this.isFitScene = true;
            let offset: THREE.Vector3 = Tooler.getOffsetVector3(aim);
            aim.position.set(0 - offset.x, 0 - offset.y, 0 - offset.z);

            let size = Tooler.getBoxSize(aim);
            this.scene.getObjectByName("grass").position.y = -size.y / 2 - 0.1;
        }
        
    }

    addGrass(){
        var mat = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load("./asset/grass2.jpg"),
            side: THREE.DoubleSide
        })
        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.set(200, 200);
        // mat.metalness = 0;
        // mat.roughness = 1;
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), mat);
        plane.rotateX(-90 * Math.PI / 180);
        plane.name = "grass";
        this.scene.add(plane);
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
        // var group = this.scene.getObjectByName("aim_scene");
        var obj = param.obj;
        let {position, rotation, scale} = param.attr;
        obj.position.set(position[0], position[1], position[2]);
        obj.rotation.set(rotation[0], rotation[1], -rotation[2]);
        obj.scale.set(scale[0], scale[1], scale[2]);
        group.add(obj);

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
        var path = "./asset/skybox/";
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
                map: new THREE.TextureLoader().load("./asset/sky.jpg"),
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