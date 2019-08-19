import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export default class App {
    public static ZERO:THREE.Vector3 = new THREE.Vector3();
    public static TOTAL:number = 0;
    public static SELECTED_COLOR:number = 0xff8800;
    public static NORMAL_COLOR:number = 0xa0a0a0;
    public static NORMAL_MATERIAL:THREE.MeshNormalMaterial = new THREE.MeshNormalMaterial();
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    orbit: OrbitControls;

    curObject: THREE.Mesh|THREE.Line;
    pots: Array<THREE.Mesh>;
    dragItems: Array<THREE.Mesh|THREE.Line>;
    stats: any;

    role: THREE.Mesh;
    control: TransformControls;
    rotateNum: number = 0.01;
    translateNum: number = 0.01;
    
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

    setMode(mode: string){
        this.control.setMode(mode);
    }

    set(param: any){
        if(this.curObject){
            this.curObject.position.set(param.x, param.y, param.z);
        }
    }

    del(){
        if(this.curObject){
            this.scene.remove(this.curObject);
            this.dragItems = this.dragItems.filter(item => {
                return item != this.curObject;
            });
            this.pots = this.pots.filter(item => {
                return item != this.curObject;
            });
            this.curObject.geometry.dispose();
            (this.curObject.material as any).dispose();
            this.curObject = null;
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
        this.role.translateZ(this.translateNum);
        this.role.rotateY(this.rotateNum);
       
        this.renderer.render(this.scene, this.camera);
    }

    updateGUIParam(param: any){
        this.rotateNum = param.rotateNum;
        this.translateNum = param.translateNum;
    }
    

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(7.742, 9.887, 13.769);

        this.pots = [];
        this.dragItems = [];

        this.addPlane();

        this.addRole();
        this.addControl();

        this.animate();

        this.camera.lookAt(App.ZERO);
    }

    addControl():void{
        let control = new TransformControls( this.camera, this.renderer.domElement );
        control.addEventListener( 'dragging-changed', ( event )=> {
            this.orbit.enabled = ! event.value;
        } );

        control.attach( this.role );
        this.scene.add( control );
        this.control = control;
    }

    addRole():void{
        this.role = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial());
        this.scene.add(this.role);
        this.role.name = "role";

        // let axis = new THREE.Vector3(0, 1, 0);
        // let matrix = new THREE.Matrix4();
        // matrix.makeRotationAxis(axis.normalize(), 45 * Math.PI / 180);
        // matrix.multiply(this.role.matrix);
        // this.role.matrix = matrix;
        // this.role.setRotationFromMatrix(matrix);
    }
   
    addPlane():void{
        let gridHelper = new THREE.GridHelper(80, 80);
        (gridHelper.material as any).transparent = true;
        (gridHelper.material as any).opacity = 0.1;
        this.scene.add(gridHelper);
        this.scene.add(new THREE.AxesHelper(40));


        new THREE.FontLoader().load((window as any).CFG.baseURL + "/obj/font/gentilis_bold.typeface.json", (font) => {
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
        })
        
    }

    addPots(list: Array<number>){
        for(let i = 0; i < list.length; i += 3){
            let pot = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({
                color: App.SELECTED_COLOR,
                map: new THREE.CanvasTexture(this.getCanvas(++App.TOTAL))
            }));
            pot.position.set(list[i], list[i + 1], list[i + 2]);
            this.scene.add(pot);
            this.pots.push(pot);
            this.dragItems.push(pot);
            pot.name = "pot" + App.TOTAL;
        }
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

    drawObject(){
        let list: number[] = [];
        this.pots.forEach((item: THREE.Mesh) => {
            list.push(item.position.x, item.position.y, item.position.z);
        })
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute("position", new THREE.BufferAttribute(new Float32Array(list), 3));
        // geometry.addAttribute("face", new THREE.BufferAttribute(new Float32Array(list), 3));
        geometry.computeVertexNormals();
        let material = new THREE.MeshBasicMaterial({color: 0xd200ff});
        let mesh = new THREE.Line(geometry, material);
        this.scene.add(mesh);
        mesh.name = "drawObject";

        this.dragItems.push(mesh);
    }
}