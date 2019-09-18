import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import FocusLight from './FocusLight';
import Loading from './Loading';

export default class App {
    public static ZERO:THREE.Vector3 = new THREE.Vector3();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    focusLight: FocusLight;
    loading: Loading;

    roughness: number = 0.5;
    metalness: number = 0.05;
    focusLightIntensity: number = 4.4;
    ambientLightIntensity: number = 4.8;


    constructor(canvas: any) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerWidth, 0.1, 900);
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
        this.camera.position.set(3, 4, 5);
        this.camera.lookAt(new THREE.Vector3());

        this.focusLight = new FocusLight(0xffffff, this.focusLightIntensity);
        this.scene.add(this.focusLight);

        this.loading = new Loading();
        this.scene.add(this.loading);

        window.addEventListener("resize", e => this.onResize(e), false);
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

    prevLoad():void{
        console.log("start load");
        let baseURL = (window as any).CFG.baseURL;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', baseURL + '/obj/gl/men.glb');
        xhr.onprogress = (event) =>{
            if (event.lengthComputable) {
                // console.log(event.loaded);
                // console.log(event.total);
                let n = Math.floor(event.loaded / event.total * 100);
                console.log(n + "%");
                this.loading.update("加载中", n + "%");
                this.scene.add(this.loading);
            }
        };
        xhr.onreadystatechange = () => { // 状态发生变化时，函数被回调
            if (xhr.readyState === 4) { // 成功完成
                // 判断响应结果:
                if (xhr.status === 200) {
                    // 成功，通过responseText拿到响应的文本:
                    this.loadObject();
                } else {
                    // 失败，根据响应码判断失败原因:
                    alert("加载失败，请刷新页面重新尝试");
                }
            } else {
                // HTTP请求还在继续...
            }
        }
        xhr.send();
  
        // xhr.responseType = "blob";
    }

    loadObject():void{
        let loadingManager = new THREE.LoadingManager(()=>{
            console.log("loaded");
            this.scene.remove(this.loading);
        }, (url:string, loaded:number, total:number)=>{
            let n = Math.floor(loaded / total * 100); 
            console.log("load " + n + "%");
            this.loading.update("初始化", n + "%", "#00a215");
            this.scene.add(this.loading);
        })

        let loader = new GLTFLoader(loadingManager);
        let baseURL = (window as any).CFG.baseURL;
        // loader.setPath(baseURL + '/obj/gl/');
        loader.setCrossOrigin('anonymous');
        // loader.setCrossOrigin('*');
        loader.load(baseURL + '/obj/gl/men.glb', (gltf) => {

            console.log("gltf");
            console.log(gltf);

            this.fitModel(gltf.scene);
        })
    }

    fitModel(group:THREE.Object3D):void{
        var offset:THREE.Vector3 = this.getOffsetVector3(group);
        let scale:number = this.getFitScale(group, 10);
        let aim = new THREE.Object3D();
        while(group.children.length){
            let obj = group.children[0];
            let p = obj.position;
            obj.position.set(p.x - offset.x, p.y - offset.y, p.z - offset.z);
            aim.add(obj);
        }
        aim.scale.multiplyScalar(scale);
        // aim.rotateX(-Math.PI / 2);
        this.scene.add(aim);
        aim.name = "load_scene";

        this.setRoughness(this.roughness);
        this.setMetalness(this.metalness);
    }

    getOffsetVector3(obj: THREE.Object3D):THREE.Vector3{
        let box = new THREE.Box3().setFromObject(obj);
        let x = (box.min.x + box.max.x) / 2;
        let y = (box.min.y + box.max.y) / 2;
        let z = (box.min.z + box.max.z) / 2;
        let offset: THREE.Vector3 = new THREE.Vector3(x, y, z);
        return offset;
    }

    getFitScale(obj: THREE.Object3D, num: number):number{
        let box = new THREE.Box3().setFromObject(obj);
        let size = box.getSize(new THREE.Vector3());
        let max = Math.max(size.x, size.y, size.z);
        let scale = num / max;
        return scale;
    }

    setup():void {
        this.addLights();
        this.prevLoad();
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