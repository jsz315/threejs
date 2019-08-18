import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export default class App {
    public static ZERO:THREE.Vector3 = new THREE.Vector3();
    public static TOTAL:number = 0;
    public static SELECTED_COLOR:number = 0xff8800;
    public static NORMAL_COLOR:number = 0xa0a0a0;
    public static NORMAL_MATERIAL:THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    tubeMesh: THREE.Mesh;
    tubeFrame: THREE.Mesh;
    orbit: OrbitControls;

    curPot: THREE.Mesh;
    pots: Array<THREE.Mesh>;
    dragControls: DragControls;
    stats: any;
    
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 900);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        window.addEventListener("resize", e => this.onResize(e), false);
    }

    setStats(stats: any){
        this.stats = stats;
    }

    add(param: any){
        this.addPot(param.x, param.y, param.z);
    }

    set(param: any){
        if(this.curPot){
            this.curPot.position.set(param.x, param.y, param.z);
        }
    }

    del(){
        if(this.curPot){
            this.scene.remove(this.curPot);
            this.pots = this.pots.filter(item => {
                return item != this.curPot;
            })
            this.curPot = null;
        }
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
    }

    updateGUIParam(param: any){
        if(this.tubeMesh){
            (this.tubeMesh.material as THREE.MeshBasicMaterial).color = new THREE.Color(param.meshColor);
            (this.tubeFrame.material as THREE.MeshBasicMaterial).color = new THREE.Color(param.lineColor);
            (this.tubeMesh.material as THREE.MeshBasicMaterial).opacity = param.meshOpacity;
            (this.tubeFrame.material as THREE.MeshBasicMaterial).opacity = param.lineOpacity;
        }
    }
    

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = false;
        this.camera.position.set(7.742, 9.887, 13.769);

        this.pots = [];

        this.addPlane();
        this.addPot(0, 0, 0);
        this.addDrag();
        this.animate();

        this.camera.lookAt(App.ZERO);
    }

    toggerControl(use: boolean):void{
        this.orbit.enabled = use;
        this.dragControls.enabled = !use;
    }

    addDrag():void{
        let controls = new TrackballControls( this.camera, this.renderer.domElement );
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        var dragControls = new DragControls( this.pots, this.camera, this.renderer.domElement );
        dragControls.addEventListener( 'dragstart', (e) => {
            this.changeCurPot(e.object);
            controls.enabled = false;
        } );
        dragControls.addEventListener( 'drag', (e) => {
            this.postInfo(e.object);
        } );
        dragControls.addEventListener( 'dragend', () => {
            controls.enabled = true;
        } );

        this.dragControls = dragControls;
    }
   
    addPlane():void{
        this.scene.add(new THREE.GridHelper(80, 80));
        this.scene.add(new THREE.AxesHelper(40));

        new THREE.FontLoader().load("/obj/font/gentilis_bold.typeface.json", (font) => {
            let param = {
                font: font,
                size: 4,
                height: 1
            }
            
            let xw = new THREE.Mesh(new THREE.TextGeometry("X", param), App.NORMAL_MATERIAL);           
            xw.position.set(30, 0, 0);

            let yw = new THREE.Mesh(new THREE.TextGeometry("Y", param), App.NORMAL_MATERIAL);           
            yw.position.set(0, 30, 0);

            let zw = new THREE.Mesh(new THREE.TextGeometry("Z", param), App.NORMAL_MATERIAL);           
            zw.position.set(0, 0, 30);

            this.scene.add(xw);
            this.scene.add(yw);
            this.scene.add(zw);

            xw.geometry.center();
            yw.geometry.center();
            zw.geometry.center();

            // console.log(new THREE.Box3().setFromObject(xw));
        })
        
    }

    changeCurPot(pot: THREE.Mesh){
        if(this.curPot){
            (this.curPot.material as any).color = new THREE.Color(App.NORMAL_COLOR);
        }
        this.curPot = pot;
        (this.curPot.material as any).color = new THREE.Color(App.SELECTED_COLOR);
    }

    getCanvas(n: any){
        let w = 256;
        let h = 256;
        let canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.font = 90 + "px bold";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n, w / 2, h / 2); 
        return canvas;
    }

    postInfo(pot: THREE.Mesh){
        window.dispatchEvent(new CustomEvent("info", {
            detail: {
                position: pot.position
            }
        }))
    }

    addPot(x:number, y:number, z:number){
        let pot = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({
            color: App.SELECTED_COLOR,
            map: new THREE.CanvasTexture(this.getCanvas(++App.TOTAL))
        }));
        pot.position.set(x, y, z);
        this.scene.add(pot);
        this.pots.push(pot);
        this.changeCurPot(pot);
    }

    addpots(list: Array<number>){
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(list), 3));
        // geometry.addAttribute("face", new THREE.BufferAttribute(new Float32Array(list), 3));
        geometry.computeVertexNormals();

        let material = new THREE.MeshBasicMaterial({color: 0xd200ff});
        let mesh = new THREE.Line(geometry, material);
        this.scene.add(mesh);
    }

    draw(){
        if(this.tubeMesh){
            this.scene.remove(this.tubeMesh);
        }

        let pots:Array<THREE.Vector3> = [];
        this.pots.forEach(item => {
            pots.push(item.position);
        })

        var curve = new THREE.CatmullRomCurve3(pots);
        let geometry = new THREE.TubeGeometry(curve, 180, 1, 6, false);
        let material = new THREE.MeshBasicMaterial({
                color: 0xff3388, 
                opacity: 0.5,
                transparent: true
            });
        let mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);

        let wireframeMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            opacity: 0.5, 
            wireframe: true, 
            transparent: true 
        });
        let wireframe = new THREE.Mesh( geometry, wireframeMaterial );
        mesh.add( wireframe );
        
        this.tubeMesh = mesh;
        this.tubeFrame = wireframe;
    }
}