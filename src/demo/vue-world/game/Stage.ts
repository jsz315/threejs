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

        var grid = new THREE.GridHelper(size, 100);
        (grid.material as any).transparent = true;
        (grid.material as any).opacity = 0.1;
        this.add(grid);

        var axes: THREE.AxesHelper = new THREE.AxesHelper(size);
        this.add(axes);
        this.grid = grid;
        this.axes = axes;
    }

    addPoints(points:string){
        var shape:Shape = new Shape(points);
        this.add(shape);
        this.shapes.push(shape);
        this.resizeStage();
    }

    resizeStage(){
        var max:number = Tooler.getMaxSize(Core.instance.scene);
        var far = max * 10;
        Core.instance.camera.far = far;
        console.log("far = " + far);
        
        var startPot:THREE.Vector3 = new THREE.Vector3(10, 10, 10);
        var normalizePot:THREE.Vector3 = startPot.normalize();
        var endPot:THREE.Vector3 = normalizePot.setScalar(max);
        console.log('camera position', endPot);
        Core.instance.camera.position.copy(endPot);
        Core.instance.camera.lookAt(new THREE.Vector3());
        Core.instance.orbit.update();

        Core.instance.camera.updateProjectionMatrix();
        
        var range:number = Tooler.getBoxSize(this) / 100;
        listener.emit("setRange", range);

        this.updateHelper(far);
        // this.changeSize(0, range);
    }
}