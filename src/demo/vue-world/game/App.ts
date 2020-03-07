import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 

import listener from '../lib/listener';
import Tooler from './Tooler';

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

    constructor(canvas:HTMLCanvasElement) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 12000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            canvas: canvas
        });

        window.addEventListener("resize", e => this.onResize(e), false);
        listener.on("points", (points:string)=>this.addPoints(points));
        listener.on("pointColor", (type:number, color:string)=>this.changePointColor(type, color));
        listener.on("lineColor", (color:string)=>this.changeLineColor(color));
        listener.on("size", (type:number, size:number)=>this.changeSize(type, size));
        listener.on("changeVisible", (obj:any)=>{this.changeVisible(obj)});
        listener.on("changePosition", (obj:any)=>{this.changePosition(obj)});

        this.isMobile = Tooler.checkMobile();

        // canvas.addEventListener("click", (e:MouseEvent)=>this.choose(e));
        canvas.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e: any) => this.choose(e), false);
    }

    changeVisible(obj:any){
        if(this.frame){
            this.frame.visible = obj.isFrame;
        }
        this.axes.visible = obj.isAxes;
        this.grid.visible = obj.isGrid;
    }

    changePosition(obj:any){
        if(this.curItem){
            this.curItem.position.set(obj.x, obj.y, obj.z);
            
            if(this.selectBox){
                this.scene.remove(this.selectBox);
                this.selectBox = null;
            }
            this.selectBox = new THREE.BoxHelper(this.curItem, new THREE.Color(0xFF0000));
            this.scene.add(this.selectBox);

            var id:number = this.getCurIndex();
            if(id != -1){
                console.log("id = " + id);
                (this.line.geometry as THREE.Geometry).vertices[id] = new THREE.Vector3(obj.x, obj.y, obj.z);
                (this.line.geometry as THREE.Geometry).verticesNeedUpdate = true;
            }

            if(this.frame){
                this.scene.remove(this.frame);
                this.frame = null;
            }

            this.frame = new THREE.BoxHelper(this.group, new THREE.Color(0xff9900));
            this.scene.add(this.frame);
            
        }
    }

    choose(e:any){
        if (this.isMobile) {
            e = e.changedTouches[0];
        }

        let mouse = new THREE.Vector2();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        if(this.selectBox){
            this.scene.remove(this.selectBox);
            this.selectBox = null;
        }
        this.curItem = null;
        let obj: any;
        this.rayCaster.setFromCamera(mouse, this.camera);
        let list = this.scene.children;
        let intersectObjects = this.rayCaster.intersectObjects(list, true);
        if (intersectObjects[0]) {
            obj = intersectObjects[0].object;
            if(obj != this.grid && obj != this.axes){
                this.curItem = obj;
                this.selectBox = new THREE.BoxHelper(obj, new THREE.Color(0xFF0000));
                this.scene.add(this.selectBox);
                listener.emit("setPosition", this.curItem.position);
            }
           
        }
        listener.emit("setIndex", this.getCurIndex(), this.group ? this.group.children.length : 0);
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

    getAimObjects(type:number):THREE.Object3D[]{
        var list:THREE.Object3D[] = [];
        if(type == 0){
            list = this.group.children;
        }
        else if(type == 1){
            var obj:THREE.Object3D = this.getChooseMesh();
            if(obj){
                list.push(obj);
            }
        }
        else{
            if(this.group.children.length > 0){
                list.push(this.group.children[0]);
            }
        }
        return list;

    }

    changePointColor(type:number, color:string){
        var list:THREE.Object3D[] = this.getAimObjects(type);
        var mat:THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: new THREE.Color(color)});
        for(var i:number = 0; i < list.length; i++){
            (list[i] as THREE.Mesh).material = mat;
        }
    }

    changeLineColor(color:string){
        this.line.material = new THREE.MeshBasicMaterial({color: new THREE.Color(color)});
    }

    changeSize(type:number, size:number){
        if(size <= 0){
            size = 0.01;
        }
        var list:THREE.Object3D[] = this.getAimObjects(type);
        for(var i:number = 0; i < list.length; i++){
            (list[i] as THREE.Mesh).scale.setScalar(size);
        }
    }

    addPoints(points:string){
        if(this.group){
            while(this.group.children.length > 0){
                this.group.remove(this.group.children[0]);
            }
        }
        else{
            this.group = new THREE.Group();
        }

        if(this.line){
            this.scene.remove(this.line);
        }

        if(this.frame){
            this.scene.remove(this.frame);
        }
        
        this.scene.add(this.group);
        var list:Array<THREE.Vector3> = Tooler.getVector3(points);
        if(list.length > 0){
            var ps:Array<THREE.Mesh> = Tooler.getPoints(list);
            for(var i:number = 0; i < ps.length; i++){
                this.group.add(ps[i]);
            }
            this.line = Tooler.getLines(list);
            this.scene.add(this.line);

            this.frame = new THREE.BoxHelper(this.group, new THREE.Color(0xff9900));
            this.scene.add(this.frame);
        }
        else{
            alert("顶点数应该为3的倍数");
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
        this.renderer.render(this.scene, this.camera);
    }

    setup():void {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(new THREE.Color(0xFFFFFF));
        this.renderer.shadowMap.enabled = true;
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbit.enabled = true;
        this.camera.position.set(7.742, 9.887, 13.769);

        this.addHelper();
        this.animate();

        this.camera.lookAt(new THREE.Vector3());
    }

   
    addHelper():void{
        var grid:THREE.GridHelper = new THREE.GridHelper(400, 400);
        // grid.scale.addScalar(10);
        (grid.material as any).transparent = true;
        (grid.material as any).opacity = 0.1;
        this.scene.add(grid);

        var axes: THREE.AxesHelper = new THREE.AxesHelper(100);
        this.scene.add(axes);

        this.grid = grid;
        this.axes = axes;
    }
}