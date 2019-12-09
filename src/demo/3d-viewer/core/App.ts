import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import FocusLight from './FocusLight';
import Tooler from './Tooler';
import { FineLoader } from './FineLoader';
import listener from '../lib/listener';

export default class App {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    focusLight: FocusLight;
    fineLoader: FineLoader;
    rayCaster: THREE.Raycaster;
    isMobile: boolean;
    size: any;
    canvas: any;

    constructor(canvas: any) {
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
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x999999), 0);
        this.renderer.shadowMap.enabled = false;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.orbit.minPolarAngle = 0;
        this.orbit.maxPolarAngle = 90 * Math.PI /180;
        this.camera.position.set(-14.267941883040285, 4.752462870020817, -8.486184913116992);
        this.camera.lookAt(new THREE.Vector3());

        this.focusLight = new FocusLight(0xffffff, 0.4);
        this.scene.add(this.focusLight);

        this.fineLoader = new FineLoader();
        this.scene.add(this.fineLoader);

        this.isMobile = Tooler.checkMobile();
        this.rayCaster = new THREE.Raycaster();

        this.init();

        window.addEventListener("resize", e => this.onResize(e), false);
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.select(e), false);

        listener.on("file", (fileList:any)=>{this.fineLoader.load(fileList)});
        listener.on("loaded", (obj:any)=>{this.addObj(obj)});
        listener.on("param", (attr:string, num:number)=>{this.transform(attr, num)});
    }

    transform(attr:string, num:number){
        var obj = this.scene.getObjectByName("load_obj");
        if(attr == "x"){
            obj.rotateX(-Math.PI / 2);
        }
        else if(attr == "y"){
            obj.rotateY(-Math.PI / 2);
        }
        else if(attr == "z"){
            obj.rotateZ(-Math.PI / 2);
        }
    }

    getStageSize(usePixel?: boolean) {
        var size: any = { width: window.innerWidth };
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

    addObj(obj:THREE.Object3D){
        this.fitModel(obj);
    }

    fitModel(group: THREE.Object3D): void {
        let parent: THREE.Object3D = group;
        let scale: number = Tooler.getFitScale(parent, 10);
        parent.scale.multiplyScalar(scale);
        // parent.rotateX(-Math.PI / 2);
        parent.name = "load_obj";
        this.scene.add(parent);

        let aim = new THREE.Object3D();
        aim.add(parent);
        this.scene.add(aim);
        let offset: THREE.Vector3 = Tooler.getOffsetVector3(aim);
        aim.position.set(0 - offset.x, 0 - offset.y, 0 - offset.z);

        let size = Tooler.getBoxSize(aim);
        this.addGrass(size.y);
    }

    addGrass(h:number){
        var mat = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load("./asset/grass2.jpg"),
            side: THREE.DoubleSide
        })
        mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
        mat.map.repeat.set(200, 200);
        mat.metalness = 0;
        mat.roughness = 0.9;
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 1000), mat);
        plane.rotateX(-90 * Math.PI / 180);
        plane.position.y = -h / 2 - 0.1;
        plane.name = "grass";
        this.scene.add(plane);
    }

    init(): void {
        // let url = Tooler.getQueryString("url");
        // this.fineLoader.start(url, (object3D: THREE.Object3D) => {
        //     this.fitModel(object3D);
        // })

        this.addSkySphere();
        this.addLights();
        this.animate();
    }

    addLights(): void {
        var ambient: THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);
    }

    addSkySphere(){
        var mat = new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("./asset/sky.jpg"),
                side: THREE.BackSide
            });
        var sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 32), mat);
        this.scene.add(sky);
    }
}