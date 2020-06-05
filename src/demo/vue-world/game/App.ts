import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 

import listener from '../lib/listener';
import Tooler from './Tooler';
import { Stage } from './Stage';
import { Core } from './Core';

export default class App {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    orbit: OrbitControls;
    group: THREE.Group;
    line: THREE.Line;
    frame: THREE.BoxHelper;
    selectBox: THREE.BoxHelper;
    curItem: THREE.Mesh;
    rayCaster:THREE.Raycaster = new THREE.Raycaster();

    grid:THREE.GridHelper;
    axes: THREE.AxesHelper;
    isMobile:boolean;
    stage: Stage;

    constructor(canvas:HTMLCanvasElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: true,
            canvas: canvas
        });

        window.addEventListener("resize", e => this.onResize(e), false);
        listener.on("points", (points:string, type:number)=>this.addPoints(points, type));
        listener.on("pointColor", (color:string)=>this.changePointColor(color));
        listener.on("lineColor", (color:string)=>this.changeLineColor(color));
        listener.on("size", (size:number)=>this.changeSize(size));
        listener.on("changeVisible", (obj:any)=>{this.changeVisible(obj)});
        listener.on("changePosition", (obj:any)=>{this.changePosition(obj)});
        listener.on("clear", (obj:any)=>{this.clear()});

        this.isMobile = Tooler.checkMobile();

        // canvas.addEventListener("click", (e:MouseEvent)=>this.choose(e));
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.choose(e), false);
    }

    clear(){
        this.stage.clear();
    }

    changeVisible(obj:any){
        // if(this.frame){
        //     this.frame.visible = obj.isFrame;
        // }
        this.stage.axes.visible = obj.isAxes;
        this.stage.grid.visible = obj.isGrid;
    }

    changePosition(obj:any){
        if(this.curItem){
            this.curItem.position.set(obj.x, obj.y, obj.z);
            
            // if(this.selectBox){
            //     this.scene.remove(this.selectBox);
            //     this.selectBox = null;
            // }
            // this.selectBox = new THREE.BoxHelper(this.curItem, new THREE.Color(0xFF0000));
            // this.scene.add(this.selectBox);

            var id:number = this.getCurIndex();
            if(id != -1){
                console.log("id = " + id);
                (this.line.geometry as THREE.Geometry).vertices[id] = new THREE.Vector3(obj.x, obj.y, obj.z);
                (this.line.geometry as THREE.Geometry).verticesNeedUpdate = true;
            }

            // if(this.frame){
            //     this.scene.remove(this.frame);
            //     this.frame = null;
            // }

            // this.frame = new THREE.BoxHelper(this.group, new THREE.Color(0xff9900));
            // this.scene.add(this.frame);
            
        }
    }

    choose(e:any){
        if (this.isMobile) {
            e = e.changedTouches[0];
        }

        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        // if(this.selectBox){
        //     this.scene.remove(this.selectBox);
        //     this.selectBox = null;
        // }
        this.curItem = null;
        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            if(obj.name == 'point'){
                this.curItem = obj;
                // this.selectBox = new THREE.BoxHelper(obj, new THREE.Color(0xFF0000));
                // this.scene.add(this.selectBox);
                listener.emit("setPosition", this.curItem.position);

                var children = obj.parent.children;
                var id = children.findIndex((item:any)=> item == obj);
                listener.emit("setIndex", id, children.length);
            }
        }
    }

    getCurIndex():number{
        var id:number;
        if(this.group){
            id = this.group.children.findIndex((obj:THREE.Object3D, index:number)=>{
                if(obj == this.curItem){
                    return true;
                }
            })
        }
        else{
            id = -1;
        }
        return id;
    }

    getChooseMesh():THREE.Object3D{
        if(this.curItem){
            var id:number = this.getCurIndex();
            if(id != -1){
                return this.group.children[id];
            }
        }
        return null;
    }

    getAimObjects():THREE.Object3D[]{
        var list:THREE.Object3D[] = this.stage.getPoints();
        return list;
    }

    changePointColor(color:string){
        var list:THREE.Object3D[] = this.getAimObjects();
        var mat:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(color)});
        for(var i:number = 0; i < list.length; i++){
            (list[i] as THREE.Mesh).material = mat;
        }
    }

    changeLineColor(color:string){
        this.stage.changeLineColor(color);
    }

    changeSize(size:number){
        if(size <= 0){
            size = 0.01;
        }
        var list:THREE.Object3D[] = this.getAimObjects();
        for(var i:number = 0; i < list.length; i++){
            (list[i] as THREE.Mesh).scale.setScalar(size);
        }
    }

    addPoints(points:string, type:number){
        var list = points.split(";");
        list.forEach((p:string) => {
            this.stage.addPoints(p, type);
        })
    }

    resizeStage(){
        // var max:number = Tooler.getMaxSize(this.scene);
        // var far = max * 10;
        // this.camera.far = far;
        // console.log("far = " + far);
        // this.scene.remove(this.grid);

        // this.grid = new THREE.GridHelper(far, 100);
        // (this.grid.material as any).transparent = true;
        // (this.grid.material as any).opacity = 0.1;
        // // this.grid.scale.addScalar(far / 100);
        // this.scene.add(this.grid);
        
        // var startPot:THREE.Vector3 = new THREE.Vector3(10, 10, 10);
        // var normalizePot:THREE.Vector3 = startPot.normalize();
        // var endPot:THREE.Vector3 = normalizePot.setScalar(max);
        // console.log('camera position', endPot);
        // this.camera.position.copy(endPot);
        // this.camera.lookAt(new THREE.Vector3())
        // this.orbit.update();

        // this.camera.updateProjectionMatrix();
        
        // var range:number = Tooler.getBoxSize(this.group) / 100;
        // listener.emit("setRange", range);
        // this.changeSize(0, range);
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
        this.renderer.render(this.scene, this.camera);
    }

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xFFFFFF));
        // this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(100, 100, 100);

        Core.instance.scene = this.scene;
        Core.instance.camera = this.camera;
        Core.instance.renderer = this.renderer;
        Core.instance.orbit = this.orbit;

        this.stage = new Stage();
        this.scene.add(this.stage);

        // this.addHelper();
        this.animate();

        this.camera.lookAt(new THREE.Vector3());
    }
}