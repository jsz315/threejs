import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 
import { Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { resolve } from 'path';
const TWEEN = require('tween')

export default class App {
    
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    stats: any;
    geometry: THREE.Geometry;
    font: any;
    pots: any[] = [];
    potId: number = 0;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        window.addEventListener("resize", e => this.onResize(e), false);
    }
    
    onResize(e:Event):void{
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    setStats(stats: any):void{
        this.stats = stats;
    }

    animate():void {
        requestAnimationFrame(() => {
            this.animate();
        });
        this.stats && this.stats.update();
        TWEEN.update();
        this.geometry && (this.geometry.verticesNeedUpdate = true);
        this.renderer.render(this.scene, this.camera);
    }

    updateGUIParam(param: any){

    }

    async setup() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0x909090));
        this.renderer.shadowMap.enabled = true;
      
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(7.742, 9.887, 13.769);

        this.addLights();
        this.animate();
        this.camera.lookAt(new THREE.Vector3());
        document.body.appendChild(this.renderer.domElement);

        let pot1 = await this.loadFont();
        let pot2 = await this.loadTree();

        // let pot1 = [new THREE.Vector3(4, -3, 5)];
        // let pot2 = [new THREE.Vector3(0, 8, 9), new THREE.Vector3(3, 0, 9)];

        this.pots.push(pot1, pot2);
        this.toggle();
    }
    
    addObj(vertices: THREE.Vector3[]){
        console.log(this.pots);
        let max = Math.max(this.pots[0].length, this.pots[1].length);
        let len = vertices.length;
        if(this.geometry){
            for(let i = 0; i < max; i++){
                let obj = vertices[i % len];
                new TWEEN.Tween(this.geometry.vertices[i]).to({...obj}, 3000).start();
            }
        }
        else{
            this.geometry = new THREE.Geometry();
            let material = new THREE.PointsMaterial({
                size: 4,
                vertexColors: THREE.VertexColors,
                sizeAttenuation: false
            })

            for(let i = 0; i < max; i++){
                let obj = vertices[i % len];
                this.geometry.vertices.push(new THREE.Vector3(obj.x, obj.y, obj.z));
                this.geometry.colors.push(new THREE.Color().setHSL( Math.random(), 1, 0.75 ));
            }
            let particle = new THREE.Points(this.geometry, material);
            this.scene.add(particle);
        }

        console.log("total:" + vertices.length);
    }

    loadFont(){
        return new Promise(resolve=>{
            new THREE.FontLoader().load((window as any).CFG.baseURL + "/obj/font/gentilis_bold.typeface.json", (font) => {
                this.font = font;
                resolve(new THREE.SphereGeometry(40, 40, 40).vertices);
            });
        })
    }

    toggle(){
        if(++this.potId >= this.pots.length){
            this.potId = 0;
        }
        console.log("pot id : " + this.potId)
        this.addObj(this.pots[this.potId]);
    }

    loadTree(){
        return new Promise(resolve=>{
            let loader = new GLTFLoader();
            let baseURL = (window as any).CFG.baseURL;
            loader.setPath(baseURL + '/obj/glTF/');
            loader.load('tree.gltf', (gltf) => {

                gltf.scene.traverse((child: any) => {
                    if(child.isMesh){
                        child.updateMatrix();
                    }
                })

                let aim:any = gltf.scene.children[0].children[0];
                let scale = 10;    
                aim.scale.set(scale, scale, scale);
                aim.geometry.center();
                // aim.updateMatrix();

                let list: THREE.Vector3[] = [];
                let nums = aim.geometry.attributes.position.array;
                for(let i = 0, len = nums.length; i < len; i += 3){
                    let pot = new THREE.Vector3();
                    pot.set(nums[i], nums[i + 1], nums[i + 2]);
                    list.push(pot);
                }

                console.log("tree:" + list.length);
                resolve(list);
            })
        });
    }

    addText(str: string):THREE.Vector3[]{
        let param = {
            font: this.font,
            size: 20,
            height: 4
        }
        
        let word = new THREE.Mesh(new THREE.TextGeometry(str, param), new THREE.MeshStandardMaterial({
            color: 0xffffff,
	        wireframe: true
        }));
        word.geometry.center();
        return (word.geometry as THREE.Geometry).vertices;
    }

    addLights():void{
        var ambient:THREE.AmbientLight = new THREE.AmbientLight(0xffffff);
        ambient.intensity = 0.4;
        this.scene.add(ambient);
    }
}