import * as THREE from 'three'
import { Shape } from './Shape';
import { Core } from './Core';
import Tooler from './Tooler';
import listener from '../lib/listener';

export class Stage extends THREE.Group{
    shapes: Array<Shape>;
    grid: THREE.GridHelper;
    axes: THREE.AxesHelper;

    constructor(){
        super();
        this.shapes = new Array<Shape>();
        this.updateHelper(100);
    }

    updateHelper(size:number){
        this.grid && this.remove(this.grid);
        this.axes && this.remove(this.axes);

        var grid = new THREE.GridHelper(size * 2, 100);
        (grid.material as any).transparent = true;
        (grid.material as any).opacity = 0.1;
        this.add(grid);

        var axes: THREE.AxesHelper = new THREE.AxesHelper(size);
        this.add(axes);
        this.grid = grid;
        this.axes = axes;
    }

    addPoints(points:string, type:number){
        var shape:Shape = new Shape(points, type);
        this.add(shape);
        this.shapes.push(shape);
        this.resizeStage();
    }

    getPoints(){
        var list:Array<THREE.Mesh> = new Array<THREE.Mesh>();
        this.shapes.forEach((shape:Shape)=>{
            list = list.concat(shape.points);
        })
        return list;
    }

    changeLineColor(color:string){
        this.shapes.forEach((shape:Shape)=>{
            shape.changeLineColor(color);
        })
    }

    clear(){
        while(this.shapes.length){
            this.remove(this.shapes.pop());
        }
        this.updateHelper(100 * 2);
        this.updateCamera(100);
    }

    updateCamera(max:number){
        // var max:number = Tooler.getMaxSize(this);
        Core.instance.camera.far = max * 10;
        console.log("far = " + Core.instance.camera.far);
        var startPot:THREE.Vector3 = new THREE.Vector3(10, 10, 10);
        var normalizePot:THREE.Vector3 = startPot.normalize();
        var endPot:THREE.Vector3 = normalizePot.setScalar(max);
        console.log('camera position', endPot);
        Core.instance.camera.position.copy(endPot);
        Core.instance.camera.lookAt(new THREE.Vector3());
        Core.instance.orbit.update();
        Core.instance.camera.updateProjectionMatrix();
    }

    resizeStage(){
        this.grid && this.remove(this.grid);
        this.axes && this.remove(this.axes);
        this.grid = null;
        this.axes = null;

        var max:number = Tooler.getMaxSize(this);
        // Core.instance.camera.far = max * 10;
        // console.log("far = " + Core.instance.camera.far);

        this.updateCamera(max);
        
        var range:number = Tooler.getBoxSize(this) / 100;
        listener.emit("setRange", range);
        this.updateHelper(max * 2);
        // this.changeSize(0, range);
    }
}