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
    
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(3, 4, 5);
        this.camera.lookAt(new THREE.Vector3());

        this.focusLight = new FocusLight(0xffffff, 1.24);
        this.scene.add(this.focusLight);

        this.loading = new Loading();
        this.scene.add(this.loading);

        window.addEventListener("resize", e => this.onResize(e), false);
    }
    
    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
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
        xhr.open('GET', baseURL + '/obj/gl/win.bin');
        xhr.onprogress = (event) =>{
            if (event.lengthComputable) {
                // console.log(event.loaded);
                // console.log(event.total);
                let n = Math.floor(event.loaded / event.total * 100);
                console.log(n + "%");
                this.loading.update(n + "%");
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
                    alert("加载失败，请刷新页面重新尝试")
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
            this.loading.update(n + "%");
            this.scene.add(this.loading);
        })

        let loader = new GLTFLoader(loadingManager);
        let baseURL = (window as any).CFG.baseURL;
        loader.setPath(baseURL + '/obj/gl/');
        loader.load('win.gltf', (gltf) => {

            console.log("gltf");
            console.log(gltf);

            gltf.scene.traverse((child: any) => {
                if(child.isMesh){
                    child.name = "load_mesh";
                    child.updateMatrix();
                }
            })

            let aim = gltf.scene.children[0].children[0].children[0];
            
            let size = new THREE.Box3().setFromObject(aim).getSize(new THREE.Vector3());
            let max = Math.max(size.x, size.y, size.z);
            let scale = 10 / max;            
            aim.scale.set(scale, scale, scale);
         
            aim.position.set(0, 0, 0);
           
            let group = new THREE.Object3D();
            group.add(aim);
            group.rotateX(Math.PI / 2);

            this.scene.add(group);
        })
    }

    setup():void {
        this.addLights();
        this.prevLoad();
        this.animate();
    }

    addLights():void{
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);
    }
}